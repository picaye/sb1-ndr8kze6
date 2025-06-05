export default {
  translation: {
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      success: 'Enregistré avec succès'
    },
    header: {
      home: 'Accueil',
      about: 'À propos',
      contact: 'Contact'
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
            protestant: 'Protestante',
            other: 'Autre'
          }
        },
        person2: {
          title: 'Personne 2',
          age: 'Âge Personne 2',
          religion: {
            label: 'Religion Personne 2',
            none: 'Aucune',
            romanCatholic: 'Catholique romaine',
            protestant: 'Protestante',
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
        }
      },
      financialInfo: {
        title: 'Informations financières',
        yearlyIncome: 'Revenu annuel (CHF)',
        spouseYearlyIncome: 'Revenu annuel du conjoint (CHF)',
        wealthAmount: 'Fortune totale (CHF)',
        mortgageDebt: 'Dette hypothécaire (CHF)',
        pensionContributions: 'Cotisations caisse de pension (CHF)',
        spousePensionContributions: 'Cotisations caisse de pension du conjoint (CHF)',
        pillar3aContributions: 'Cotisations pilier 3a (CHF)',
        spousePillar3aContributions: 'Cotisations pilier 3a du conjoint (CHF)',
        charitableDonations: 'Dons caritatifs (CHF)',
        currentTaxBurden: 'Charge fiscale actuelle (CHF)',
        propertyOwnership: 'Je possède un bien immobilier',
        selfEmployed: 'Je suis indépendant(e)',
        spouseSelfEmployed: 'Mon conjoint est indépendant(e)'
      }
    },
    navigation: {
      next: 'Suivant',
      back: 'Retour',
      viewRecommendations: 'Voir les recommandations',
      saveAndContinue: 'Enregistrer et continuer'
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
      steps: 'Étapes',
      risks: 'Risques',
      requirements: 'Prérequis',
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
        commission: 'Taux de commission',
        contact: 'Personne de contact',
        email: 'Email',
        phone: 'Téléphone',
        notes: 'Notes',
        status: 'Statut',
        active: 'Actif',
        inactive: 'Inactif'
      }
    }
  }
};