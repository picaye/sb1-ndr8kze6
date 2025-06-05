export default {
  translation: {
    common: {
      save: 'Speichern',
      cancel: 'Abbrechen',
      loading: 'Wird geladen...',
      error: 'Ein Fehler ist aufgetreten',
      success: 'Erfolgreich gespeichert',
      viewDetails: 'Details anzeigen',
      hideDetails: 'Details ausblenden',
      applyNow: 'Jetzt beantragen',
      learnMore: 'Mehr erfahren'
    },
    header: {
      home: 'Startseite',
      about: 'Über uns',
      contact: 'Kontakt',
      dashboard: 'Dashboard',
      settings: 'Einstellungen',
      logout: 'Abmelden'
    },
    auth: {
      welcomeBack: 'Willkommen zurück',
      createAccount: 'Konto erstellen',
      loginPrompt: 'Bitte melden Sie sich an, um fortzufahren',
      login: 'Anmelden',
      signUp: 'Registrieren',
      email: 'E-Mail',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      continueWithGoogle: 'Mit Google fortfahren',
      forgotPassword: {
        link: 'Passwort vergessen?',
        title: 'Passwort zurücksetzen',
        description: 'Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.',
        submit: 'Link senden',
        sending: 'Wird gesendet...',
        checkEmail: 'Bitte überprüfen Sie Ihre E-Mail für den Link zum Zurücksetzen des Passworts.'
      },
      validation: {
        invalid: 'Ungültige E-Mail oder Passwort',
        googleError: 'Konnte nicht mit Google anmelden',
        passwordMismatch: 'Passwörter stimmen nicht überein',
        emailNotFound: 'Kein Konto mit dieser E-Mail-Adresse gefunden'
      },
      orContinueWith: 'oder fortfahren mit',
      needAccount: 'Benötigen Sie ein Konto? Registrieren',
      alreadyHaveAccount: 'Haben Sie bereits ein Konto? Anmelden',
      backToLogin: 'Zurück zur Anmeldung'
    },
    forms: {
      personalInfo: {
        title: 'Persönliche Angaben',
        person1: {
          title: 'Person 1',
          age: 'Alter Person 1',
          religion: {
            label: 'Religion Person 1',
            none: 'Keine',
            romanCatholic: 'Römisch-katholisch',
            protestant: 'Evangelisch-reformiert',
            other: 'Andere'
          }
        },
        person2: {
          title: 'Person 2 (Ehepartner/Partner)',
          age: 'Alter Person 2',
          religion: {
            label: 'Religion Person 2',
            none: 'Keine',
            romanCatholic: 'Römisch-katholisch',
            protestant: 'Evangelisch-reformiert',
            other: 'Andere'
          }
        },
        maritalStatus: {
          label: 'Zivilstand',
          single: 'Ledig',
          married: 'Verheiratet',
          registeredPartnership: 'Eingetragene Partnerschaft',
          divorced: 'Geschieden',
          widowed: 'Verwitwet'
        },
        canton: 'Kanton',
        municipality: 'Gemeinde',
        selectMunicipality: 'Gemeinde auswählen',
        children: {
          question: 'Haben Sie Kinder?',
          number: 'Anzahl Kinder'
        },
        isWithholdingTaxEligible: 'Quellensteuerpflichtig?'
      },
      financialInfo: {
        title: 'Finanzielle Angaben',
        yearlyIncome: 'Jahreseinkommen (CHF)',
        spouseYearlyIncome: 'Jahreseinkommen Ehepartner (CHF)',
        wealthAmount: 'Liquides Vermögen (CHF)',
        spouseWealthAmount: 'Liquides Vermögen Ehepartner (CHF)',
        totalWealth: 'Gesamtes Bruttovermögen (CHF) (inkl. Immobilien, Anlagen)',
        totalLiabilities: 'Gesamte Verbindlichkeiten/Schulden (CHF) (inkl. Hypothek)',
        mortgageDebt: 'Hypothekarschulden (CHF)',
        pensionContributions: 'Jährliche Beiträge Pensionskasse (2. Säule) (CHF)',
        spousePensionContributions: 'Jährliche Beiträge Pensionskasse Ehepartner (2. Säule) (CHF)',
        pillar3aContributions: 'Jährliche Beiträge Säule 3a (CHF)',
        spousePillar3aContributions: 'Jährliche Beiträge Säule 3a Ehepartner (CHF)',
        charitableDonations: 'Jährliche Spenden (CHF)',
        additionalDeductions: 'Weitere steuerlich abzugsfähige Ausgaben (CHF)',
        currentTaxBurden: 'Aktuell geschätzte jährliche Steuerbelastung (CHF)',
        propertyOwnership: 'Ich besitze Immobilien in der Schweiz',
        selfEmployed: 'Ich bin selbständig erwerbstätig',
        spouseSelfEmployed: 'Mein Ehepartner ist selbständig erwerbstätig'
      }
    },
    navigation: {
      next: 'Weiter',
      back: 'Zurück',
      viewRecommendations: 'Empfehlungen anzeigen',
      saveAndContinue: 'Speichern und fortfahren',
      calculateTaxes: 'Steuern berechnen'
    },
    validation: {
      municipality: {
        required: 'Bitte wählen Sie eine Gemeinde aus',
        invalid: 'Bitte wählen Sie eine gültige Gemeinde aus'
      },
      pillar3a: {
        negativeAmount: 'Der Betrag darf nicht negativ sein',
        incomeRequired: 'Jahreseinkommen ist erforderlich',
        ageRestriction: 'Das Alter muss zwischen 18 und 70 liegen',
        maxAmount: 'Maximaler Beitrag ist {{amount}} CHF'
      },
      generic: {
        required: 'Dieses Feld ist erforderlich',
        invalidNumber: 'Bitte geben Sie eine gültige Zahl ein',
        positiveNumber: 'Bitte geben Sie eine positive Zahl ein',
        numberRange: 'Der Wert muss zwischen {{min}} und {{max}} liegen',
        maxLength: 'Die maximale Länge beträgt {{count}} Zeichen'
      }
    },
    optimizations: {
      aiTitle: 'KI-Steueroptimierungsempfehlungen',
      aiDescription: 'Basierend auf Ihrer individuellen Situation haben wir folgende Steueroptimierungen identifiziert:',
      totalPotentialSavings: 'Gesamtes Einsparpotenzial',
      recommendedProviders: 'Empfohlene Anbieter',
      minInvestment: 'Minimale Investition',
      impact: 'Auswirkung',
      confidence: 'Konfidenz',
      potentialSavings: 'Mögliche Einsparungen',
      steps: 'Implementierungsschritte',
      risks: 'Mögliche Risiken',
      requirements: 'Voraussetzungen',
      timeline: 'Geschätzter Zeitrahmen',
      legalReferences: 'Gesetzliche Grundlagen',
      suitability: 'Eignung',
      cantonSpecific: 'Kantonspezifisch',
      multiYearProjection: 'Mehrjahresprojektion (CHF)',
      years: 'Jahre',
      annualSavings: 'Jährliche Einsparungen',
      cumulativeSavings: 'Kumulierte Einsparungen',
      providerType: 'Anbietertyp',
      rating: 'Bewertung',
      fees: 'Gebühren',
      languages: 'Sprachen',
      pillar3a: {
        title: 'Maximierung der Säule 3a Beiträge',
        description: 'Nutzen Sie Ihren Säule 3a-Freibetrag voll aus, um das steuerbare Einkommen zu reduzieren und steuerbegünstigte Altersguthaben aufzubauen. Dies ist eine der effektivsten und einfachsten Steuersparmassnahmen in der Schweiz.',
        steps: {
          increase: 'Erhöhen Sie Ihren jährlichen Beitrag um {{amount}} CHF, um den Maximalbetrag zu erreichen.',
          split: 'Erwägen Sie die Aufteilung auf mehrere Säule 3a-Konten für eine gestaffelte Auszahlung und um die Steuerprogression zu brechen.',
          invest: 'Investieren Sie Ihr Säule 3a-Guthaben in ein diversifiziertes Portfolio für potenziell höhere langfristige Renditen.'
        },
        requirements: {
          income: 'Ausreichendes steuerbares Einkommen (AHV-pflichtig).',
          horizon: 'Langfristiger Anlagehorizont (bis zur Pensionierung).'
        },
        timeline: 'Jährlich, vor Jahresende.',
        legal: {
          bvg: 'Art. 82 BVG (Berufliche Vorsorge)',
          tax: 'Art. 33 DBG (Bundesgesetz über die direkte Bundessteuer)'
        }
      },
      spousePillar3a: {
        title: 'Maximierung der Säule 3a Beiträge des Ehepartners',
        description: 'Falls zutreffend, stellen Sie sicher, dass auch Ihr Ehepartner seinen Säule 3a-Freibetrag voll ausschöpft, um das gemeinsame steuerbare Einkommen weiter zu senken und die Altersvorsorge zu stärken.',
        steps: {
          increase: 'Erhöhen Sie den jährlichen Beitrag des Ehepartners um {{amount}} CHF, um dessen Maximalbetrag zu erreichen.',
          split: 'Erwägen Sie die Aufteilung der Säule 3a-Konten des Ehepartners für gestaffelte Auszahlungen.',
          invest: 'Investieren Sie das Säule 3a-Guthaben des Ehepartners in ein diversifiziertes Portfolio.'
        },
        requirements: {
          income: 'Ehepartner hat ausreichendes steuerbares Einkommen (AHV-pflichtig).',
          horizon: 'Langfristiger Anlagehorizont für den Ehepartner.'
        },
        timeline: 'Jährlich, vor Jahresende.'
      },
      pension: {
        title: 'Optimierung der Pensionskasseneinkäufe (2. Säule)',
        description: 'Tätigen Sie freiwillige Einkäufe in Ihre Pensionskasse, um bestehende Lücken zu schliessen. Diese Einkäufe sind vollumfänglich steuerlich abzugsfähig und können Ihr steuerbares Einkommen erheblich reduzieren, insbesondere in Jahren mit hohem Einkommen.',
        steps: {
          request: 'Fordern Sie bei Ihrer Pensionskasse eine Bescheinigung über Ihr Einkaufspotenzial an.',
          calculate: 'Berechnen Sie den optimalen Einkaufsbetrag basierend auf Ihrer Steuersituation und Liquidität.',
          plan: 'Planen Sie Einkäufe über mehrere Jahre, um die Steuervorteile gegebenenfalls zu glätten.'
        },
        requirements: {
          potential: 'Vorhandene Pensionskassenlücke (Einkaufspotenzial).',
          liquidity: 'Ausreichende liquide Mittel für den Einkauf.',
          planning: 'Sorgfältige Planung, insbesondere bei geplanter Frühpensionierung oder Vorbezug für Wohneigentum.'
        },
        risks: {
          liquidity: 'Gelder sind bis zur Pensionierung gebunden (mit Ausnahmen).',
          regulations: 'Reglemente der Pensionskassen können sich ändern.'
        },
        timeline: 'Kann jährlich erfolgen; Fristen bei der Pensionskasse beachten.',
        legal: {
          bvg: 'Art. 60-60d BVG (Berufliche Vorsorge)',
          tax: 'Art. 33 DBG (Bundesgesetz über die direkte Bundessteuer)'
        }
      },
      property: {
        title: 'Strategische Immobilieninvestition',
        description: 'Die Investition in Immobilien kann Steuervorteile wie den Abzug von Hypothekarzinsen und Unterhaltskosten bieten. Bei selbstgenutztem Wohneigentum wird der Eigenmietwert besteuert, Abzüge können dies jedoch kompensieren.',
        steps: {
          evaluate: 'Prüfen Sie, ob Wohneigentum zu Ihren finanziellen Zielen und Ihrem Risikoprofil passt.',
          mortgage: 'Optimieren Sie die Hypothekarstruktur (z.B. direkte vs. indirekte Amortisation).',
          energy: 'Erwägen Sie energieeffiziente Sanierungen für zusätzliche Abzüge und langfristige Einsparungen.'
        },
        risks: {
          market: 'Schwankungen am Immobilienmarkt.',
          interest: 'Veränderungen der Hypothekarzinssätze.',
          maintenance: 'Laufende Unterhaltskosten.'
        },
        requirements: {
          equity: 'Ausreichendes Eigenkapital (i.d.R. 20%).',
          income: 'Tragbares Einkommensniveau für Hypothekarzahlungen.',
          credit: 'Gute Bonität.'
        },
        timeline: 'Langfristig (5-10+ Jahre).',
        legal: {
          tax: 'Art. 21, 32, 34 DBG (Bundesgesetz über die direkte Bundessteuer)',
          mortgage: 'Relevante kantonale und eidgenössische Immobiliengesetze.'
        }
      },
      propertyOptimization: {
        title: 'Optimierung der Besteuerung von bestehendem Wohneigentum',
        description: 'Wenn Sie Wohneigentum besitzen, optimieren Sie Abzüge für Hypothekarzinsen, Unterhalt und Renovationen. Eine strategische Schuldenverwaltung und werterhaltende Investitionen können Ihre Steuerlast senken.',
        steps: {
          mortgage: 'Überprüfen Sie Ihre Hypothek: Erwägen Sie zinsgünstige Optionen oder indirekte Amortisation über die Säule 3a zur Steueroptimierung.',
          renovation: 'Planen Sie werterhaltende und energiesparende Renovationen; diese sind oft abzugsfähig.',
          timing: 'Bündeln Sie Unterhaltskosten in bestimmten Jahren, um gegebenenfalls Pauschalabzüge zu übersteigen.'
        },
        risks: {
          interest: 'Änderungen der Hypothekarzinssätze können die Tragbarkeit beeinflussen.',
          value: 'Der Wert der Immobilie steigt möglicherweise nicht wie erwartet.'
        },
        timeline: 'Laufend, mit spezifischen Massnahmen jährlich oder periodisch.'
      },
      business: {
        title: 'Optimierung der Geschäftsstruktur (für Selbständigerwerbende)',
        description: 'Für Selbständigerwerbende kann die Wahl der richtigen Rechtsform (Einzelfirma, GmbH, AG) erhebliche steuerliche Auswirkungen haben. Die Optimierung von Geschäftsunkosten und der Vorsorgeplanung ist ebenfalls entscheidend.',
        steps: {
          evaluate: 'Prüfen Sie, ob Ihre aktuelle Rechtsform (z.B. Einzelfirma) optimal ist oder ob ein Wechsel zu einer GmbH/AG Vorteile bietet.',
          optimize: 'Maximieren Sie abzugsfähige Geschäftsunkosten (Büro, Reisen, Ausrüstung).',
          review: 'Überprüfen Sie regelmässig die finanzielle und steuerliche Situation Ihres Unternehmens mit einem Berater.'
        },
        risks: {
          setup: 'Kosten und administrativer Aufwand bei Änderung der Rechtsform.',
          admin: 'Erhöhter administrativer Aufwand bei Kapitalgesellschaften.',
          transition: 'Mögliche steuerliche Konsequenzen während des Übergangs.'
        },
        requirements: {
          revenue: 'Ausreichender Geschäftsumsatz und -gewinn.',
          structure: 'Verständnis der verschiedenen Rechtsformen.',
          planning: 'Langfristige Geschäfts- und Finanzplanung.'
        },
        timeline: 'Mittel- bis langfristige Planung; rechtliche Änderungen können Monate dauern.',
        legal: {
          or: 'Schweizerisches Obligationenrecht (OR)',
          tax: 'Relevante eidgenössische und kantonale Steuergesetze für Unternehmen.'
        }
      },
      wealth: {
        title: 'Strategische Vermögensverwaltung & Asset Allocation',
        description: 'Optimieren Sie Ihre Vermögenssteuerbelastung durch eine effiziente Strukturierung Ihrer Vermögenswerte. Dies kann die Diversifizierung von Anlagen, die Berücksichtigung steuereffizienter Anlagevehikel und die Verwaltung von Verbindlichkeiten umfassen.',
        steps: {
          structure: 'Überprüfen Sie die Vermögensallokation auf Steuereffizienz (z.B. Fokus auf Dividenden vs. Kapitalgewinne).',
          diversify: 'Diversifizieren Sie Anlagen über verschiedene Anlageklassen und geografische Regionen.',
          timing: 'Steuern Sie den Zeitpunkt von Vermögensverkäufen, um die Kapitalgewinnbesteuerung gegebenenfalls zu optimieren (obwohl für Privatpersonen in der CH i.d.R. nicht besteuert).'
        },
        risks: {
          market: 'Anlagemarktrisiken.',
          liquidity: 'Einige steuereffiziente Strukturen können die Liquidität einschränken.',
          compliance: 'Einhaltung komplexer Finanzvorschriften sicherstellen.'
        },
        requirements: {
          assets: 'Erhebliches steuerbares Vermögen.',
          horizon: 'Langfristiger Anlagehorizont.',
          advice: 'Professionelle Finanz- und Steuerberatung.'
        },
        timeline: 'Laufend, mit jährlichen Überprüfungen.',
        legal: {
          cantonal: 'Kantonale Vermögenssteuergesetze.',
          federal: 'Eidgenössische Richtlinien zur Vermögensbewertung.'
        }
      },
      inheritance: {
        title: 'Proaktive Erbschafts- & Nachlassplanung',
        description: 'Planen Sie Ihren Nachlass frühzeitig, um die Erbschafts- und Schenkungssteuern für Ihre Begünstigten zu minimieren. Dies variiert stark je nach Kanton und Verwandtschaftsgrad.',
        steps: {
          planning: 'Entwickeln Sie einen umfassenden Nachlassplan inklusive Testament und möglicherweise Ehe-/Erbverträgen.',
          gifts: 'Erwägen Sie steuereffiziente Schenkungen zu Lebzeiten (kantonale Schenkungssteuerregeln und Rückforderungsfristen beachten).',
          structures: 'Prüfen Sie Strukturen wie Stiftungen oder Nutzniessungsvereinbarungen bei grossen Vermögen.'
        },
        risks: {
          legal: 'Komplexes Rechtsgebiet, das Expertenrat erfordert.',
          control: 'Verlust der Kontrolle über zu Lebzeiten verschenkte Vermögenswerte.',
          changes: 'Familienverhältnisse und Steuergesetze können sich ändern.'
        },
        requirements: {
          assets: 'Erhebliche Vermögenswerte für die Planung.',
          family: 'Klares Verständnis der Familiensituation und Wünsche.',
          legal: 'Professionelle Rechts- und Steuerberatung.'
        },
        timeline: 'Langfristige Planung, Überprüfung alle 5-10 Jahre oder bei wichtigen Lebensereignissen.',
        legal: {
          civil: 'Schweizerisches Zivilgesetzbuch (ZGB) zum Erbrecht.',
          cantonal: 'Kantonale Erbschafts- und Schenkungssteuergesetze.'
        }
      },
      family: {
        title: 'Optimierung familienbezogener Steuerabzüge',
        description: 'Maximieren Sie Abzüge für Kinder, wie z.B. Kinderbetreuungskosten, Ausbildungskosten (wo zutreffend) und Versicherungsprämien. Stellen Sie sicher, dass alle berechtigten Familienmitglieder in der Steuererklärung korrekt berücksichtigt werden.',
        steps: {
          childcare: 'Ziehen Sie die tatsächlichen Kinderbetreuungskosten bis zu den kantonalen Limiten ab.',
          education: 'Prüfen Sie die Abzugsfähigkeit von Ausbildungs-/Weiterbildungskosten für Kinder.',
          deductions: 'Stellen Sie sicher, dass alle kinderbezogenen Abzüge (z.B. für Versicherungen) geltend gemacht werden.'
        },
        requirements: {
          children: 'Vorhandensein von unterhaltsberechtigten Kindern.',
          expenses: 'Tatsächliche, belegte Ausgaben für Kinderbetreuung oder Ausbildung.',
          documentation: 'Belege und Verträge für alle geltend gemachten Ausgaben aufbewahren.'
        },
        timeline: 'Jährlich, bei der Erstellung der Steuererklärung.',
        legal: {
          federal: 'Bundesgesetz über die direkte Bundessteuer (DBG) zu Familienabzügen.',
          cantonal: 'Kantonale Steuergesetze bezüglich Familien- und Kinderabzügen.'
        }
      },
      charity: {
        title: 'Strategische Spendentätigkeit',
        description: 'Spenden an anerkannte gemeinnützige Organisationen sind bis zu einem bestimmten Prozentsatz Ihres Nettoeinkommens steuerlich abzugsfähig (i.d.R. 20% auf Bundesebene, variiert je nach Kanton). Planen Sie Ihre Spenden für maximale Steuereffizienz.',
        steps: {
          timing: 'Bündeln Sie Spenden in einem einzigen Jahr, um gegebenenfalls Pauschalabzüge zu übersteigen.',
          methods: 'Erwägen Sie die Spende von Vermögenswerten mit Wertsteigerung anstelle von Bargeld für potenzielle zusätzliche Vorteile (Berater konsultieren).',
          documentation: 'Bewahren Sie alle Spendenbescheinigungen von berechtigten Organisationen auf.'
        },
        requirements: {
          income: 'Ausreichendes Einkommen, um Spenden wirksam zu machen.',
          eligible: 'Spenden müssen an steuerbefreite, anerkannte gemeinnützige Organisationen erfolgen.',
          documentation: 'Offizielle Spendenbescheinigungen.'
        },
        timeline: 'Jährlich oder über mehrere Jahre geplant.',
        legal: {
          federal: 'Art. 33a DBG (Bundesgesetz über die direkte Bundessteuer).',
          deductions: 'Kantonale Regelungen zu Spendenabzügen.'
        }
      },
      taxloss: {
        title: 'Verlustverrechnung bei Kapitalanlagen (Tax Loss Harvesting)',
        description: 'Wenn Sie steuerpflichtige Kapitalanlagen haben (z.B. als professioneller Händler oder über eine juristische Person), realisieren Sie Kapitalverluste strategisch, um Kapitalgewinne auszugleichen und so das steuerbare Anlageeinkommen zu reduzieren.',
        steps: {
          review: 'Überprüfen Sie Ihr Anlageportfolio regelmässig auf Anlagen mit nicht realisierten Verlusten.',
          timing: 'Realisieren Sie Verluste vor Jahresende, um Gewinne innerhalb derselben Steuerperiode auszugleichen.',
          reinvest: 'Achten Sie auf "Wash Sale"-Regeln, wenn Sie ähnliche Vermögenswerte kurz nach dem Verkauf wieder erwerben.'
        },
        risks: {
          market: 'Verkauf mit Verlust kristallisiert diesen Verlust; Markt könnte sich erholen.',
          wash: 'Komplexe "Wash Sale"-Regeln können Steuervorteile zunichtemachen, wenn sie nicht sorgfältig befolgt werden.'
        },
        timeline: 'Typischerweise gegen Ende des Steuerjahres.',
      },
      multiYear: {
        assumptions: {
          inflation: 'Nimmt eine durchschnittliche jährliche Inflation von 2% an.',
          taxRates: 'Nimmt an, dass die aktuellen Steuersätze und -tarife stabil bleiben.',
          income: 'Nimmt an, dass Ihr Einkommen relativ stabil bleibt oder moderat wächst.'
        }
      },
      providerTypes: {
        bank: 'Bank',
        insurance: 'Versicherungsgesellschaft',
        pension_fund: 'Pensionskasse',
        tax_advisor: 'Steuerberater',
        financial_advisor: 'Finanzberater',
        real_estate: 'Immobilienspezialist',
        fintech: 'FinTech-Anbieter',
        legal: 'Rechtsberater / Anwalt'
      },
      legalDisclaimer: {
        title: 'Rechtlicher Hinweis',
        text: 'Die hier präsentierten Steueroptimierungsvorschläge sind unverbindliche Empfehlungen basierend auf den von Ihnen bereitgestellten Informationen. Sie ersetzen keine professionelle Steuerberatung. Wir übernehmen keine Haftung für die Richtigkeit und Vollständigkeit der Informationen oder die daraus resultierenden steuerlichen Konsequenzen. Bitte konsultieren Sie einen qualifizierten Steuerberater für Ihre individuelle Situation.'
      }
    },
    admin: {
      affiliates: {
        title: 'Partner-Management',
        addNew: 'Neuen Partner hinzufügen',
        name: 'Name',
        website: 'Webseite',
        commission: 'Provisionssatz (%)',
        contact: 'Kontaktperson',
        email: 'E-Mail',
        phone: 'Telefon',
        notes: 'Notizen',
        status: 'Status',
        active: 'Aktiv',
        inactive: 'Inaktiv',
        editAffiliate: 'Partner bearbeiten',
        deleteAffiliate: 'Partner löschen',
        confirmDelete: 'Sind Sie sicher, dass Sie diesen Partner löschen möchten?',
        clicks: 'Klicks',
        conversions: 'Konversionen',
        conversionRate: 'Konversionsrate',
        totalCommission: 'Gesamte Provision (CHF)',
        noAffiliates: 'Keine Partner gefunden. Fügen Sie einen hinzu, um zu starten!'
      },
      dashboard: {
        title: 'Admin Dashboard',
        totalUsers: 'Benutzer gesamt',
        taxCalculations: 'Steuerberechnungen heute',
        activeSessions: 'Aktive Sitzungen',
        optimizationViews: 'Optimierungsansichten',
        recentActivity: 'Letzte Aktivitäten',
        systemStatus: 'Systemstatus',
        allSystemsOperational: 'Alle Systeme betriebsbereit.'
      },
      settings: {
        title: 'Admin Einstellungen',
        general: 'Allgemeine Einstellungen',
        applicationName: 'Anwendungsname',
        defaultLanguage: 'Standardsprache',
        maintenanceMode: 'Wartungsmodus',
        security: 'Sicherheitseinstellungen',
        maxLoginAttempts: 'Max. Anmeldeversuche',
        sessionTimeout: 'Sitzungs-Timeout (Minuten)',
        apiKeys: 'API-Schlüssel',
        manageApiKeys: 'API-Schlüssel verwalten',
        notifications: 'Benachrichtigungen',
        adminEmail: 'Admin E-Mail für Benachrichtigungen'
      }
    }
  }
};
