export default {
  translation: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Successfully saved',
      viewDetails: 'View Details',
      hideDetails: 'Hide Details',
      applyNow: 'Apply Now',
      learnMore: 'Learn More'
    },
    header: {
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      dashboard: 'Dashboard',
      settings: 'Settings',
      logout: 'Logout'
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
          title: 'Person 2 (Spouse/Partner)',
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
        },
        isWithholdingTaxEligible: 'Eligible for Withholding Tax (Quellensteuer)?'
      },
      financialInfo: {
        title: 'Financial Information',
        yearlyIncome: 'Annual Income (CHF)',
        spouseYearlyIncome: 'Spouse Annual Income (CHF)',
        wealthAmount: 'Liquid Wealth (CHF)',
        spouseWealthAmount: 'Spouse Liquid Wealth (CHF)',
        totalWealth: 'Total Gross Wealth (CHF) (incl. property, investments)',
        totalLiabilities: 'Total Liabilities/Debts (CHF) (incl. mortgage)',
        mortgageDebt: 'Mortgage Debt (CHF)',
        pensionContributions: 'Annual Pension Contributions (2nd Pillar) (CHF)',
        spousePensionContributions: 'Spouse Annual Pension Contributions (2nd Pillar) (CHF)',
        pillar3aContributions: 'Annual Pillar 3a Contributions (CHF)',
        spousePillar3aContributions: 'Spouse Annual Pillar 3a Contributions (CHF)',
        charitableDonations: 'Annual Charitable Donations (CHF)',
        additionalDeductions: 'Other Tax-Deductible Expenses (CHF)',
        currentTaxBurden: 'Current Estimated Annual Tax Burden (CHF)',
        propertyOwnership: 'I own real estate in Switzerland',
        selfEmployed: 'I am self-employed',
        spouseSelfEmployed: 'My spouse is self-employed'
      }
    },
    navigation: {
      next: 'Next',
      back: 'Back',
      viewRecommendations: 'View Recommendations',
      saveAndContinue: 'Save and Continue',
      calculateTaxes: 'Calculate Taxes'
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
      },
      generic: {
        required: 'This field is required',
        invalidNumber: 'Please enter a valid number',
        positiveNumber: 'Please enter a positive number',
        numberRange: 'Value must be between {{min}} and {{max}}',
        maxLength: 'Maximum length is {{count}} characters'
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
      steps: 'Implementation Steps',
      risks: 'Potential Risks',
      requirements: 'Requirements',
      timeline: 'Estimated Timeline',
      legalReferences: 'Legal References',
      suitability: 'Suitability',
      cantonSpecific: 'Canton-Specific',
      multiYearProjection: 'Multi-Year Projection (CHF)',
      years: 'Years',
      annualSavings: 'Annual Savings',
      cumulativeSavings: 'Cumulative Savings',
      providerType: 'Provider Type',
      rating: 'Rating',
      fees: 'Fees',
      languages: 'Languages',
      pillar3a: {
        title: 'Maximize Pillar 3a Contributions',
        description: 'Fully utilize your Pillar 3a allowance to reduce taxable income and build tax-privileged retirement savings. This is one of the most effective and straightforward tax-saving measures in Switzerland.',
        steps: {
          increase: 'Increase your annual contribution by {{amount}} CHF to reach the maximum limit.',
          split: 'Consider splitting Pillar 3a accounts for staggered withdrawals later to break tax progression.',
          invest: 'Invest your Pillar 3a assets in a diversified portfolio for potentially higher long-term returns.'
        },
        requirements: {
          income: 'Sufficient taxable income (AHV-liable).',
          horizon: 'Long-term investment horizon (until retirement).'
        },
        timeline: 'Annually, before year-end.',
        legal: {
          bvg: 'BVG Art. 82 (Occupational Pensions)',
          tax: 'DBG Art. 33 (Federal Direct Tax Law)'
        }
      },
      spousePillar3a: {
        title: 'Maximize Spouse\'s Pillar 3a Contributions',
        description: 'If applicable, ensure your spouse also fully utilizes their Pillar 3a allowance to further reduce joint taxable income and enhance retirement savings.',
        steps: {
          increase: 'Increase spouse\'s annual contribution by {{amount}} CHF to reach their maximum limit.',
          split: 'Consider splitting spouse\'s Pillar 3a accounts for staggered withdrawals.',
          invest: 'Invest spouse\'s Pillar 3a assets in a diversified portfolio.'
        },
        requirements: {
          income: 'Spouse has sufficient taxable income (AHV-liable).',
          horizon: 'Long-term investment horizon for spouse.'
        },
        timeline: 'Annually, before year-end.'
      },
      pension: {
        title: 'Optimize Pension Fund Buy-ins (2nd Pillar)',
        description: 'Make voluntary purchases into your pension fund to fill any existing gaps. These buy-ins are fully tax-deductible and can significantly reduce your taxable income, especially in high-income years.',
        steps: {
          request: 'Request a buy-in potential statement from your pension fund.',
          calculate: 'Calculate the optimal buy-in amount based on your tax situation and liquidity.',
          plan: 'Plan buy-ins over several years to smooth out tax benefits, if applicable.'
        },
        requirements: {
          potential: 'Existing pension fund gap (buy-in potential).',
          liquidity: 'Sufficient liquid assets for the buy-in.',
          planning: 'Careful planning, especially if considering early withdrawal for property.'
        },
        risks: {
          liquidity: 'Funds are locked until retirement (with exceptions).',
          regulations: 'Pension fund regulations can change.'
        },
        timeline: 'Can be done annually; consult pension fund for deadlines.',
        legal: {
          bvg: 'BVG Art. 60-60d (Occupational Pensions)',
          tax: 'DBG Art. 33 (Federal Direct Tax Law)'
        }
      },
      property: {
        title: 'Strategic Property Investment',
        description: 'Investing in real estate can offer tax advantages such as mortgage interest and maintenance cost deductions. For primary residences, imputed rental value is taxed, but deductions can offset this.',
        steps: {
          evaluate: 'Evaluate if property ownership aligns with your financial goals and risk profile.',
          mortgage: 'Optimize mortgage structure (e.g., direct vs. indirect amortization).',
          energy: 'Consider energy-efficient renovations for additional deductions and long-term savings.'
        },
        risks: {
          market: 'Real estate market fluctuations.',
          interest: 'Changes in mortgage interest rates.',
          maintenance: 'Ongoing maintenance costs.'
        },
        requirements: {
          equity: 'Sufficient down payment (typically 20%).',
          income: 'Affordable income level for mortgage payments.',
          credit: 'Good creditworthiness.'
        },
        timeline: 'Long-term (5-10+ years).',
        legal: {
          tax: 'DBG Art. 21, 32, 34 (Federal Direct Tax Law)',
          mortgage: 'Relevant cantonal and federal property laws.'
        }
      },
      propertyOptimization: {
        title: 'Optimize Existing Property Taxation',
        description: 'If you own property, optimize deductions related to mortgage interest, maintenance, and renovations. Strategic debt management and value-preserving investments can reduce your tax burden.',
        steps: {
          mortgage: 'Review your mortgage: consider interest-only options or indirect amortization via Pillar 3a for tax efficiency.',
          renovation: 'Plan value-preserving and energy-saving renovations; these are often deductible.',
          timing: 'Bundle maintenance expenses in specific years to exceed standard deductions if applicable.'
        },
        risks: {
          interest: 'Changes in mortgage interest rates can affect affordability.',
          value: 'Property value may not always appreciate as expected.'
        },
        timeline: 'Ongoing, with specific actions annually or periodically.'
      },
      business: {
        title: 'Optimize Business Structure (for Self-Employed)',
        description: 'For self-employed individuals, choosing the right legal structure (sole proprietorship, GmbH, AG) can have significant tax implications. Optimizing business expenses and pension planning is also crucial.',
        steps: {
          evaluate: 'Evaluate if your current legal structure (e.g., sole proprietorship) is optimal or if transitioning to a GmbH/AG offers benefits.',
          optimize: 'Maximize deductible business expenses (office, travel, equipment).',
          review: 'Regularly review your business\'s financial and tax situation with an advisor.'
        },
        risks: {
          setup: 'Costs and administrative effort for changing legal structure.',
          admin: 'Increased administrative burden with corporate structures.',
          transition: 'Potential tax implications during transition.'
        },
        requirements: {
          revenue: 'Sufficient business revenue and profit.',
          structure: 'Understanding of different legal structures.',
          planning: 'Long-term business and financial planning.'
        },
        timeline: 'Medium to long-term planning; legal changes can take months.',
        legal: {
          or: 'Swiss Code of Obligations (OR)',
          tax: 'Relevant federal and cantonal tax laws for businesses.'
        }
      },
      wealth: {
        title: 'Strategic Wealth Management & Asset Allocation',
        description: 'Optimize your wealth tax burden by structuring assets efficiently. This can involve diversifying investments, considering tax-efficient investment vehicles, and managing liabilities.',
        steps: {
          structure: 'Review asset allocation for tax efficiency (e.g., dividend vs. capital gains focus).',
          diversify: 'Diversify investments across different asset classes and geographies.',
          timing: 'Manage timing of asset sales to optimize capital gains taxation where applicable (though generally not taxed for private individuals in CH).'
        },
        risks: {
          market: 'Investment market risks.',
          liquidity: 'Some tax-efficient structures may reduce liquidity.',
          compliance: 'Ensuring compliance with complex financial regulations.'
        },
        requirements: {
          assets: 'Significant taxable wealth.',
          horizon: 'Long-term investment horizon.',
          advice: 'Professional financial and tax advice.'
        },
        timeline: 'Ongoing, with annual reviews.',
        legal: {
          cantonal: 'Cantonal wealth tax laws.',
          federal: 'Federal guidelines on asset valuation.'
        }
      },
      inheritance: {
        title: 'Proactive Inheritance & Estate Planning',
        description: 'Plan your estate frühzeitig to minimize inheritance and gift taxes for your beneficiaries. This varies significantly by canton and relationship to heirs.',
        steps: {
          planning: 'Develop a comprehensive estate plan including a will and potentially pre-nuptial/inheritance agreements.',
          gifts: 'Consider tax-efficient lifetime gifts (be aware of cantonal gift tax rules and claw-back periods).',
          structures: 'Explore structures like foundations or usufruct arrangements if suitable for large estates.'
        },
        risks: {
          legal: 'Complex legal area requiring expert advice.',
          control: 'Loss of control over assets gifted during lifetime.',
          changes: 'Family circumstances and tax laws can change.'
        },
        requirements: {
          assets: 'Significant assets to plan for.',
          family: 'Clear understanding of family situation and wishes.',
          legal: 'Professional legal and tax advice.'
        },
        timeline: 'Long-term planning, review every 5-10 years or upon major life events.',
        legal: {
          civil: 'Swiss Civil Code (ZGB) on inheritance.',
          cantonal: 'Cantonal inheritance and gift tax laws.'
        }
      },
      family: {
        title: 'Optimize Family-Related Tax Deductions',
        description: 'Maximize deductions related to children, such as childcare costs, education expenses (where applicable), and insurance premiums. Ensure all eligible family members are correctly accounted for in tax declarations.',
        steps: {
          childcare: 'Deduct actual childcare costs up to cantonal limits.',
          education: 'Check for deductibility of education/training costs for children.',
          deductions: 'Ensure all child-related deductions (e.g., for insurance) are claimed.'
        },
        requirements: {
          children: 'Having dependent children.',
          expenses: 'Actual, documented expenses for childcare or education.',
          documentation: 'Keep receipts and contracts for all claimed expenses.'
        },
        timeline: 'Annually, when preparing tax return.',
        legal: {
          federal: 'Federal Direct Tax Law (DBG) on family deductions.',
          cantonal: 'Cantonal tax laws regarding family and child deductions.'
        }
      },
      charity: {
        title: 'Strategic Charitable Giving',
        description: 'Donations to recognized charitable organizations are tax-deductible up to a certain percentage of your net income (typically 20% at federal level, varies by canton). Plan your donations for maximum tax efficiency.',
        steps: {
          timing: 'Bundle donations in a single year to exceed standard deduction thresholds if applicable.',
          methods: 'Consider donating appreciated assets instead of cash for potential additional benefits (consult advisor).',
          documentation: 'Keep all donation receipts from eligible organizations.'
        },
        requirements: {
          income: 'Sufficient income to make donations impactful.',
          eligible: 'Donations must be to tax-exempt, recognized charitable organizations.',
          documentation: 'Official donation receipts.'
        },
        timeline: 'Annually, or planned over several years.',
        legal: {
          federal: 'DBG Art. 33a (Federal Direct Tax Law).',
          deductions: 'Cantonal regulations on charitable deductions.'
        }
      },
      taxloss: {
        title: 'Tax Loss Harvesting (for Investments)',
        description: 'If you have taxable investments (e.g., as a professional trader or via a corporate entity), strategically realize capital losses to offset capital gains, reducing overall taxable investment income.',
        steps: {
          review: 'Regularly review your investment portfolio for assets with unrealized losses.',
          timing: 'Realize losses before year-end to offset gains within the same tax period.',
          reinvest: 'Be mindful of "wash sale" rules if repurchasing similar assets shortly after selling.'
        },
        risks: {
          market: 'Selling at a loss crystallizes that loss; market could recover.',
          wash: 'Complex "wash sale" rules can negate tax benefits if not followed carefully.'
        },
        timeline: 'Typically towards the end of the tax year.',
      },
      multiYear: {
        assumptions: {
          inflation: 'Assumes average annual inflation of 2%.',
          taxRates: 'Assumes current tax rates and brackets remain stable.',
          income: 'Assumes your income remains relatively stable or grows moderately.'
        }
      },
      providerTypes: {
        bank: 'Bank',
        insurance: 'Insurance Company',
        pension_fund: 'Pension Fund',
        tax_advisor: 'Tax Advisor',
        financial_advisor: 'Financial Advisor',
        real_estate: 'Real Estate Specialist',
        fintech: 'FinTech Provider',
        legal: 'Legal Advisor / Lawyer'
      },
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
        commission: 'Commission Rate (%)',
        contact: 'Contact Person',
        email: 'Email',
        phone: 'Phone',
        notes: 'Notes',
        status: 'Status',
        active: 'Active',
        inactive: 'Inactive',
        editAffiliate: 'Edit Affiliate',
        deleteAffiliate: 'Delete Affiliate',
        confirmDelete: 'Are you sure you want to delete this affiliate?',
        clicks: 'Clicks',
        conversions: 'Conversions',
        conversionRate: 'Conversion Rate',
        totalCommission: 'Total Commission (CHF)',
        noAffiliates: 'No affiliates found. Add one to get started!'
      },
      dashboard: {
        title: 'Admin Dashboard',
        totalUsers: 'Total Users',
        taxCalculations: 'Tax Calculations Today',
        activeSessions: 'Active Sessions',
        optimizationViews: 'Optimization Views',
        recentActivity: 'Recent Activity',
        systemStatus: 'System Status',
        allSystemsOperational: 'All systems operational.'
      },
      settings: {
        title: 'Admin Settings',
        general: 'General Settings',
        applicationName: 'Application Name',
        defaultLanguage: 'Default Language',
        maintenanceMode: 'Maintenance Mode',
        security: 'Security Settings',
        maxLoginAttempts: 'Max Login Attempts',
        sessionTimeout: 'Session Timeout (minutes)',
        apiKeys: 'API Keys',
        manageApiKeys: 'Manage API Keys',
        notifications: 'Notifications',
        adminEmail: 'Admin Email for Notifications'
      }
    }
  }
};
