export default {
  translation: {
    common: {
      save: 'Speichern',
      cancel: 'Abbrechen',
      loading: 'Wird geladen...',
      error: 'Ein Fehler ist aufgetreten',
      success: 'Erfolgreich gespeichert'
    },
    header: {
      home: 'Startseite',
      about: 'Über uns',
      contact: 'Kontakt'
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
            protestant: 'Protestantisch',
            other: 'Andere'
          }
        },
        person2: {
          title: 'Person 2',
          age: 'Alter Person 2',
          religion: {
            label: 'Religion Person 2',
            none: 'Keine',
            romanCatholic: 'Römisch-katholisch',
            protestant: 'Protestantisch',
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
        }
      },
      financialInfo: {
        title: 'Finanzielle Angaben',
        yearlyIncome: 'Jahreseinkommen (CHF)',
        spouseYearlyIncome: 'Jahreseinkommen Ehepartner (CHF)',
        wealthAmount: 'Vermögen (CHF)',
        mortgageDebt: 'Hypothekenschulden (CHF)',
        pensionContributions: 'Beiträge Pensionskasse (CHF)',
        spousePensionContributions: 'Beiträge Pensionskasse Ehepartner (CHF)',
        pillar3aContributions: 'Beiträge Säule 3a (CHF)',
        spousePillar3aContributions: 'Beiträge Säule 3a Ehepartner (CHF)',
        charitableDonations: 'Spenden (CHF)',
        currentTaxBurden: 'Aktuelle Steuerbelastung (CHF)',
        propertyOwnership: 'Ich besitze Immobilien',
        selfEmployed: 'Ich bin selbständig erwerbstätig',
        spouseSelfEmployed: 'Mein Ehepartner ist selbständig erwerbstätig'
      }
    },
    navigation: {
      next: 'Weiter',
      back: 'Zurück',
      viewRecommendations: 'Empfehlungen anzeigen',
      saveAndContinue: 'Speichern und fortfahren'
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
      }
    },
    optimizations: {
      aiTitle: 'KI-Steueroptimierungsempfehlungen',
      aiDescription: 'Basierend auf Ihrer individuellen Situation haben wir folgende Steueroptimierungen identifiziert:',
      totalPotentialSavings: 'Gesamtes Einsparpotenzial',
      recommendedProviders: 'Empfohlene Anbieter',
      minInvestment: 'Minimale Investition',
      impact: 'Auswirkung',
      confidence: 'Verlässlichkeit',
      potentialSavings: 'Mögliche Einsparungen',
      steps: 'Schritte',
      risks: 'Risiken',
      requirements: 'Voraussetzungen',
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
        commission: 'Provisionssatz',
        contact: 'Kontaktperson',
        email: 'E-Mail',
        phone: 'Telefon',
        notes: 'Notizen',
        status: 'Status',
        active: 'Aktiv',
        inactive: 'Inaktiv'
      }
    }
  }
};