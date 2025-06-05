export default {
  translation: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Successfully saved'
    },
    header: {
      home: 'Home',
      about: 'About',
      contact: 'Contact'
    },
    auth: {
      welcomeBack: 'Welcome Back',
      createAccount: 'Create Account',
      loginPrompt: 'Please log in to continue',
      login: 'Log in',
      signUp: 'Sign up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      continueWithGoogle: 'Continue with Google',
      forgotPassword: {
        link: 'Forgot password?',
        title: 'Reset Password',
        description: 'Enter your email address and we will send you a link to reset your password.',
        submit: 'Send Reset Link',
        sending: 'Sending...',
        checkEmail: 'Please check your email for the password reset link.'
      },
      validation: {
        invalid: 'Invalid email or password',
        googleError: 'Could not sign in with Google',
        passwordMismatch: 'Passwords do not match',
        emailNotFound: 'No account found with that email address'
      },
      orContinueWith: 'or continue with',
      needAccount: 'Need an account? Sign up',
      alreadyHaveAccount: 'Already have an account? Log in',
      backToLogin: 'Back to login'
    },
    forms: {
      personalInfo: {
        title: 'Personal Information',
        person1: {
          title: 'Person 1',
          age: 'Age Person 1',
          religion: {
            label: 'Religion Person 1',
            none: 'None',
            romanCatholic: 'Roman Catholic',
            protestant: 'Protestant',
            other: 'Other'
          }
        },
        person2: {
          title: 'Person 2',
          age: 'Age Person 2',
          religion: {
            label: 'Religion Person 2',
            none: 'None',
            romanCatholic: 'Roman Catholic',
            protestant: 'Protestant',
            other: 'Other'
          }
        },
        maritalStatus: {
          label: 'Marital Status',
          single: 'Single',
          married: 'Married',
          registeredPartnership: 'Registered Partnership',
          divorced: 'Divorced',
          widowed: 'Widowed'
        },
        canton: 'Canton',
        municipality: 'Municipality',
        selectMunicipality: 'Select Municipality',
        children: {
          question: 'Do you have children?',
          number: 'Number of children'
        }
      },
      financialInfo: {
        title: 'Financial Information',
        yearlyIncome: 'Annual Income (CHF)',
        spouseYearlyIncome: 'Spouse Annual Income (CHF)',
        wealthAmount: 'Total Wealth (CHF)',
        mortgageDebt: 'Mortgage Debt (CHF)',
        pensionContributions: 'Pension Contributions (CHF)',
        spousePensionContributions: 'Spouse Pension Contributions (CHF)',
        pillar3aContributions: 'Pillar 3a Contributions (CHF)',
        spousePillar3aContributions: 'Spouse Pillar 3a Contributions (CHF)',
        charitableDonations: 'Charitable Donations (CHF)',
        currentTaxBurden: 'Current Tax Burden (CHF)',
        propertyOwnership: 'I own property',
        selfEmployed: 'I am self-employed',
        spouseSelfEmployed: 'My spouse is self-employed'
      }
    },
    navigation: {
      next: 'Next',
      back: 'Back',
      viewRecommendations: 'View Recommendations',
      saveAndContinue: 'Save and Continue'
    },
    validation: {
      municipality: {
        required: 'Please select a municipality',
        invalid: 'Please select a valid municipality'
      },
      pillar3a: {
        negativeAmount: 'Amount cannot be negative',
        incomeRequired: 'Annual income is required',
        ageRestriction: 'Age must be between 18 and 70',
        maxAmount: 'Maximum contribution is {{amount}} CHF'
      }
    },
    optimizations: {
      aiTitle: 'AI Tax Optimization Recommendations',
      aiDescription: 'Based on your individual situation, we have identified the following tax optimizations:',
      totalPotentialSavings: 'Total Potential Savings',
      recommendedProviders: 'Recommended Providers',
      minInvestment: 'Minimum Investment',
      impact: 'Impact',
      confidence: 'Confidence',
      potentialSavings: 'Potential Savings',
      steps: 'Steps',
      risks: 'Risks',
      requirements: 'Requirements',
      legalDisclaimer: {
        title: 'Legal Disclaimer',
        text: 'The tax optimization suggestions presented here are non-binding recommendations based on the information you provided. They do not substitute professional tax advice. We assume no liability for the accuracy and completeness of the information or the resulting tax consequences. Please consult a qualified tax advisor for your individual situation.'
      }
    },
    admin: {
      affiliates: {
        title: 'Affiliate Management',
        addNew: 'Add New Affiliate',
        name: 'Name',
        website: 'Website',
        commission: 'Commission Rate',
        contact: 'Contact Person',
        email: 'Email',
        phone: 'Phone',
        notes: 'Notes',
        status: 'Status',
        active: 'Active',
        inactive: 'Inactive'
      }
    }
  }
};