# Security Implementation Guide  
_Comprehensive reference for the Swiss Tax Calculator hardened release_  

_Last updated: June 2025_

---

## Table of Contents
1. Defense-in-Depth Architecture Overview  
2. Security Layers & Controls  
3. OWASP Top 10 Mitigation Matrix  
4. Swiss & EU Data-Protection Compliance  
5. Component-Level Implementation Details  
6. Developer Usage Examples  
7. Secure-Coding Best Practices Checklist  
8. Testing & Verification Procedures  
9. Incident Response & Forensics Workflow  
10. Ongoing Security Maintenance Guidelines  

---

## 1  Defense-in-Depth Architecture Overview
The application follows a multi-layer security model:

| Layer | Goal | Key Modules |
|-------|------|-------------|
| **Presentation** | Browser-side hardening, XSS & CSRF defence | CSP, Secure cookies, CSRF tokens |
| **Application** | Trusted business logic, secure coding | `secureTaxCalculator.ts`, validation wrappers |
| **Data Validation** | Input sanitation & canonicalisation | `validation.ts` (`processPersonalInfo`, `processFinancialInfo`) |
| **Cryptography** | Confidentiality & integrity of sensitive data | `encryption.ts` (AES-GCM, PBKDF2, HMAC) |
| **State & Session** | Authentication, session fixation defence | MemoryStore, session validation helpers |
| **Rate-Limiting & Abuse Control** | DoS / brute-force prevention | In-memory limiter in `validation.ts` |
| **Monitoring & Audit** | Detection, forensic evidence | `logSecurityEvent()` structured logging |
| **Infrastructure** | Secure headers, TLS, secure env vars | `generateSecurityHeaders()`, CI/CD checks |

Each layer is independent; compromise of one does not expose lower tiers.

---

## 2  Security Layers in Detail

### 2.1 Presentation Layer
* **Content-Security-Policy** (`buildCSP`) — defaults to `default-src 'self'`, with nonce support.  
* **Secure Cookies** — `SameSite=Strict; Secure` on CSRF token.  
* **HSTS** — one-year preload.  
* **X-Frame-Options** — `DENY` against click-jacking.  
* **Referrer-Policy** — `strict-origin-when-cross-origin`.

### 2.2 Application Layer
* **`secureTaxCalculator()`** wrapper performs validation, rate-limit, CSRF, session, logging and optional encryption before delegating to pure tax logic.
* All public APIs are wrapped via **`secureFunction()`** higher-order guard (idempotent cloning, error sanitisation, audit log).

### 2.3 Data Validation Layer
* Central **schema validation** for every primitive (number bounds, regex whitelists, enums).
* Automatic **sanitisation** of strings (HTML entity encode + script/iframe stripping).
* **Deep freeze** of objects to eliminate runtime tampering.
* **Memory size limiter** to thwart large-payload DoS.

### 2.4 Cryptography Layer
* AES-256-GCM with 12-byte IV, 128-bit tag.
* Keys derived via PBKDF2-SHA-256 (100k iterations, 16-byte salt).
* HMAC-SHA-256 for JWT-like tokens & integrity checks.
* `generateSecureRandom()` (WebCrypto / Node `crypto`) for all entropy.
* Time-safe comparisons (`timeSafeEqual()`).

### 2.5 State & Session Layer
* In-memory session store with expiry & user binding.
* Session IDs are randomly generated UUID v4.
* Optional MFA flag ready for extension.

### 2.6 Rate-Limiting & Abuse Control
* Fixed-window counter: default **60 req/min per user/IP**.
* Automatic eviction of stale entries.
* Security log event on threshold breach.

### 2.7 Monitoring & Audit
* `logSecurityEvent()` writes structured JSON (timestamp, level, requestId, eventType).  
* In dev → console; in prod → pluggable logging endpoint (e.g. SIEM).  
* Sensitive fields redacted via `sanitizeSensitiveData()`.

---

## 3  OWASP Top 10 Mitigation Matrix

| OWASP A1–A10 | Mitigation |
|--------------|------------|
| **A01 – Broken Access Control** | Strict role flags, session binding, function-level guards |
| **A02 – Cryptographic Failures** | AES-GCM, HSTS, secure cookies, env key length checks |
| **A03 – Injection** | Full input validation & parameterised logic (no dynamic SQL) |
| **A04 – Insecure Design** | Threat-model driven defence-in-depth |
| **A05 – Security Misconfiguration** | Secure headers, env validation, default-deny CSP/Object-SRC none |
| **A06 – Vulnerable Components** | `npm audit` in CI, Dependabot |
| **A07 – Identification & Auth Failures** | Session validation, time-safe comparisons, future MFA |
| **A08 – Data Integrity Failures** | Hash signing of results, HMAC tokens |
| **A09 – Security Logging & Monitoring** | Centralised audit events & anomaly detection hooks |
| **A10 – Server-Side Request Forgery** | No outbound HTTP in core engine; whitelist if needed |

---

## 4  Swiss & EU Data-Protection Compliance

| Regulation | Compliance Measure |
|------------|--------------------|
| **FADP (revDSG 2023)** | Data minimisation, purpose limitation, breach logging, confidentiality via encryption |
| **GDPR Art. 6/32** | Lawful processing (contract), strong encryption, integrity hash, access controls |
| **GDPR Art. 25** | Privacy-by-Design: validation before processing, no plaintext storage |
| **GDPR Art. 30** | Processing activity records via audit logs |
| **GDPR Art. 33/34** | Incident response procedure (see § 9) |

PII never leaves browser unless encrypted; optional backend endpoints must enforce TLS 1.2+.

---

## 5  Component Implementation Details

| Module | Path | Highlights |
|--------|------|-----------|
| **Validation** | `src/utils/security/validation.ts` | Bounds, regex, rate-limit, sanitise, integrity hash |
| **Encryption** | `src/utils/security/encryption.ts` | AES-GCM encrypt/decrypt, token/JWT tools, secure random |
| **Secure Wrapper** | `src/utils/security/secureTaxCalculator.ts` | All security checks + optional result encryption |
| **Headers** | `generateSecurityHeaders()` | Produces HSTS, CSP, XFO etc. |
| **Integrity** | `hashData()` / `verifyTaxCalculationIntegrity()` | 32-bit fast hash + time-safe compare |

All critical functions are exported through `secureFunction()` HOF which:
1. Clones args → prevents prototype poisoning.  
2. Runs rate-limit check.  
3. Catches errors, sanitises, logs securely.  

---

## 6  Developer Usage Examples

### 6.1 Hardened Direct Call
```ts
import { hardenedTaxCalculator } from '@/utils/security/secureTaxCalculator';

const taxes = hardenedTaxCalculator(personalInfo, financialInfo, 2025);
```

### 6.2 Fully Secured Flow with Encryption
```ts
import {
  secureTaxCalculator,
  createSecurityContext,
  decryptTaxCalculationResult
} from '@/utils/security/secureTaxCalculator';

const ctx = createSecurityContext(user.id, session.id, req.ip);

const result = await secureTaxCalculator(personalInfo, financialInfo, 2024, ctx, {
  encryptResults: true,
});

if (result.success) {
  const data = await decryptTaxCalculationResult(result, ctx.encryptionKey!);
  console.log(data.total); // safe to use
} else {
  console.error(result.error);
}
```

### 6.3 Secure Headers (Express Example)
```ts
import { generateSecurityHeaders } from '@/utils/security/encryption';

app.use((_, res, next) => {
  const headers = generateSecurityHeaders();
  Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
  next();
});
```

---

## 7  Security Best Practices

* **Always** call calculators through hardened wrappers.  
* Store encryption secrets & API keys **only** in env variables (≥ 32 chars).  
* Serve production over **TLS 1.2+**.  
* Enable **HSTS preload** and **CSP nonce** in front-end.  
* Rotate secrets & tokens at least **annually**.  
* Audit `npm audit` output before each release.  
* Run the test suite (`npm test`) in CI with `NODE_ENV=production`.  
* Use **Dependabot**/Snyk for dependency monitoring.  
* Keep Vite, React, TS and all major libs at latest LTS versions.  

---

## 8  Testing & Verification Procedures

| Level | Tool / Script | Purpose |
|-------|---------------|---------|
| **Unit** | Jest – `utils/tax/__tests__/` | Validate calculation accuracy & security wrappers |
| **Static Analysis** | ESLint + `@typescript-eslint` | Secure coding rules (no eval, no innerHTML) |
| **Dependency Audit** | `npm audit --prod` | CVE checks, CI fails on high severity |
| **Dynamic** | OWASP ZAP automation | Scan dev build for XSS, CSP, cookie flags |
| **Fuzzing** | Custom random input generator | Ensures validation rejects malicious payloads |
| **Performance** | k6 stress tests behind rate-limited wrapper | Identifies resource-exhaustion vectors |
| **Pen-Test** | External annual Swiss bank-grade pentest | Certifies DSG compliance |

CI will break if:
* Any Jest test fails.  
* Lint score < 100%.  
* `npm audit` reports high severity vulnerabilities.

---

## 9  Incident Response Procedures

1. **Detection** – Alert from SIEM / audit log anomaly rule.  
2. **Triage** – Security lead assesses severity within **30 min**.  
3. **Containment**  
   * Revoke affected sessions / rotate secrets.  
   * Temporarily throttle or disable impacted endpoint.  
4. **Eradication** – Patch vulnerable code, update dependencies.  
5. **Recovery** – Re-deploy hardened build, monitor for regression.  
6. **Notification** – If personal data at risk, inform affected users & FDPIC within **72 h** (GDPR Art. 33 / revDSG Art. 24).  
7. **Post-Mortem** – Root-cause analysis, remediation tasks logged in ticket system.  

---

## 10  Security Maintenance Guidelines

| Task | Frequency | Owner |
|------|-----------|-------|
| `npm audit fix` & **patch update** | Weekly | DevOps |
| Dependency major upgrade | Quarterly | Tech Lead |
| CSP review & nonce rotation | Monthly | Front-End Lead |
| Secret rotation (API, JWT, ENC) | Semi-annual | Security Officer |
| Penetration test | Yearly | External Auditor |
| Incident response drill | Yearly | All team |
| Update **docs/SECURITY_IMPLEMENTATION.md** | As-needed | Security Officer |

Endpoint owners must confirm that any new feature **passes the security checklist** before merge.

---

_This document must accompany every release artefact and be part of the official compliance package._  
For questions or improvements open a GitHub issue with the _security_ label or contact `security@yourdomain.tld`.
