export interface TaxOptimizationRule {
  id: string;
  titleKey: string;
  descriptionKey: string;
  impact: 'high' | 'medium' | 'low';
  potentialSavingsFactor: number;
  confidence: number;
  stepsKeys: string[];
  risksKeys?: string[];
  requirementsKeys?: string[];
  condition: (personalInfo: any, financialInfo: any) => boolean;
  calculation: (personalInfo: any, financialInfo: any) => number;
}

export const taxOptimizationRules: TaxOptimizationRule[] = [
  {
    id: 'pillar3a',
    titleKey: 'optimizations.pillar3a.title',
    descriptionKey: 'optimizations.pillar3a.description',
    impact: 'high',
    potentialSavingsFactor: 0.25,
    confidence: 0.95,
    stepsKeys: [
      'optimizations.pillar3a.steps.increase',
      'optimizations.pillar3a.steps.split',
      'optimizations.pillar3a.steps.invest',
    ],
    requirementsKeys: [
      'optimizations.pillar3a.requirements.income',
      'optimizations.pillar3a.requirements.horizon',
    ],
    condition: (personalInfo, financialInfo) => {
      // Cannot contribute to Pillar 3a with zero income
      if (financialInfo.yearlyIncome <= 0) {
        return false;
      }
      
      // Age restriction check (18-70 years old)
      if (personalInfo.age < 18 || personalInfo.age > 70) {
        return false;
      }

      // Determine correct max contribution based on employment status
      const maxContribution = financialInfo.selfEmployed ? 35280 : 7056; // 2024 values
      const currentContribution = financialInfo.pillar3aContributions;
      
      // Check if there's potential for additional contribution
      const potentialExtra = Math.max(0, maxContribution - currentContribution);
      
      // Ensure contributions don't exceed earned income
      const maxAllowedByIncome = financialInfo.yearlyIncome;
      const actualPotential = Math.min(potentialExtra, maxAllowedByIncome);

      return actualPotential > 0;
    },
    calculation: (personalInfo, financialInfo) => {
      // Use correct max contribution based on employment status
      const maxContribution = financialInfo.selfEmployed ? 35280 : 7056; // 2024 values
      const currentContribution = financialInfo.pillar3aContributions;
      
      // Ensure we don't exceed earned income
      const maxAllowedByIncome = financialInfo.yearlyIncome;
      const potentialExtra = Math.max(0, maxContribution - currentContribution);
      
      return Math.min(potentialExtra, maxAllowedByIncome);
    },
  },
  {
    id: 'pension',
    titleKey: 'optimizations.pension.title',
    descriptionKey: 'optimizations.pension.description',
    impact: 'high',
    potentialSavingsFactor: 0.3,
    confidence: 0.9,
    stepsKeys: [
      'optimizations.pension.steps.request',
      'optimizations.pension.steps.calculate',
      'optimizations.pension.steps.plan',
    ],
    requirementsKeys: [
      'optimizations.pension.requirements.potential',
      'optimizations.pension.requirements.liquidity',
      'optimizations.pension.requirements.planning',
    ],
    condition: (personalInfo, financialInfo) => {
      // No pension fund purchase possible with zero income
      if (financialInfo.yearlyIncome <= 0) {
        return false;
      }
      
      // Check for recent immigration (5-year rule)
      if (personalInfo.yearsInSwitzerland !== undefined && personalInfo.yearsInSwitzerland < 5) {
        return false;
      }
      
      // Check for previous early withdrawals that must be repaid first
      if (financialInfo.previousPensionWithdrawals && financialInfo.previousPensionWithdrawals > 0) {
        return false;
      }
      
      // Check for actual pension fund gap instead of simplified calculation
      const hasPensionGap = financialInfo.pensionFundGap !== undefined &&
                           financialInfo.pensionFundGap > 0;
      
      // Verify sufficient liquidity for a pension purchase
      const hasLiquidity = financialInfo.wealthAmount > financialInfo.mortgageDebt &&
                          financialInfo.liquidAssets > 10000;
      
      return hasPensionGap && hasLiquidity;
    },
    calculation: (personalInfo, financialInfo) => {
      // Use the actual pension fund gap if available
      if (financialInfo.pensionFundGap !== undefined) {
        return Math.min(financialInfo.pensionFundGap, financialInfo.liquidAssets * 0.5);
      }
      
      // Fallback to a more realistic approximation
      // Based on age-dependent maximums and current pension fund
      const ageMultiplier = Math.min(3, Math.max(1, (personalInfo.age - 30) / 10));
      const maxPurchase = ageMultiplier * financialInfo.yearlyIncome * 0.1;
      const estimatedPotential = maxPurchase - financialInfo.pensionContributions;
      
      return Math.max(0, estimatedPotential);
    },
  },
  {
    id: 'property',
    titleKey: 'optimizations.property.title',
    descriptionKey: 'optimizations.property.description',
    impact: 'medium', // Reduced impact
    potentialSavingsFactor: 0.01, // Reduced savings factor
    confidence: 0.75, // Reduced confidence
    stepsKeys: [
      'optimizations.property.steps.evaluate',
      'optimizations.property.steps.mortgage',
      'optimizations.property.steps.energy',
    ],
    risksKeys: [
      'optimizations.property.risks.market',
      'optimizations.property.risks.interest',
      'optimizations.property.risks.maintenance',
    ],
    requirementsKeys: [
      'optimizations.property.requirements.equity',
      'optimizations.property.requirements.income',
      'optimizations.property.requirements.credit',
    ],
    condition: (personalInfo, financialInfo) => {
      // Two separate use cases:
      // 1. Property owners looking to optimize deductions
      // 2. Non-owners considering purchase for tax benefits
      
      if (financialInfo.propertyOwnership) {
        // For existing owners - check if they can optimize deductions
        return true;
      } else {
        // For potential buyers - ensure they meet criteria
        const hasAdequateIncome = financialInfo.yearlyIncome > 120000;
        
        // Debt-to-income ratio check
        const affordableDebtRatio = financialInfo.yearlyIncome / 5 >
                                   (financialInfo.mortgageDebt + 500000) * 0.05;
        
        // Equity check (typically 20% minimum)
        const hasMinimumEquity = financialInfo.wealthAmount > 100000;
        
        return hasAdequateIncome && affordableDebtRatio && hasMinimumEquity;
      }
    },
    calculation: (personalInfo, financialInfo) => {
      if (financialInfo.propertyOwnership) {
        // For existing owners - calculate based on property value
        const propertyMaintenance = financialInfo.propertyValue * 0.01; // 1% maintenance
        return propertyMaintenance;
      } else {
        // For potential buyers - estimate tax savings on potential mortgage interest
        const potentialMortgage = financialInfo.yearlyIncome * 5;
        const interestRate = 0.035; // 3.5% average rate
        const interestDeduction = potentialMortgage * interestRate;
        return interestDeduction;
      }
    },
  },
  {
    id: 'business',
    titleKey: 'optimizations.business.title',
    descriptionKey: 'optimizations.business.description',
    impact: 'medium',
    potentialSavingsFactor: 0.02, // Reduced savings factor
    confidence: 0.8, // Reduced confidence
    stepsKeys: [
      'optimizations.business.steps.evaluate',
      'optimizations.business.steps.optimize',
      'optimizations.business.steps.review',
    ],
    risksKeys: [
      'optimizations.business.risks.setup',
      'optimizations.business.risks.admin',
      'optimizations.business.risks.transition',
    ],
    condition: (personalInfo, financialInfo) => {
      // Basic self-employment check
      if (!financialInfo.selfEmployed) {
        return false;
      }
      
      // Different optimization possibilities based on business structure
      if (financialInfo.businessStructure === 'sole_proprietorship') {
        // For sole proprietorships, optimizations are most relevant at higher incomes
        return financialInfo.yearlyIncome > 80000;
      } else if (financialInfo.businessStructure === 'llc' || financialInfo.businessStructure === 'corporation') {
        // For incorporated structures, optimizations apply at any income level
        return true;
      } else {
        // Default case for unspecified structure
        return financialInfo.yearlyIncome > 100000;
      }
    },
    calculation: (personalInfo, financialInfo) => {
      let potentialSavings = 0;
      
      // Home office deduction potential
      if (financialInfo.hasHomeOffice) {
        const homeOfficeSize = financialInfo.homeOfficeSize || 15; // m²
        const homeSize = financialInfo.homeSize || 100; // m²
        const homeRent = financialInfo.homeRent || financialInfo.yearlyIncome * 0.2;
        
        // Home office deduction (proportional to space)
        potentialSavings += (homeOfficeSize / homeSize) * homeRent;
      }
      
      // Business expense optimization (typically 15-20% of revenue)
      const baseBusinessExpenses = financialInfo.yearlyIncome * 0.15;
      const optimizedBusinessExpenses = financialInfo.yearlyIncome * 0.2;
      potentialSavings += optimizedBusinessExpenses - baseBusinessExpenses;
      
      // Social security optimization
      if (financialInfo.businessStructure === 'llc' || financialInfo.businessStructure === 'corporation') {
        // Potential salary/dividend optimization
        potentialSavings += financialInfo.yearlyIncome * 0.03;
      }
      
      return potentialSavings;
    },
  },
  {
    id: 'family',
    titleKey: 'optimizations.family.title',
    descriptionKey: 'optimizations.family.description',
    impact: 'medium',
    potentialSavingsFactor: 2000,
    confidence: 0.92,
    stepsKeys: [
      'optimizations.family.steps.childcare',
      'optimizations.family.steps.education',
      'optimizations.family.steps.deductions',
    ],
    condition: (personalInfo, financialInfo) => {
      // Basic check for children
      if (!personalInfo.hasChildren || personalInfo.numberOfChildren <= 0) {
        return false;
      }
      
      // Check for child's age - optimizations are typically for children under 25
      const hasChildrenUnder25 = personalInfo.childrenAges ?
          personalInfo.childrenAges.some((age: number) => age < 25) : true;
      
      // Check for childcare expenses - greater opportunities with childcare costs
      const hasChildcareExpenses = financialInfo.childcareExpenses &&
          financialInfo.childcareExpenses > 0;
          
      // Additional check for education expenses
      const hasEducationExpenses = financialInfo.educationExpenses &&
          financialInfo.educationExpenses > 0;
      
      return hasChildrenUnder25 && (hasChildcareExpenses || hasEducationExpenses || true);
    },
    calculation: (personalInfo, financialInfo) => {
      let totalSavings = 0;
      // Ensure canton is a valid string key
      const canton = (personalInfo.canton as string) || 'Zürich';
      
      // Child deduction based on canton
      const childDeductions: Record<string, number> = {
        'Zürich': 9100,
        'Bern': 8000,
        'Luzern': 6700,
        'Zug': 12000,
        'Basel-Stadt': 7800,
        'Geneva': 9000,
        'Vaud': 7000,
        // Default for other cantons
        'default': 6500
      };
      
      const deductionPerChild = childDeductions[canton] || childDeductions['default'];
      totalSavings += personalInfo.numberOfChildren * deductionPerChild * 0.1; // Rough tax savings estimate
      
      // Childcare deduction savings
      if (financialInfo.childcareExpenses) {
        // Childcare deduction limits vary by canton (from 3,000 to 25,000)
        const childcareLimits: Record<string, number> = {
          'Zürich': 10100,
          'Bern': 8000,
          'Geneva': 25000,
          'Vaud': 7100,
          'default': 10000
        };
        
        const maxChildcareDeduction = childcareLimits[canton] || childcareLimits['default'];
        const actualChildcareDeduction = Math.min(financialInfo.childcareExpenses, maxChildcareDeduction);
        totalSavings += actualChildcareDeduction * 0.1; // Approximate tax savings
      }
      
      // Single parent additional deduction
      if (personalInfo.maritalStatus === 'single' && personalInfo.hasChildren) {
        const singleParentDeductions: Record<string, number> = {
          'Zürich': 5900,
          'Bern': 5600,
          'default': 6000
        };
        
        const singleParentDeduction = singleParentDeductions[canton] || singleParentDeductions['default'];
        totalSavings += singleParentDeduction * 0.1;
      }
      
      return totalSavings;
    },
  },
  {
    id: 'charity',
    titleKey: 'optimizations.charity.title',
    descriptionKey: 'optimizations.charity.description',
    impact: 'medium',
    potentialSavingsFactor: 0.2,
    confidence: 0.9,
    stepsKeys: [
      'optimizations.charity.steps.timing',
      'optimizations.charity.steps.methods',
      'optimizations.charity.steps.documentation',
    ],
    condition: (personalInfo, financialInfo) => {
      // No charitable deductions possible with zero income
      if (financialInfo.yearlyIncome <= 0) {
        return false;
      }
      
      // Check if the user has made any donations already (suggesting interest)
      const hasMadeDonations = financialInfo.charitableDonations > 0;
      
      // Check if user has capacity for more donations (under 20% limit)
      const maxCharitableDeduction = financialInfo.yearlyIncome * 0.2;
      const hasDeductionCapacity = financialInfo.charitableDonations < maxCharitableDeduction;
      
      // Check if donations were made to qualified organizations
      // Note: In Switzerland, only donations to tax-exempt organizations qualify
      const hasQualifiedDonations = financialInfo.donationsToQualifiedOrgs !== false;
      
      return hasMadeDonations && hasDeductionCapacity && hasQualifiedDonations;
    },
    calculation: (personalInfo, financialInfo) => {
      // Calculate maximum possible additional donation
      const maxCharitableDeduction = financialInfo.yearlyIncome * 0.2;
      const additionalPotential = Math.max(0, maxCharitableDeduction - financialInfo.charitableDonations);
      
      // Calculate tax savings based on marginal tax rate (use canton to determine)
      // This is more accurate than using a fixed factor
      const canton = (personalInfo.canton as string) || 'Zürich';
      
      // Approximate marginal tax rates based on income level and canton
      const getMarginalRate = (income: number, cantonName: string): number => {
        // Base rates that vary by income level
        let rate = 0.15; // Default modest rate
        
        if (income > 200000) {
          rate = 0.35; // High income
        } else if (income > 120000) {
          rate = 0.25; // Upper middle income
        } else if (income > 80000) {
          rate = 0.20; // Middle income
        }
        
        // Canton-specific adjustments
        const cantonAdjustments: Record<string, number> = {
          'Zürich': 0.0,
          'Zug': -0.05,  // Lower taxes
          'Geneva': 0.05, // Higher taxes
          'Basel-Stadt': 0.03
        };
        
        const adjustment = cantonAdjustments[cantonName] || 0;
        return Math.min(0.40, Math.max(0.10, rate + adjustment)); // Keep between 10-40%
      };
      
      const marginalRate = getMarginalRate(financialInfo.yearlyIncome, canton);
      
      // Return potential tax savings
      return additionalPotential * marginalRate;
    },
  },
];