import React, { Suspense, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from './stores/authStore';
import { logSecurityEvent, sanitizeError, SECURITY_CONSTANTS } from './utils/security/validation';
import { generateSecurityHeaders, warnIfInsecure, buildCSP, CSPConfig } from './utils/security/encryption';

// Layouts
import { Header } from './components/Header';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Import existing components directly
import { PersonalInfoForm } from './components/PersonalInfoForm';
import { FinancialInfoForm } from './components/FinancialInfoForm';
import { TaxOptimizationResults } from './components/TaxOptimizationResults';
import { LoginForm } from './components/auth/LoginForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { AdminDashboard } from './components/admin/AdminDashboard';
// import AffiliateManagement from './components/admin/affiliates/AffiliateManagement'; // Removed
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminUserList } from './components/admin/AdminUserList';
// import { AboutPage as AboutPageComponent } from './components/AboutPage'; // Removed
// import { ContactPage as ContactPageComponent } from './components/ContactPage'; // Removed


interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorId?: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logSecurityEvent({
      level: SECURITY_CONSTANTS.LOG_LEVELS.ERROR,
      message: 'Unhandled application error caught by ErrorBoundary',
      data: {
        error: error.message,
        componentStack: errorInfo.componentStack,
      },
    });
    this.setState({ errorId: undefined });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const sanitizedMessage = sanitizeError(new Error('An unexpected error occurred.'));
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
          <p className="text-gray-700 mb-2">{sanitizedMessage}</p>
          {this.state.errorId && <p className="text-sm text-gray-500">Error ID: {this.state.errorId}</p>}
          <p className="text-gray-600 mt-4">
            Please try refreshing the page or contact support if the problem persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple inline components for routes
const CalculatorFormsPage = () => (
  <div className="space-y-8">
    <PersonalInfoForm />
    {/* Navigation to FinancialInfoForm is handled within PersonalInfoForm */}
  </div>
);

const FinancialInfoPage = () => (
  <div className="space-y-8">
    <FinancialInfoForm />
  </div>
);


const ResultsPage = () => <TaxOptimizationResults />;
const LoginPageComponent = () => <LoginForm />;
const ForgotPasswordPageComponent = () => <ForgotPasswordForm />;
const AdminDashboardPageComponent = () => <AdminDashboard />;
// const AdminAffiliatesPageComponent = () => <AffiliateManagement />; // Replaced with placeholder
const AdminAffiliatesPlaceholderPage = () => (
  <div>
    <h1 className="text-xl font-bold">Affiliate Management</h1>
    <p>This page is under construction.</p>
  </div>
);
const AdminSettingsPageComponent = () => <AdminSettings />;
const AdminUsersPageComponent = () => <AdminUserList />;

const AboutPlaceholderPage = () => (
  <div>
    <h1 className="text-xl font-bold">About Us</h1>
    <p>Information about the Swiss Tax Calculator AI will be here.</p>
  </div>
);

const ContactPlaceholderPage = () => (
  <div>
    <h1 className="text-xl font-bold">Contact Us</h1>
    <p>Contact information will be available here.</p>
    {/* Consider adding a simple ContactForm component here if it exists and is stable */}
  </div>
);


const NotFoundPageComponent = () => (
  <div className="text-center py-10">
    <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
    <p className="mt-4">The page you are looking for does not exist.</p>
  </div>
);


function App() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }));
  const isAdmin = user?.role === 'admin';


  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng') || 'en';
    i18n.changeLanguage(savedLanguage);

    logSecurityEvent({
      level: SECURITY_CONSTANTS.LOG_LEVELS.INFO,
      message: 'Application started',
      data: { userAgent: navigator.userAgent, language: savedLanguage }
    });

    warnIfInsecure();

    const cspConfig: CSPConfig = {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
      upgradeInsecureRequests: true,
    };
    const headers = generateSecurityHeaders({ enableCSP: true, reportOnly: false });

    let cspMetaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!cspMetaTag) {
      cspMetaTag = document.createElement('meta');
      cspMetaTag.setAttribute('http-equiv', 'Content-Security-Policy');
      document.head.appendChild(cspMetaTag);
    }
    cspMetaTag.setAttribute('content', buildCSP(cspConfig));

    logSecurityEvent({
      level: SECURITY_CONSTANTS.LOG_LEVELS.INFO,
      message: 'Conceptual security headers and CSP meta tag applied.',
      data: { headers: Object.keys(headers), csp: cspMetaTag.getAttribute('content') }
    });

  }, [i18n]);

  return (
    <Router>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Suspense fallback={<div className="text-center py-10">{t('common.loading')}</div>}>
              <Routes>
                <Route path="/" element={<Navigate to="/calculator" replace />} />
                <Route path="/about" element={<AboutPlaceholderPage />} />
                <Route path="/contact" element={<ContactPlaceholderPage />} />
                <Route path="/login" element={<LoginPageComponent />} />
                <Route path="/forgot-password" element={<ForgotPasswordPageComponent />} />
                
                <Route path="/calculator" element={<CalculatorFormsPage />} />
                <Route path="/financial-info" element={<FinancialInfoPage />} />

                <Route
                  path="/results"
                  element={
                    <ProtectedRoute
                      isAuthenticated={isAuthenticated}
                      element={<ResultsPage />}
                    />
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute
                      isAuthenticated={isAuthenticated}
                      isAdminRoute={true}
                      isAdmin={isAdmin}
                      element={<AdminDashboardPageComponent />}
                    />
                  }
                />
                <Route
                  path="/admin/affiliates"
                  element={
                    <ProtectedRoute
                      isAuthenticated={isAuthenticated}
                      isAdminRoute={true}
                      isAdmin={isAdmin}
                      element={<AdminAffiliatesPlaceholderPage />}
                    />
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute
                      isAuthenticated={isAuthenticated}
                      isAdminRoute={true}
                      isAdmin={isAdmin}
                      element={<AdminSettingsPageComponent />}
                    />
                  }
                />
                  <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute
                      isAuthenticated={isAuthenticated}
                      isAdminRoute={true}
                      isAdmin={isAdmin}
                      element={<AdminUsersPageComponent />}
                    />
                  }
                />

                <Route path="/404" element={<NotFoundPageComponent />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
          </main>
          <footer className="bg-gray-100 text-center py-4 text-sm text-gray-600 border-t">
            © {new Date().getFullYear()} {t('appName', {defaultValue: 'Swiss Tax Calculator AI'})}. {t('footer.allRightsReserved', {defaultValue: 'All rights reserved.'})}
          </footer>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
