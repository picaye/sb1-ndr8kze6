export default {
  translation: {
    common: {
      save: 'Salva',
      cancel: 'Annulla',
      loading: 'Caricamento...',
      error: 'Si è verificato un errore',
      success: 'Salvato con successo'
    },
    header: {
      home: 'Home',
      about: 'Chi siamo',
      contact: 'Contatti'
    },
    auth: {
      welcomeBack: 'Bentornato',
      createAccount: 'Crea account',
      loginPrompt: 'Accedi per continuare',
      login: 'Accedi',
      signUp: 'Registrati',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Conferma password',
      continueWithGoogle: 'Continua con Google',
      forgotPassword: {
        link: 'Password dimenticata?',
        title: 'Reimposta password',
        description: 'Inserisci il tuo indirizzo email e ti invieremo un link per reimpostare la password.',
        submit: 'Invia link di reset',
        sending: 'Invio in corso...',
        checkEmail: 'Controlla la tua email per il link di reimpostazione della password.'
      },
      validation: {
        invalid: 'Email o password non validi',
        googleError: 'Impossibile accedere con Google',
        passwordMismatch: 'Le password non corrispondono',
        emailNotFound: 'Nessun account trovato con questo indirizzo email'
      },
      orContinueWith: 'o continua con',
      needAccount: 'Hai bisogno di un account? Registrati',
      alreadyHaveAccount: 'Hai già un account? Accedi',
      backToLogin: 'Torna al login'
    },
    forms: {
      personalInfo: {
        title: 'Informazioni personali',
        person1: {
          title: 'Persona 1',
          age: 'Età Persona 1',
          religion: {
            label: 'Religione Persona 1',
            none: 'Nessuna',
            romanCatholic: 'Cattolica romana',
            protestant: 'Protestante',
            other: 'Altra'
          }
        },
        person2: {
          title: 'Persona 2',
          age: 'Età Persona 2',
          religion: {
            label: 'Religione Persona 2',
            none: 'Nessuna',
            romanCatholic: 'Cattolica romana',
            protestant: 'Protestante',
            other: 'Altra'
          }
        },
        maritalStatus: {
          label: 'Stato civile',
          single: 'Celibe/Nubile',
          married: 'Sposato/a',
          registeredPartnership: 'Unione registrata',
          divorced: 'Divorziato/a',
          widowed: 'Vedovo/a'
        },
        canton: 'Cantone',
        municipality: 'Comune',
        selectMunicipality: 'Seleziona comune',
        children: {
          question: 'Hai figli?',
          number: 'Numero di figli'
        }
      },
      financialInfo: {
        title: 'Informazioni finanziarie',
        yearlyIncome: 'Reddito annuale (CHF)',
        spouseYearlyIncome: 'Reddito annuale del coniuge (CHF)',
        wealthAmount: 'Patrimonio totale (CHF)',
        mortgageDebt: 'Debito ipotecario (CHF)',
        pensionContributions: 'Contributi cassa pensione (CHF)',
        spousePensionContributions: 'Contributi cassa pensione del coniuge (CHF)',
        pillar3aContributions: 'Contributi pilastro 3a (CHF)',
        spousePillar3aContributions: 'Contributi pilastro 3a del coniuge (CHF)',
        charitableDonations: 'Donazioni benefiche (CHF)',
        currentTaxBurden: 'Carico fiscale attuale (CHF)',
        propertyOwnership: 'Possiedo immobili',
        selfEmployed: 'Sono lavoratore autonomo',
        spouseSelfEmployed: 'Il mio coniuge è lavoratore autonomo'
      }
    },
    navigation: {
      next: 'Avanti',
      back: 'Indietro',
      viewRecommendations: 'Visualizza raccomandazioni',
      saveAndContinue: 'Salva e continua'
    },
    validation: {
      municipality: {
        required: 'Seleziona un comune',
        invalid: 'Seleziona un comune valido'
      },
      pillar3a: {
        negativeAmount: 'L\'importo non può essere negativo',
        incomeRequired: 'Il reddito annuale è obbligatorio',
        ageRestriction: 'L\'età deve essere tra 18 e 70 anni',
        maxAmount: 'Il contributo massimo è {{amount}} CHF'
      }
    },
    optimizations: {
      aiTitle: 'Raccomandazioni di ottimizzazione fiscale IA',
      aiDescription: 'Sulla base della tua situazione individuale, abbiamo identificato le seguenti ottimizzazioni fiscali:',
      totalPotentialSavings: 'Potenziale di risparmio totale',
      recommendedProviders: 'Fornitori raccomandati',
      minInvestment: 'Investimento minimo',
      impact: 'Impatto',
      confidence: 'Affidabilità',
      potentialSavings: 'Risparmi potenziali',
      steps: 'Passi',
      risks: 'Rischi',
      requirements: 'Requisiti',
      legalDisclaimer: {
        title: 'Disclaimer Legale',
        text: 'I suggerimenti di ottimizzazione fiscale qui presentati sono raccomandazioni non vincolanti basate sulle informazioni da voi fornite. Non sostituiscono una consulenza fiscale professionale. Non ci assumiamo alcuna responsabilità per l\'accuratezza e la completezza delle informazioni o per le conseguenze fiscali che ne derivano. Si prega di consultare un consulente fiscale qualificato per la propria situazione individuale.'
      }
    },
    admin: {
      affiliates: {
        title: 'Gestione affiliati',
        addNew: 'Aggiungi nuovo affiliato',
        name: 'Nome',
        website: 'Sito web',
        commission: 'Tasso di commissione',
        contact: 'Persona di contatto',
        email: 'Email',
        phone: 'Telefono',
        notes: 'Note',
        status: 'Stato',
        active: 'Attivo',
        inactive: 'Inattivo'
      }
    }
  }
};
