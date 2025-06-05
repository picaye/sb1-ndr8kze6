export default {
  translation: {
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      success: 'Enregistré avec succès',
      viewDetails: 'Voir les détails',
      hideDetails: 'Masquer les détails',
      applyNow: 'Appliquer maintenant',
      learnMore: 'En savoir plus'
    },
    header: {
      home: 'Accueil',
      about: 'À propos',
      contact: 'Contact',
      dashboard: 'Tableau de bord',
      settings: 'Paramètres',
      logout: 'Déconnexion'
    },
    auth: {
      welcomeBack: 'Bienvenue',
      createAccount: 'Créer un compte',
      loginPrompt: 'Veuillez vous connecter pour continuer',
      login: 'Se connecter',
      signUp: 'S\'inscrire',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      continueWithGoogle: 'Continuer avec Google',
      forgotPassword: {
        link: 'Mot de passe oublié?',
        title: 'Réinitialiser le mot de passe',
        description: 'Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.',
        submit: 'Envoyer le lien',
        sending: 'Envoi en cours...',
        checkEmail: 'Veuillez vérifier votre email pour le lien de réinitialisation du mot de passe.'
      },
      validation: {
        invalid: 'Email ou mot de passe invalide',
        googleError: 'Impossible de se connecter avec Google',
        passwordMismatch: 'Les mots de passe ne correspondent pas',
        emailNotFound: 'Aucun compte trouvé avec cette adresse email'
      },
      orContinueWith: 'ou continuer avec',
      needAccount: 'Besoin d\'un compte? Inscrivez-vous',
      alreadyHaveAccount: 'Vous avez déjà un compte? Connectez-vous',
      backToLogin: 'Retour à la connexion'
    },
    forms: {
      personalInfo: {
        title: 'Informations personnelles',
        person1: {
          title: 'Personne 1',
          age: 'Âge Personne 1',
          religion: {
            label: 'Religion Personne 1',
            none: 'Aucune',
            romanCatholic: 'Catholique romaine',
            protestant: 'Protestante (évangélique réformée)',
            other: 'Autre'
          }
        },
        person2: {
          title: 'Personne 2 (Conjoint/Partenaire)',
          age: 'Âge Personne 2',
          religion: {
            label: 'Religion Personne 2',
            none: 'Aucune',
            romanCatholic: 'Catholique romaine',
            protestant: 'Protestante (évangélique réformée)',
            other: 'Autre'
          }
        },
        maritalStatus: {
          label: 'État civil',
          single: 'Célibataire',
          married: 'Marié(e)',
          registeredPartnership: 'Partenariat enregistré',
          divorced: 'Divorcé(e)',
          widowed: 'Veuf/Veuve'
        },
        canton: 'Canton',
        municipality: 'Commune',
        selectMunicipality: 'Sélectionner une commune',
        children: {
          question: 'Avez-vous des enfants?',
          number: 'Nombre d\'enfants'
        },
        isWithholdingTaxEligible: 'Soumis(e) à l\'impôt à la source?'
      },
      financialInfo: {
        title: 'Informations financières',
        yearlyIncome: 'Revenu annuel (CHF)',
        spouseYearlyIncome: 'Revenu annuel du conjoint (CHF)',
        wealthAmount: 'Fortune liquide (CHF)',
        spouseWealthAmount: 'Fortune liquide du conjoint (CHF)',
        totalWealth: 'Fortune brute totale (CHF) (incl. immobilier, placements)',
        totalLiabilities: 'Total des passifs/dettes (CHF) (incl. hypothèque)',
        mortgageDebt: 'Dette hypothécaire (CHF)',
        pensionContributions: 'Cotisations annuelles caisse de pension (2e pilier) (CHF)',
        spousePensionContributions: 'Cotisations annuelles caisse de pension du conjoint (2e pilier) (CHF)',
        pillar3aContributions: 'Cotisations annuelles pilier 3a (CHF)',
        spousePillar3aContributions: 'Cotisations annuelles pilier 3a du conjoint (CHF)',
        charitableDonations: 'Dons annuels à des œuvres de bienfaisance (CHF)',
        additionalDeductions: 'Autres frais fiscalement déductibles (CHF)',
        currentTaxBurden: 'Charge fiscale annuelle estimée actuelle (CHF)',
        propertyOwnership: 'Je possède un bien immobilier en Suisse',
        selfEmployed: 'Je suis indépendant(e)',
        spouseSelfEmployed: 'Mon conjoint est indépendant(e)'
      }
    },
    navigation: {
      next: 'Suivant',
      back: 'Retour',
      viewRecommendations: 'Voir les recommandations',
      saveAndContinue: 'Enregistrer et continuer',
      calculateTaxes: 'Calculer les impôts'
    },
    validation: {
      municipality: {
        required: 'Veuillez sélectionner une commune',
        invalid: 'Veuillez sélectionner une commune valide'
      },
      pillar3a: {
        negativeAmount: 'Le montant ne peut pas être négatif',
        incomeRequired: 'Le revenu annuel est requis',
        ageRestriction: 'L\'âge doit être entre 18 et 70 ans',
        maxAmount: 'La cotisation maximale est de {{amount}} CHF'
      },
      generic: {
        required: 'Ce champ est requis',
        invalidNumber: 'Veuillez entrer un nombre valide',
        positiveNumber: 'Veuillez entrer un nombre positif',
        numberRange: 'La valeur doit être comprise entre {{min}} et {{max}}',
        maxLength: 'La longueur maximale est de {{count}} caractères'
      }
    },
    optimizations: {
      aiTitle: 'Recommandations d\'optimisation fiscale IA',
      aiDescription: 'Sur la base de votre situation individuelle, nous avons identifié les optimisations fiscales suivantes:',
      totalPotentialSavings: 'Potentiel d\'économies total',
      recommendedProviders: 'Fournisseurs recommandés',
      minInvestment: 'Investissement minimum',
      impact: 'Impact',
      confidence: 'Confiance',
      potentialSavings: 'Économies potentielles',
      steps: 'Étapes d\'implémentation',
      risks: 'Risques potentiels',
      requirements: 'Prérequis',
      timeline: 'Calendrier estimé',
      legalReferences: 'Références légales',
      suitability: 'Pertinence',
      cantonSpecific: 'Spécifique au canton',
      multiYearProjection: 'Projection pluriannuelle (CHF)',
      years: 'Années',
      annualSavings: 'Économies annuelles',
      cumulativeSavings: 'Économies cumulées',
      providerType: 'Type de fournisseur',
      rating: 'Évaluation',
      fees: 'Frais',
      languages: 'Langues',
      pillar3a: {
        title: 'Maximiser les cotisations au Pilier 3a',
        description: 'Utilisez pleinement votre déduction pour le Pilier 3a afin de réduire votre revenu imposable et de constituer une épargne-retraite fiscalement avantageuse. C\'est l\'une des mesures d\'économie d\'impôt les plus efficaces et directes en Suisse.',
        steps: {
          increase: 'Augmentez votre cotisation annuelle de {{amount}} CHF pour atteindre le plafond maximum.',
          split: 'Envisagez de répartir vos avoirs 3a sur plusieurs comptes pour des retraits échelonnés ultérieurs afin de rompre la progression fiscale.',
          invest: 'Investissez vos avoirs du Pilier 3a dans un portefeuille diversifié pour des rendements potentiellement plus élevés à long terme.'
        },
        requirements: {
          income: 'Revenu suffisant soumis à l\'AVS.',
          horizon: 'Horizon de placement à long terme (jusqu\'à la retraite).'
        },
        timeline: 'Annuellement, avant la fin de l\'année.',
        legal: {
          bvg: 'Art. 82 LPP (Prévoyance professionnelle)',
          tax: 'Art. 33 LIFD (Loi fédérale sur l\'impôt fédéral direct)'
        }
      },
      spousePillar3a: {
        title: 'Maximiser les cotisations au Pilier 3a du conjoint',
        description: 'Le cas échéant, assurez-vous que votre conjoint utilise également pleinement sa déduction pour le Pilier 3a afin de réduire davantage le revenu imposable commun et d\'améliorer l\'épargne-retraite.',
        steps: {
          increase: 'Augmentez la cotisation annuelle du conjoint de {{amount}} CHF pour atteindre son plafond maximum.',
          split: 'Envisagez de répartir les avoirs 3a du conjoint sur plusieurs comptes pour des retraits échelonnés.',
          invest: 'Investissez les avoirs du Pilier 3a du conjoint dans un portefeuille diversifié.'
        },
        requirements: {
          income: 'Le conjoint dispose d\'un revenu suffisant soumis à l\'AVS.',
          horizon: 'Horizon de placement à long terme pour le conjoint.'
        },
        timeline: 'Annuellement, avant la fin de l\'année.'
      },
      pension: {
        title: 'Optimiser les rachats dans la caisse de pension (2e pilier)',
        description: 'Effectuez des rachats volontaires dans votre caisse de pension pour combler d\'éventuelles lacunes. Ces rachats sont entièrement déductibles fiscalement et peuvent réduire considérablement votre revenu imposable, surtout lors d\'années à revenu élevé.',
        steps: {
          request: 'Demandez à votre caisse de pension une attestation de votre potentiel de rachat.',
          calculate: 'Calculez le montant optimal de rachat en fonction de votre situation fiscale et de vos liquidités.',
          plan: 'Planifiez les rachats sur plusieurs années pour lisser les avantages fiscaux, le cas échéant.'
        },
        requirements: {
          potential: 'Lacune existante dans la caisse de pension (potentiel de rachat).',
          liquidity: 'Actifs liquides suffisants pour le rachat.',
          planning: 'Planification minutieuse, surtout si un retrait anticipé pour un logement est envisagé.'
        },
        risks: {
          liquidity: 'Les fonds sont bloqués jusqu\'à la retraite (sauf exceptions).',
          regulations: 'Les règlements des caisses de pension peuvent changer.'
        },
        timeline: 'Peut être effectué annuellement ; consulter la caisse de pension pour les délais.',
        legal: {
          bvg: 'Art. 60-60d LPP (Prévoyance professionnelle)',
          tax: 'Art. 33 LIFD (Loi fédérale sur l\'impôt fédéral direct)'
        }
      },
      property: {
        title: 'Investissement immobilier stratégique',
        description: 'Investir dans l\'immobilier peut offrir des avantages fiscaux tels que la déduction des intérêts hypothécaires et des frais d\'entretien. Pour les résidences principales, la valeur locative imputée est imposée, mais les déductions peuvent compenser cela.',
        steps: {
          evaluate: 'Évaluez si la propriété immobilière correspond à vos objectifs financiers et à votre profil de risque.',
          mortgage: 'Optimisez la structure hypothécaire (par ex., amortissement direct ou indirect).',
          energy: 'Envisagez des rénovations écoénergétiques pour des déductions supplémentaires et des économies à long terme.'
        },
        risks: {
          market: 'Fluctuations du marché immobilier.',
          interest: 'Variations des taux d\'intérêt hypothécaires.',
          maintenance: 'Frais d\'entretien courants.'
        },
        requirements: {
          equity: 'Apport personnel suffisant (généralement 20%).',
          income: 'Niveau de revenu permettant de supporter les mensualités hypothécaires.',
          credit: 'Bonne solvabilité.'
        },
        timeline: 'À long terme (5-10+ années).',
        legal: {
          tax: 'Art. 21, 32, 34 LIFD (Loi fédérale sur l\'impôt fédéral direct)',
          mortgage: 'Lois cantonales et fédérales pertinentes sur la propriété immobilière.'
        }
      },
      propertyOptimization: {
        title: 'Optimiser la fiscalité immobilière existante',
        description: 'Si vous êtes propriétaire, optimisez les déductions liées aux intérêts hypothécaires, à l\'entretien et aux rénovations. Une gestion stratégique de la dette et des investissements de maintien de la valeur peuvent réduire votre charge fiscale.',
        steps: {
          mortgage: 'Revoyez votre hypothèque : envisagez des options à taux d\'intérêt uniquement ou un amortissement indirect via le Pilier 3a pour une meilleure efficacité fiscale.',
          renovation: 'Planifiez des rénovations de maintien de la valeur et d\'économie d\'énergie ; celles-ci sont souvent déductibles.',
          timing: 'Regroupez les frais d\'entretien sur des années spécifiques pour dépasser les déductions forfaitaires, le cas échéant.'
        },
        risks: {
          interest: 'Les variations des taux d\'intérêt hypothécaires peuvent affecter la capacité de paiement.',
          value: 'La valeur du bien immobilier peut ne pas toujours s\'apprécier comme prévu.'
        },
        timeline: 'Continu, avec des actions spécifiques annuellement ou périodiquement.'
      },
      business: {
        title: 'Optimiser la structure de l\'entreprise (pour indépendants)',
        description: 'Pour les indépendants, choisir la bonne forme juridique (raison individuelle, Sàrl, SA) peut avoir des implications fiscales importantes. L\'optimisation des frais professionnels et de la prévoyance est également cruciale.',
        steps: {
          evaluate: 'Évaluez si votre forme juridique actuelle (par ex., raison individuelle) est optimale ou si une transition vers une Sàrl/SA offre des avantages.',
          optimize: 'Maximisez les frais professionnels déductibles (bureau, déplacements, matériel).',
          review: 'Examinez régulièrement la situation financière et fiscale de votre entreprise avec un conseiller.'
        },
        risks: {
          setup: 'Coûts et efforts administratifs pour changer de forme juridique.',
          admin: 'Charge administrative accrue avec les structures sociétaires.',
          transition: 'Implications fiscales potentielles pendant la transition.'
        },
        requirements: {
          revenue: 'Chiffre d\'affaires et bénéfice suffisants.',
          structure: 'Compréhension des différentes formes juridiques.',
          planning: 'Planification commerciale et financière à long terme.'
        },
        timeline: 'Planification à moyen ou long terme ; les changements juridiques peuvent prendre des mois.',
        legal: {
          or: 'Code des obligations suisse (CO)',
          tax: 'Lois fiscales fédérales et cantonales pertinentes pour les entreprises.'
        }
      },
      wealth: {
        title: 'Gestion de fortune stratégique et allocation d\'actifs',
        description: 'Optimisez votre charge fiscale sur la fortune en structurant efficacement vos actifs. Cela peut impliquer la diversification des placements, l\'examen de véhicules de placement fiscalement avantageux et la gestion des passifs.',
        steps: {
          structure: 'Examinez l\'allocation d\'actifs pour son efficacité fiscale (par ex., accent sur les dividendes ou les gains en capital).',
          diversify: 'Diversifiez les placements entre différentes classes d\'actifs et zones géographiques.',
          timing: 'Gérez le calendrier des ventes d\'actifs pour optimiser l\'imposition des gains en capital, le cas échéant (bien que généralement non imposés pour les particuliers en CH).'
        },
        risks: {
          market: 'Risques liés aux marchés financiers.',
          liquidity: 'Certaines structures fiscalement avantageuses peuvent réduire la liquidité.',
          compliance: 'Assurer la conformité avec des réglementations financières complexes.'
        },
        requirements: {
          assets: 'Fortune imposable significative.',
          horizon: 'Horizon de placement à long terme.',
          advice: 'Conseil financier et fiscal professionnel.'
        },
        timeline: 'Continu, avec des examens annuels.',
        legal: {
          cantonal: 'Lois cantonales sur l\'impôt sur la fortune.',
          federal: 'Directives fédérales sur l\'évaluation de la fortune.'
        }
      },
      inheritance: {
        title: 'Planification successorale et patrimoniale proactive',
        description: 'Planifiez votre succession tôt pour minimiser les impôts sur les successions et les donations pour vos bénéficiaires. Cela varie considérablement selon le canton et le lien de parenté avec les héritiers.',
        steps: {
          planning: 'Élaborez un plan successoral complet comprenant un testament et éventuellement des contrats de mariage/pactes successoraux.',
          gifts: 'Envisagez des donations de votre vivant fiscalement avantageuses (attention aux règles cantonales sur les donations et aux délais de rapport).',
          structures: 'Explorez des structures comme les fondations ou les arrangements d\'usufruit si adaptées aux grandes fortunes.'
        },
        risks: {
          legal: 'Domaine juridique complexe nécessitant l\'avis d\'experts.',
          control: 'Perte de contrôle sur les actifs donnés de son vivant.',
          changes: 'Les situations familiales et les lois fiscales peuvent changer.'
        },
        requirements: {
          assets: 'Actifs importants à planifier.',
          family: 'Compréhension claire de la situation familiale et des souhaits.',
          legal: 'Conseil juridique et fiscal professionnel.'
        },
        timeline: 'Planification à long terme, à revoir tous les 5-10 ans ou lors d\'événements majeurs de la vie.',
        legal: {
          civil: 'Code civil suisse (CC) sur les successions.',
          cantonal: 'Lois cantonales sur les impôts sur les successions et les donations.'
        }
      },
      family: {
        title: 'Optimiser les déductions fiscales familiales',
        description: 'Maximisez les déductions liées aux enfants, telles que les frais de garde, les frais de formation (le cas échéant) et les primes d\'assurance. Assurez-vous que tous les membres de la famille éligibles sont correctement pris en compte dans les déclarations fiscales.',
        steps: {
          childcare: 'Déduisez les frais de garde réels jusqu\'aux limites cantonales.',
          education: 'Vérifiez la déductibilité des frais de formation/études pour les enfants.',
          deductions: 'Assurez-vous que toutes les déductions liées aux enfants (par ex., pour les assurances) sont demandées.'
        },
        requirements: {
          children: 'Avoir des enfants à charge.',
          expenses: 'Frais réels et documentés pour la garde ou la formation des enfants.',
          documentation: 'Conservez les reçus et contrats pour toutes les dépenses déclarées.'
        },
        timeline: 'Annuellement, lors de la préparation de la déclaration d\'impôt.',
        legal: {
          federal: 'Loi fédérale sur l\'impôt fédéral direct (LIFD) concernant les déductions familiales.',
          cantonal: 'Lois fiscales cantonales concernant les déductions familiales et pour enfants.'
        }
      },
      charity: {
        title: 'Dons stratégiques à des œuvres de bienfaisance',
        description: 'Les dons à des organisations caritatives reconnues sont déductibles fiscalement jusqu\'à un certain pourcentage de votre revenu net (généralement 20% au niveau fédéral, varie selon le canton). Planifiez vos dons pour une efficacité fiscale maximale.',
        steps: {
          timing: 'Regroupez les dons sur une seule année pour dépasser les seuils de déduction forfaitaire, le cas échéant.',
          methods: 'Envisagez de donner des actifs appréciés au lieu d\'espèces pour des avantages supplémentaires potentiels (consulter un conseiller).',
          documentation: 'Conservez tous les reçus de dons des organisations éligibles.'
        },
        requirements: {
          income: 'Revenu suffisant pour que les dons aient un impact.',
          eligible: 'Les dons doivent être faits à des organisations caritatives reconnues et exonérées d\'impôt.',
          documentation: 'Reçus de dons officiels.'
        },
        timeline: 'Annuellement, ou planifié sur plusieurs années.',
        legal: {
          federal: 'Art. 33a LIFD (Loi fédérale sur l\'impôt fédéral direct).',
          deductions: 'Réglementations cantonales sur les déductions pour dons.'
        }
      },
      taxloss: {
        title: 'Récolte de pertes fiscales (pour les placements)',
        description: 'Si vous avez des placements imposables (par ex., en tant que trader professionnel ou via une société), réalisez stratégiquement des pertes en capital pour compenser les gains en capital, réduisant ainsi le revenu de placement imposable global.',
        steps: {
          review: 'Examinez régulièrement votre portefeuille de placements pour identifier les actifs présentant des pertes non réalisées.',
          timing: 'Réalisez les pertes avant la fin de l\'année pour compenser les gains de la même période fiscale.',
          reinvest: 'Soyez attentif aux règles de "vente fictive" (wash sale) si vous rachetez des actifs similaires peu après les avoir vendus.'
        },
        risks: {
          market: 'Vendre à perte cristallise cette perte ; le marché pourrait se redresser.',
          wash: 'Des règles complexes de "vente fictive" peuvent annuler les avantages fiscaux si elles ne sont pas suivies attentivement.'
        },
        timeline: 'Généralement vers la fin de l\'année fiscale.',
      },
      multiYear: {
        assumptions: {
          inflation: 'Suppose une inflation annuelle moyenne de 2%.',
          taxRates: 'Suppose que les taux d\'imposition et les barèmes actuels restent stables.',
          income: 'Suppose que votre revenu reste relativement stable ou augmente modérément.'
        }
      },
      providerTypes: {
        bank: 'Banque',
        insurance: 'Compagnie d\'assurance',
        pension_fund: 'Caisse de pension',
        tax_advisor: 'Conseiller fiscal',
        financial_advisor: 'Conseiller financier',
        real_estate: 'Spécialiste immobilier',
        fintech: 'Fournisseur FinTech',
        legal: 'Conseiller juridique / Avocat'
      },
      legalDisclaimer: {
        title: 'Mention Légale',
        text: 'Les suggestions d\'optimisation fiscale présentées ici sont des recommandations non contraignantes basées sur les informations que vous avez fournies. Elles ne remplacent pas un conseil fiscal professionnel. Nous n\'assumons aucune responsabilité quant à l\'exactitude et l\'exhaustivité des informations ou des conséquences fiscales qui en découlent. Veuillez consulter un conseiller fiscal qualifié pour votre situation individuelle.'
      }
    },
    admin: {
      affiliates: {
        title: 'Gestion des partenaires',
        addNew: 'Ajouter un nouveau partenaire',
        name: 'Nom',
        website: 'Site web',
        commission: 'Taux de commission (%)',
        contact: 'Personne de contact',
        email: 'Email',
        phone: 'Téléphone',
        notes: 'Notes',
        status: 'Statut',
        active: 'Actif',
        inactive: 'Inactif',
        editAffiliate: 'Modifier le partenaire',
        deleteAffiliate: 'Supprimer le partenaire',
        confirmDelete: 'Êtes-vous sûr de vouloir supprimer ce partenaire ?',
        clicks: 'Clics',
        conversions: 'Conversions',
        conversionRate: 'Taux de conversion',
        totalCommission: 'Commission totale (CHF)',
        noAffiliates: 'Aucun partenaire trouvé. Ajoutez-en un pour commencer !'
      },
      dashboard: {
        title: 'Tableau de bord Admin',
        totalUsers: 'Nombre total d\'utilisateurs',
        taxCalculations: 'Calculs d\'impôts aujourd\'hui',
        activeSessions: 'Sessions actives',
        optimizationViews: 'Vues d\'optimisation',
        recentActivity: 'Activité récente',
        systemStatus: 'État du système',
        allSystemsOperational: 'Tous les systèmes sont opérationnels.'
      },
      settings: {
        title: 'Paramètres Admin',
        general: 'Paramètres généraux',
        applicationName: 'Nom de l\'application',
        defaultLanguage: 'Langue par défaut',
        maintenanceMode: 'Mode maintenance',
        security: 'Paramètres de sécurité',
        maxLoginAttempts: 'Max. tentatives de connexion',
        sessionTimeout: 'Timeout de session (minutes)',
        apiKeys: 'Clés API',
        manageApiKeys: 'Gérer les clés API',
        notifications: 'Notifications',
        adminEmail: 'Email admin pour notifications'
      }
    }
  }
};
