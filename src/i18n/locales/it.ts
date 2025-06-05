export default {
  translation: {
    common: {
      save: 'Salva',
      cancel: 'Annulla',
      loading: 'Caricamento...',
      error: 'Si è verificato un errore',
      success: 'Salvato con successo',
      viewDetails: 'Vedi dettagli',
      hideDetails: 'Nascondi dettagli',
      applyNow: 'Applica ora',
      learnMore: 'Saperne di più'
    },
    header: {
      home: 'Home',
      about: 'Chi siamo',
      contact: 'Contatti',
      dashboard: 'Dashboard',
      settings: 'Impostazioni',
      logout: 'Esci'
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
            romanCatholic: 'Cattolico/a romano/a',
            protestant: 'Protestante (evangelico/a riformato/a)',
            other: 'Altra'
          }
        },
        person2: {
          title: 'Persona 2 (Coniuge/Partner)',
          age: 'Età Persona 2',
          religion: {
            label: 'Religione Persona 2',
            none: 'Nessuna',
            romanCatholic: 'Cattolico/a romano/a',
            protestant: 'Protestante (evangelico/a riformato/a)',
            other: 'Altra'
          }
        },
        maritalStatus: {
          label: 'Stato civile',
          single: 'Celibe/Nubile',
          married: 'Sposato/a',
          registeredPartnership: 'Unione domestica registrata',
          divorced: 'Divorziato/a',
          widowed: 'Vedovo/a'
        },
        canton: 'Cantone',
        municipality: 'Comune',
        selectMunicipality: 'Seleziona comune',
        children: {
          question: 'Hai figli?',
          number: 'Numero di figli'
        },
        isWithholdingTaxEligible: 'Soggetto/a all\'imposta alla fonte?'
      },
      financialInfo: {
        title: 'Informazioni finanziarie',
        yearlyIncome: 'Reddito annuo (CHF)',
        spouseYearlyIncome: 'Reddito annuo del coniuge (CHF)',
        wealthAmount: 'Patrimonio liquido (CHF)',
        spouseWealthAmount: 'Patrimonio liquido del coniuge (CHF)',
        totalWealth: 'Patrimonio lordo totale (CHF) (incl. immobili, investimenti)',
        totalLiabilities: 'Passività/debiti totali (CHF) (incl. ipoteca)',
        mortgageDebt: 'Debito ipotecario (CHF)',
        pensionContributions: 'Contributi annui cassa pensione (2° pilastro) (CHF)',
        spousePensionContributions: 'Contributi annui cassa pensione del coniuge (2° pilastro) (CHF)',
        pillar3aContributions: 'Contributi annui pilastro 3a (CHF)',
        spousePillar3aContributions: 'Contributi annui pilastro 3a del coniuge (CHF)',
        charitableDonations: 'Donazioni annue a enti benefici (CHF)',
        additionalDeductions: 'Altre spese fiscalmente deducibili (CHF)',
        currentTaxBurden: 'Carico fiscale annuo stimato attuale (CHF)',
        propertyOwnership: 'Possiedo immobili in Svizzera',
        selfEmployed: 'Sono lavoratore/trice autonomo/a',
        spouseSelfEmployed: 'Il mio coniuge è lavoratore/trice autonomo/a'
      }
    },
    navigation: {
      next: 'Avanti',
      back: 'Indietro',
      viewRecommendations: 'Visualizza raccomandazioni',
      saveAndContinue: 'Salva e continua',
      calculateTaxes: 'Calcola imposte'
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
      },
      generic: {
        required: 'Questo campo è obbligatorio',
        invalidNumber: 'Inserisci un numero valido',
        positiveNumber: 'Inserisci un numero positivo',
        numberRange: 'Il valore deve essere compreso tra {{min}} e {{max}}',
        maxLength: 'La lunghezza massima è di {{count}} caratteri'
      }
    },
    optimizations: {
      aiTitle: 'Raccomandazioni IA per l\'ottimizzazione fiscale',
      aiDescription: 'In base alla tua situazione individuale, abbiamo identificato le seguenti ottimizzazioni fiscali:',
      totalPotentialSavings: 'Potenziale di risparmio totale',
      recommendedProviders: 'Fornitori raccomandati',
      minInvestment: 'Investimento minimo',
      impact: 'Impatto',
      confidence: 'Affidabilità',
      potentialSavings: 'Risparmi potenziali',
      steps: 'Passi per l\'implementazione',
      risks: 'Rischi potenziali',
      requirements: 'Requisiti',
      timeline: 'Tempistica stimata',
      legalReferences: 'Riferimenti legali',
      suitability: 'Idoneità',
      cantonSpecific: 'Specifico per cantone',
      multiYearProjection: 'Proiezione pluriennale (CHF)',
      years: 'Anni',
      annualSavings: 'Risparmi annuali',
      cumulativeSavings: 'Risparmi cumulati',
      providerType: 'Tipo di fornitore',
      rating: 'Valutazione',
      fees: 'Commissioni',
      languages: 'Lingue',
      pillar3a: {
        title: 'Massimizzare i contributi al Pilastro 3a',
        description: 'Sfrutta appieno il tuo margine di contribuzione al Pilastro 3a per ridurre il reddito imponibile e costituire un risparmio previdenziale fiscalmente privilegiato. Questa è una delle misure di risparmio fiscale più efficaci e dirette in Svizzera.',
        steps: {
          increase: 'Aumenta il tuo contributo annuo di {{amount}} CHF per raggiungere il limite massimo.',
          split: 'Considera la suddivisione degli averi 3a su più conti per prelievi scaglionati in futuro, al fine di interrompere la progressione fiscale.',
          invest: 'Investi i tuoi averi del Pilastro 3a in un portafoglio diversificato per rendimenti potenzialmente più elevati a lungo termine.'
        },
        requirements: {
          income: 'Reddito imponibile sufficiente (soggetto AVS).',
          horizon: 'Orizzonte d\'investimento a lungo termine (fino al pensionamento).'
        },
        timeline: 'Annualmente, prima della fine dell\'anno.',
        legal: {
          bvg: 'Art. 82 LPP (Previdenza professionale)',
          tax: 'Art. 33 LIFD (Legge federale sull\'imposta federale diretta)'
        }
      },
      spousePillar3a: {
        title: 'Massimizzare i contributi al Pilastro 3a del coniuge',
        description: 'Se applicabile, assicurati che anche il tuo coniuge sfrutti appieno il proprio margine di contribuzione al Pilastro 3a per ridurre ulteriormente il reddito imponibile comune e migliorare il risparmio previdenziale.',
        steps: {
          increase: 'Aumenta il contributo annuo del coniuge di {{amount}} CHF per raggiungere il suo limite massimo.',
          split: 'Considera la suddivisione dei conti del Pilastro 3a del coniuge per prelievi scaglionati.',
          invest: 'Investi gli averi del Pilastro 3a del coniuge in un portafoglio diversificato.'
        },
        requirements: {
          income: 'Il coniuge dispone di un reddito imponibile sufficiente (soggetto AVS).',
          horizon: 'Orizzonte d\'investimento a lungo termine per il coniuge.'
        },
        timeline: 'Annualmente, prima della fine dell\'anno.'
      },
      pension: {
        title: 'Ottimizzare i riscatti nella cassa pensione (2° pilastro)',
        description: 'Effettua acquisti volontari nella tua cassa pensione per colmare eventuali lacune. Questi riscatti sono interamente deducibili fiscalmente e possono ridurre significativamente il tuo reddito imponibile, soprattutto negli anni con redditi elevati.',
        steps: {
          request: 'Richiedi alla tua cassa pensione un attestato del tuo potenziale di riscatto.',
          calculate: 'Calcola l\'importo ottimale di riscatto in base alla tua situazione fiscale e alla tua liquidità.',
          plan: 'Pianifica i riscatti su più anni per distribuire i vantaggi fiscali, se applicabile.'
        },
        requirements: {
          potential: 'Lacuna esistente nella cassa pensione (potenziale di riscatto).',
          liquidity: 'Disponibilità liquide sufficienti per il riscatto.',
          planning: 'Pianificazione accurata, soprattutto se si considera un prelievo anticipato per proprietà abitativa.'
        },
        risks: {
          liquidity: 'I fondi sono vincolati fino al pensionamento (con eccezioni).',
          regulations: 'I regolamenti delle casse pensioni possono cambiare.'
        },
        timeline: 'Può essere effettuato annualmente; consultare la cassa pensione per le scadenze.',
        legal: {
          bvg: 'Art. 60-60d LPP (Previdenza professionale)',
          tax: 'Art. 33 LIFD (Legge federale sull\'imposta federale diretta)'
        }
      },
      property: {
        title: 'Investimento immobiliare strategico',
        description: 'Investire in immobili può offrire vantaggi fiscali come la deduzione degli interessi ipotecari e dei costi di manutenzione. Per le residenze primarie, il valore locativo figurativo è tassato, ma le deduzioni possono compensarlo.',
        steps: {
          evaluate: 'Valuta se la proprietà immobiliare è in linea con i tuoi obiettivi finanziari e il tuo profilo di rischio.',
          mortgage: 'Ottimizza la struttura ipotecaria (ad es. ammortamento diretto o indiretto).',
          energy: 'Considera ristrutturazioni ad alta efficienza energetica per ulteriori deduzioni e risparmi a lungo termine.'
        },
        risks: {
          market: 'Fluttuazioni del mercato immobiliare.',
          interest: 'Variazioni dei tassi d\'interesse ipotecari.',
          maintenance: 'Costi di manutenzione correnti.'
        },
        requirements: {
          equity: 'Capitale proprio sufficiente (generalmente il 20%).',
          income: 'Livello di reddito sostenibile per i pagamenti ipotecari.',
          credit: 'Buona solvibilità.'
        },
        timeline: 'A lungo termine (5-10+ anni).',
        legal: {
          tax: 'Art. 21, 32, 34 LIFD (Legge federale sull\'imposta federale diretta)',
          mortgage: 'Leggi cantonali e federali pertinenti sulla proprietà immobiliare.'
        }
      },
      propertyOptimization: {
        title: 'Ottimizzare la tassazione immobiliare esistente',
        description: 'Se possiedi un immobile, ottimizza le deduzioni relative a interessi ipotecari, manutenzione e ristrutturazioni. Una gestione strategica del debito e investimenti volti a preservare il valore possono ridurre il tuo carico fiscale.',
        steps: {
          mortgage: 'Rivedi la tua ipoteca: considera opzioni con soli interessi o un ammortamento indiretto tramite il Pilastro 3a per una maggiore efficienza fiscale.',
          renovation: 'Pianifica ristrutturazioni volte a preservare il valore e a risparmiare energia; queste sono spesso deducibili.',
          timing: 'Raggruppa le spese di manutenzione in anni specifici per superare le deduzioni forfettarie, se applicabile.'
        },
        risks: {
          interest: 'Le variazioni dei tassi d\'interesse ipotecari possono influire sulla sostenibilità.',
          value: 'Il valore dell\'immobile potrebbe non apprezzarsi sempre come previsto.'
        },
        timeline: 'Continuo, con azioni specifiche annuali o periodiche.'
      },
      business: {
        title: 'Ottimizzare la struttura aziendale (per lavoratori autonomi)',
        description: 'Per i lavoratori autonomi, la scelta della giusta forma giuridica (ditta individuale, Sagl, SA) può avere implicazioni fiscali significative. Anche l\'ottimizzazione delle spese aziendali e della pianificazione previdenziale è cruciale.',
        steps: {
          evaluate: 'Valuta se la tua attuale forma giuridica (ad es. ditta individuale) è ottimale o se una transizione a una Sagl/SA offre vantaggi.',
          optimize: 'Massimizza le spese aziendali deducibili (ufficio, viaggi, attrezzature).',
          review: 'Rivedi regolarmente la situazione finanziaria e fiscale della tua azienda con un consulente.'
        },
        risks: {
          setup: 'Costi e impegno amministrativo per il cambio di forma giuridica.',
          admin: 'Maggiore onere amministrativo con le strutture societarie.',
          transition: 'Potenziali implicazioni fiscali durante la transizione.'
        },
        requirements: {
          revenue: 'Fatturato e utile aziendale sufficienti.',
          structure: 'Comprensione delle diverse forme giuridiche.',
          planning: 'Pianificazione aziendale e finanziaria a lungo termine.'
        },
        timeline: 'Pianificazione a medio o lungo termine; i cambiamenti legali possono richiedere mesi.',
        legal: {
          or: 'Codice delle obbligazioni svizzero (CO)',
          tax: 'Leggi fiscali federali e cantonali pertinenti per le imprese.'
        }
      },
      wealth: {
        title: 'Gestione patrimoniale strategica e allocazione degli attivi',
        description: 'Ottimizza il tuo carico fiscale sul patrimonio strutturando efficacemente i tuoi attivi. Ciò può comportare la diversificazione degli investimenti, la considerazione di veicoli d\'investimento fiscalmente efficienti e la gestione delle passività.',
        steps: {
          structure: 'Rivedi l\'allocazione degli attivi per l\'efficienza fiscale (ad es. focus su dividendi vs. plusvalenze).',
          diversify: 'Diversifica gli investimenti tra diverse classi di attivi e aree geografiche.',
          timing: 'Gestisci la tempistica delle vendite di attivi per ottimizzare l\'imposizione delle plusvalenze, se applicabile (sebbene generalmente non tassate per i privati in CH).'
        },
        risks: {
          market: 'Rischi dei mercati d\'investimento.',
          liquidity: 'Alcune strutture fiscalmente efficienti possono ridurre la liquidità.',
          compliance: 'Garantire la conformità a complesse normative finanziarie.'
        },
        requirements: {
          assets: 'Patrimonio imponibile significativo.',
          horizon: 'Orizzonte d\'investimento a lungo termine.',
          advice: 'Consulenza finanziaria e fiscale professionale.'
        },
        timeline: 'Continuo, con revisioni annuali.',
        legal: {
          cantonal: 'Leggi cantonali sull\'imposta sul patrimonio.',
          federal: 'Linee guida federali sulla valutazione del patrimonio.'
        }
      },
      inheritance: {
        title: 'Pianificazione successoria e patrimoniale proattiva',
        description: 'Pianifica la tua successione in anticipo per minimizzare le imposte di successione e donazione per i tuoi beneficiari. Ciò varia significativamente a seconda del cantone e del grado di parentela con gli eredi.',
        steps: {
          planning: 'Sviluppa un piano successorio completo che includa un testamento e potenzialmente convenzioni matrimoniali/patti successori.',
          gifts: 'Considera donazioni inter vivos fiscalmente efficienti (attenzione alle norme cantonali sulle donazioni e ai periodi di recupero).',
          structures: 'Esplora strutture come fondazioni o accordi di usufrutto se adatte a grandi patrimoni.'
        },
        risks: {
          legal: 'Area legale complessa che richiede consulenza specialistica.',
          control: 'Perdita di controllo sugli attivi donati durante la vita.',
          changes: 'Le circostanze familiari e le leggi fiscali possono cambiare.'
        },
        requirements: {
          assets: 'Patrimoni significativi da pianificare.',
          family: 'Chiara comprensione della situazione familiare e dei desideri.',
          legal: 'Consulenza legale e fiscale professionale.'
        },
        timeline: 'Pianificazione a lungo termine, da rivedere ogni 5-10 anni o in caso di eventi importanti della vita.',
        legal: {
          civil: 'Codice civile svizzero (CC) sulle successioni.',
          cantonal: 'Leggi cantonali sulle imposte di successione e donazione.'
        }
      },
      family: {
        title: 'Ottimizzare le deduzioni fiscali familiari',
        description: 'Massimizza le deduzioni relative ai figli, come i costi di custodia, le spese di formazione (ove applicabile) e i premi assicurativi. Assicurati che tutti i membri della famiglia aventi diritto siano correttamente considerati nelle dichiarazioni fiscali.',
        steps: {
          childcare: 'Deduci i costi effettivi di custodia dei figli fino ai limiti cantonali.',
          education: 'Verifica la deducibilità dei costi di formazione/studio per i figli.',
          deductions: 'Assicurati che tutte le deduzioni relative ai figli (ad es. per le assicurazioni) siano richieste.'
        },
        requirements: {
          children: 'Avere figli a carico.',
          expenses: 'Spese effettive e documentate per la custodia o la formazione dei figli.',
          documentation: 'Conserva ricevute e contratti per tutte le spese dichiarate.'
        },
        timeline: 'Annualmente, durante la preparazione della dichiarazione d\'imposta.',
        legal: {
          federal: 'Legge federale sull\'imposta federale diretta (LIFD) relativa alle deduzioni familiari.',
          cantonal: 'Leggi fiscali cantonali relative alle deduzioni familiari e per i figli.'
        }
      },
      charity: {
        title: 'Donazioni strategiche a enti benefici',
        description: 'Le donazioni a organizzazioni caritatevoli riconosciute sono deducibili fiscalmente fino a una certa percentuale del tuo reddito netto (tipicamente il 20% a livello federale, varia a seconda del cantone). Pianifica le tue donazioni per la massima efficienza fiscale.',
        steps: {
          timing: 'Raggruppa le donazioni in un unico anno per superare le soglie di deduzione forfettaria, se applicabile.',
          methods: 'Considera la donazione di attivi rivalutati invece di contanti per potenziali benefici aggiuntivi (consulta un consulente).',
          documentation: 'Conserva tutte le ricevute di donazione da organizzazioni ammissibili.'
        },
        requirements: {
          income: 'Reddito sufficiente per rendere le donazioni significative.',
          eligible: 'Le donazioni devono essere fatte a organizzazioni caritatevoli riconosciute ed esenti da imposte.',
          documentation: 'Ricevute di donazione ufficiali.'
        },
        timeline: 'Annualmente, o pianificate su più anni.',
        legal: {
          federal: 'Art. 33a LIFD (Legge federale sull\'imposta federale diretta).',
          deductions: 'Regolamenti cantonali sulle deduzioni per donazioni.'
        }
      },
      taxloss: {
        title: 'Compensazione delle perdite fiscali (per investimenti)',
        description: 'Se hai investimenti imponibili (ad es. come trader professionista o tramite una persona giuridica), realizza strategicamente le perdite in conto capitale per compensare le plusvalenze, riducendo così il reddito da investimento imponibile complessivo.',
        steps: {
          review: 'Rivedi regolarmente il tuo portafoglio di investimenti per individuare gli attivi con perdite non realizzate.',
          timing: 'Realizza le perdite prima della fine dell\'anno per compensare le plusvalenze nello stesso periodo fiscale.',
          reinvest: 'Fai attenzione alle regole sulla "vendita fittizia" (wash sale) se riacquisti attivi simili poco dopo averli venduti.'
        },
        risks: {
          market: 'Vendere in perdita cristallizza tale perdita; il mercato potrebbe riprendersi.',
          wash: 'Regole complesse sulla "vendita fittizia" possono annullare i benefici fiscali se non seguite attentamente.'
        },
        timeline: 'Tipicamente verso la fine dell\'anno fiscale.',
      },
      multiYear: {
        assumptions: {
          inflation: 'Si ipotizza un\'inflazione media annua del 2%.',
          taxRates: 'Si ipotizza che le aliquote e le tariffe fiscali attuali rimangano stabili.',
          income: 'Si ipotizza che il tuo reddito rimanga relativamente stabile o cresca moderatamente.'
        }
      },
      providerTypes: {
        bank: 'Banca',
        insurance: 'Compagnia di assicurazioni',
        pension_fund: 'Cassa pensione',
        tax_advisor: 'Consulente fiscale',
        financial_advisor: 'Consulente finanziario',
        real_estate: 'Specialista immobiliare',
        fintech: 'Fornitore FinTech',
        legal: 'Consulente legale / Avvocato'
      },
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
        commission: 'Tasso di commissione (%)',
        contact: 'Persona di contatto',
        email: 'Email',
        phone: 'Telefono',
        notes: 'Note',
        status: 'Stato',
        active: 'Attivo',
        inactive: 'Inattivo',
        editAffiliate: 'Modifica affiliato',
        deleteAffiliate: 'Elimina affiliato',
        confirmDelete: 'Sei sicuro di voler eliminare questo affiliato?',
        clicks: 'Clic',
        conversions: 'Conversioni',
        conversionRate: 'Tasso di conversione',
        totalCommission: 'Commissione totale (CHF)',
        noAffiliates: 'Nessun affiliato trovato. Aggiungine uno per iniziare!'
      },
      dashboard: {
        title: 'Dashboard Admin',
        totalUsers: 'Utenti totali',
        taxCalculations: 'Calcoli fiscali oggi',
        activeSessions: 'Sessioni attive',
        optimizationViews: 'Visualizzazioni ottimizzazioni',
        recentActivity: 'Attività recente',
        systemStatus: 'Stato del sistema',
        allSystemsOperational: 'Tutti i sistemi sono operativi.'
      },
      settings: {
        title: 'Impostazioni Admin',
        general: 'Impostazioni generali',
        applicationName: 'Nome applicazione',
        defaultLanguage: 'Lingua predefinita',
        maintenanceMode: 'Modalità manutenzione',
        security: 'Impostazioni di sicurezza',
        maxLoginAttempts: 'Max. tentativi di accesso',
        sessionTimeout: 'Timeout sessione (minuti)',
        apiKeys: 'Chiavi API',
        manageApiKeys: 'Gestisci chiavi API',
        notifications: 'Notifiche',
        adminEmail: 'Email admin per notifiche'
      }
    }
  }
};
