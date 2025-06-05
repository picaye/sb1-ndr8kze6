import { PersonalInfo, FinancialInfo } from '../types/TaxInfo';
import { t } from 'i18next';

/**
 * Advanced AI Tax Optimization System for Swiss Taxpayers
 * 
 * This system provides sophisticated tax optimization strategies based on:
 * - Personal and financial situation
 * - Canton-specific tax rules
 * - Multi-year tax planning
 * - Risk tolerance and liquidity needs
 * - Swiss tax law compliance
 */

// ====================================
// Types and Interfaces
// ====================================

/**
 * Tax optimization strategy
 */
export interface AIOptimization {
  id: string;                                  // Unique identifier
  title: string;                               // Strategy title
  description: string;                         // Detailed description
  impact: 'high' | 'medium' | 'low';           // Impact level
  potentialSavings: number;                    // Estimated annual savings in CHF
  confidence: number;                          // Confidence score (0-1)
  steps: string[];                             // Implementation steps
  risks?: string[];                            // Potential risks
  requirements?: string[];                     // Requirements to implement
  timeline?: string;                           // Implementation timeline
  cantonSpecific?: boolean;                    // Whether strategy is canton-specific
  recommendedProviders?: RecommendedProvider[]; // Service providers
  multiYearProjection?: MultiYearProjection;   // Multi-year analysis
  legalReferences?: string[];                  // Legal references
  suitabilityScore?: number;                   // How suitable for this person (0-1)
}

/**
 * Recommended service provider
 */
interface RecommendedProvider {
  name: string;           // Provider name
  type: ProviderType;     // Provider type
  website?: string;       // Provider website
  rating?: number;        // Rating (1-5)
  minInvestment?: number; // Minimum investment amount
  fees?: string;          // Fee structure
  languages?: string[];   // Supported languages
}

/**
 * Provider types
 */
type ProviderType = 
  | 'bank' 
  | 'insurance' 
  | 'pension_fund' 
  | 'tax_advisor' 
  | 'financial_advisor'
  | 'real_estate'
  | 'fintech'
  | 'legal';

/**
 * Multi-year projection
 */
interface MultiYearProjection {
  years: number[];                       // Years in projection
  savings: Record<number, number>;       // Savings by year
  cumulativeSavings: Record<number, number>; // Cumulative savings
  assumptions?: string[];                // Assumptions made
}

/**
 * Canton tax rates and rules
 */
interface CantonTaxRules {
  cantonCode: string;
  wealthTaxThreshold: number;
  maxWealthTaxRate: number;
  childDeduction: number;
  churchTaxRate: number | null;
  hasInheritanceTax: boolean;
  hasGiftTax: boolean;
}

// ====================================
// Constants and Reference Data
// ====================================

/**
 * Pillar 3a contribution limits by year
 */
const PILLAR_3A_LIMITS: Record<number, { employed: number, selfEmployed: number }> = {
  2023: { employed: 6883, selfEmployed: 34416 },
  2024: { employed: 7056, selfEmployed: 35280 },
  2025: { employed: 7200, selfEmployed: 36000 },
  2026: { employed: 7350, selfEmployed: 36750 }, // Projected
};

/**
 * Child deduction limits by canton (2024)
 */
const CHILD_DEDUCTIONS: Record<string, number> = {
  'ZH': 9100,
  'BE': 8000,
  'LU': 6700,
  'UR': 8000,
  'SZ': 9000,
  'OW': 8000,
  'NW': 8000,
  'GL': 7000,
  'ZG': 12000,
  'FR': 8500,
  'SO': 6000,
  'BS': 7800,
  'BL': 7500,
  'SH': 8400,
  'AR': 6000,
  'AI': 6000,
  'SG': 7200,
  'GR': 6200,
  'AG': 7000,
  'TG': 7000,
  'TI': 11100,
  'VD': 7000,
  'VS': 7510,
  'NE': 6000,
  'GE': 9000,
  'JU': 5300
};

/**
 * Top Swiss financial service providers by category
 */
const RECOMMENDED_PROVIDERS: Record<ProviderType, RecommendedProvider[]> = {
  bank: [
    { name: 'UBS', type: 'bank', website: 'https://www.ubs.com', rating: 4.2, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'Credit Suisse', type: 'bank', website: 'https://www.credit-suisse.com', rating: 4.1, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'Raiffeisen', type: 'bank', website: 'https://www.raiffeisen.ch', rating: 4.3, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'PostFinance', type: 'bank', website: 'https://www.postfinance.ch', rating: 4.0, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'Zürcher Kantonalbank', type: 'bank', website: 'https://www.zkb.ch', rating: 4.4, languages: ['de', 'en'] }
  ],
  insurance: [
    { name: 'Swiss Life', type: 'insurance', website: 'https://www.swisslife.ch', rating: 4.3, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'AXA', type: 'insurance', website: 'https://www.axa.ch', rating: 4.2, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'Helvetia', type: 'insurance', website: 'https://www.helvetia.com', rating: 4.1, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'Baloise', type: 'insurance', website: 'https://www.baloise.ch', rating: 4.0, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'Zurich Insurance', type: 'insurance', website: 'https://www.zurich.ch', rating: 4.2, languages: ['de', 'fr', 'it', 'en'] }
  ],
  pension_fund: [
    { name: 'Vita', type: 'pension_fund', website: 'https://www.vita.ch', rating: 4.3, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'Publica', type: 'pension_fund', website: 'https://www.publica.ch', rating: 4.4, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'Pensionskasse Pro', type: 'pension_fund', website: 'https://www.pkpro.ch', rating: 4.0, languages: ['de', 'fr', 'en'] },
    { name: 'BVK', type: 'pension_fund', website: 'https://www.bvk.ch', rating: 4.2, languages: ['de', 'en'] },
    { name: 'Nest', type: 'pension_fund', website: 'https://www.nest-info.ch', rating: 4.1, languages: ['de', 'fr', 'it', 'en'] }
  ],
  tax_advisor: [
    { name: 'PwC Switzerland', type: 'tax_advisor', website: 'https://www.pwc.ch', rating: 4.5, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'KPMG Switzerland', type: 'tax_advisor', website: 'https://www.kpmg.ch', rating: 4.4, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'EY Switzerland', type: 'tax_advisor', website: 'https://www.ey.com/ch', rating: 4.4, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'Deloitte Switzerland', type: 'tax_advisor', website: 'https://www.deloitte.ch', rating: 4.3, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'BDO Switzerland', type: 'tax_advisor', website: 'https://www.bdo.ch', rating: 4.2, languages: ['de', 'fr', 'it', 'en'] }
  ],
  financial_advisor: [
    { name: 'VZ VermögensZentrum', type: 'financial_advisor', website: 'https://www.vermoegenszentrum.ch', rating: 4.5, languages: ['de', 'fr', 'en'] },
    { name: 'Finpension', type: 'financial_advisor', website: 'https://finpension.ch', rating: 4.6, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'True Wealth', type: 'financial_advisor', website: 'https://www.truewealth.ch', rating: 4.4, languages: ['de', 'fr', 'en'] },
    { name: 'Selma Finance', type: 'financial_advisor', website: 'https://www.selma.io', rating: 4.3, languages: ['de', 'fr', 'en'] },
    { name: 'Yova', type: 'financial_advisor', website: 'https://www.yova.ch', rating: 4.2, languages: ['de', 'fr', 'en'] }
  ],
  real_estate: [
    { name: 'Wüest Partner', type: 'real_estate', website: 'https://www.wuestpartner.com', rating: 4.4, languages: ['de', 'fr', 'en'] },
    { name: 'SPG Intercity', type: 'real_estate', website: 'https://www.spgintercity.ch', rating: 4.3, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'IAZI', type: 'real_estate', website: 'https://www.iazi.ch', rating: 4.2, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'Fahrländer Partner', type: 'real_estate', website: 'https://www.fpre.ch', rating: 4.3, languages: ['de', 'fr', 'en'] },
    { name: 'CSL Immobilien', type: 'real_estate', website: 'https://www.csl-immobilien.ch', rating: 4.1, languages: ['de', 'en'] }
  ],
  fintech: [
    { name: 'VIAC', type: 'fintech', website: 'https://viac.ch', rating: 4.7, minInvestment: 1, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'Inyova', type: 'fintech', website: 'https://www.inyova.ch', rating: 4.5, minInvestment: 2000, languages: ['de', 'fr', 'en'] },
    { name: 'Descartes Finance', type: 'fintech', website: 'https://www.descartes-finance.com', rating: 4.3, minInvestment: 10000, languages: ['de', 'fr', 'en'] },
    { name: 'Findependent', type: 'fintech', website: 'https://findependent.ch', rating: 4.4, minInvestment: 500, languages: ['de', 'en'] },
    { name: 'Frankly', type: 'fintech', website: 'https://frankly.ch', rating: 4.2, minInvestment: 8000, languages: ['de', 'fr', 'en'] }
  ],
  legal: [
    { name: 'Lenz & Staehelin', type: 'legal', website: 'https://www.lenzstaehelin.com', rating: 4.6, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'Bär & Karrer', type: 'legal', website: 'https://www.baerkarrer.ch', rating: 4.5, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'Homburger', type: 'legal', website: 'https://www.homburger.ch', rating: 4.6, languages: ['de', 'en'] },
    { name: 'Niederer Kraft Frey', type: 'legal', website: 'https://www.nkf.ch', rating: 4.5, languages: ['de', 'fr', 'it', 'en'] },
    { name: 'Walder Wyss', type: 'legal', website: 'https://www.walderwyss.com', rating: 4.4, languages: ['de', 'fr', 'it', 'en'] }
  ]
};

/**
 * Canton-specific tax rules (2024)
 */
const CANTON_TAX_RULES: Record<string, CantonTaxRules> = {
  'ZH': { 
    cantonCode: 'ZH', 
    wealthTaxThreshold: 77000, 
    maxWealthTaxRate: 0.3, 
    childDeduction: 9100, 
    churchTaxRate: 0.08, 
    hasInheritanceTax: true, 
    hasGiftTax: true 
  },
  'BE': { 
    cantonCode: 'BE', 
    wealthTaxThreshold: 97000, 
    maxWealthTaxRate: 0.34, 
    childDeduction: 8000, 
    churchTaxRate: 0.21, 
    hasInheritanceTax: true, 
    hasGiftTax: true 
  },
  'LU': { 
    cantonCode: 'LU', 
    wealthTaxThreshold: 60000, 
    maxWealthTaxRate: 0.25, 
    childDeduction: 6700, 
    churchTaxRate: 0.18, 
    hasInheritanceTax: true, 
    hasGiftTax: true 
  },
  'ZG': { 
    cantonCode: 'ZG', 
    wealthTaxThreshold: 50000, 
    maxWealthTaxRate: 0.14, 
    childDeduction: 12000, 
    churchTaxRate: 0.075, 
    hasInheritanceTax: false, 
    hasGiftTax: false 
  },
  'GE': { 
    cantonCode: 'GE', 
    wealthTaxThreshold: 82000, 
    maxWealthTaxRate: 0.38, 
    childDeduction: 9000, 
    churchTaxRate: null, 
    hasInheritanceTax: true, 
    hasGiftTax: true 
  },
  // Add other cantons as needed
};

// ====================================
// Helper Functions
// ====================================

/**
 * Get the current tax year
 */
function getCurrentTaxYear(): number {
  return new Date().getFullYear();
}

/**
 * Get Pillar 3a limit for a specific year
 */
function getPillar3aLimit(year: number, isSelfEmployed: boolean): number {
  const yearData = PILLAR_3A_LIMITS[year] || PILLAR_3A_LIMITS[getCurrentTaxYear()];
  return isSelfEmployed ? yearData.selfEmployed : yearData.employed;
}

/**
 * Calculate tax bracket based on income
 */
function getTaxBracket(income: number): number {
  if (income < 50000) return 0.1;
  if (income < 100000) return 0.2;
  if (income < 150000) return 0.25;
  if (income < 200000) return 0.3;
  if (income < 300000) return 0.35;
  return 0.4;
}

/**
 * Calculate confidence score based on multiple factors
 */
function calculateConfidence(
  personalInfo: PersonalInfo,
  financialInfo: FinancialInfo,
  strategyId: string,
  baseConfidence: number
): number {
  let score = baseConfidence;
  
  // Adjust based on data completeness
  if (!personalInfo.canton) score -= 0.1;
  if (!personalInfo.municipality) score -= 0.05;
  
  // Adjust based on income stability
  if (financialInfo.yearlyIncome > 200000) score += 0.05;
  
  // Strategy-specific adjustments
  switch (strategyId) {
    case 'pillar3a':
      if (financialInfo.yearlyIncome > 80000) score += 0.05;
      if (Number(personalInfo.age) > 55) score -= 0.05;
      break;
    case 'pension':
      if (financialInfo.yearlyIncome > 120000) score += 0.05;
      if (Number(personalInfo.age) < 40) score -= 0.05;
      break;
    case 'property':
      if (financialInfo.yearlyIncome < 100000) score -= 0.1;
      if (financialInfo.wealthAmount < 100000) score -= 0.1;
      break;
    case 'business':
      if (!financialInfo.selfEmployed) score = 0.1; // Not relevant
      if (financialInfo.yearlyIncome < 80000) score -= 0.1;
      break;
  }
  
  // Ensure score is within bounds
  return Math.max(0, Math.min(1, score));
}

/**
 * Calculate suitability score for a strategy
 */
function calculateSuitabilityScore(
  personalInfo: PersonalInfo,
  financialInfo: FinancialInfo,
  strategyId: string
): number {
  let score = 0.5; // Default middle score
  
  // Basic criteria
  const age = Number(personalInfo.age);
  const income = financialInfo.yearlyIncome;
  const wealth = financialInfo.wealthAmount;
  const hasChildren = personalInfo.hasChildren;
  
  switch (strategyId) {
    case 'pillar3a':
      score = 0.9; // Almost always beneficial
      if (age > 60) score -= 0.2;
      if (income < 50000) score -= 0.2;
      break;
      
    case 'pension':
      if (age < 40) score -= 0.1;
      if (age > 55) score += 0.2;
      if (income > 100000) score += 0.2;
      break;
      
    case 'property':
      if (income < 80000) score -= 0.3;
      if (wealth < 100000) score -= 0.2;
      if (hasChildren) score += 0.1;
      break;
      
    case 'business':
      if (!financialInfo.selfEmployed) score = 0.1;
      if (income > 150000) score += 0.3;
      break;
      
    case 'wealth':
      if (wealth < 500000) score -= 0.3;
      if (wealth > 2000000) score += 0.3;
      break;
      
    case 'inheritance':
      if (age < 50) score -= 0.2;
      if (age > 65) score += 0.3;
      if (wealth > 1000000) score += 0.2;
      break;
      
    case 'family':
      if (!hasChildren) score = 0.1;
      if (personalInfo.numberOfChildren > 1) score += 0.2;
      break;
      
    case 'charity':
      if (income > 150000) score += 0.2;
      break;
  }
  
  // Ensure score is within bounds
  return Math.max(0, Math.min(1, score));
}

/**
 * Generate multi-year projection for a strategy
 */
function generateMultiYearProjection(
  personalInfo: PersonalInfo,
  financialInfo: FinancialInfo,
  strategyId: string,
  baseSavings: number
): MultiYearProjection {
  const currentYear = getCurrentTaxYear();
  const years = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4];
  const savings: Record<number, number> = {};
  const cumulativeSavings: Record<number, number> = {};
  let cumulative = 0;
  
  // Strategy-specific projections
  switch (strategyId) {
    case 'pillar3a':
      years.forEach((year, index) => {
        // Assume 3% annual increase in savings
        const yearSavings = Math.round(baseSavings * Math.pow(1.03, index));
        savings[year] = yearSavings;
        cumulative += yearSavings;
        cumulativeSavings[year] = cumulative;
      });
      break;
      
    case 'pension':
      years.forEach((year, index) => {
        // Pension benefits increase with time
        const yearSavings = Math.round(baseSavings * Math.pow(1.05, index));
        savings[year] = yearSavings;
        cumulative += yearSavings;
        cumulativeSavings[year] = cumulative;
      });
      break;
      
    case 'property':
      years.forEach((year, index) => {
        // Property benefits tend to be stable
        const yearSavings = Math.round(baseSavings * (1 + index * 0.02));
        savings[year] = yearSavings;
        cumulative += yearSavings;
        cumulativeSavings[year] = cumulative;
      });
      break;
      
    default:
      years.forEach((year, index) => {
        const yearSavings = Math.round(baseSavings * (1 + index * 0.01));
        savings[year] = yearSavings;
        cumulative += yearSavings;
        cumulativeSavings[year] = cumulative;
      });
  }
  
  return {
    years,
    savings,
    cumulativeSavings,
    assumptions: [
      t('optimizations.multiYear.assumptions.inflation'),
      t('optimizations.multiYear.assumptions.taxRates'),
      t('optimizations.multiYear.assumptions.income')
    ]
  };
}

/**
 * Get recommended providers for a strategy
 */
function getRecommendedProviders(strategyId: string): RecommendedProvider[] {
  switch (strategyId) {
    case 'pillar3a':
      return [
        ...RECOMMENDED_PROVIDERS.fintech.filter(p => p.name === 'VIAC' || p.name === 'Frankly'),
        ...RECOMMENDED_PROVIDERS.bank.filter(p => p.name === 'UBS' || p.name === 'PostFinance')
      ];
      
    case 'pension':
      return [
        ...RECOMMENDED_PROVIDERS.pension_fund.slice(0, 3),
        ...RECOMMENDED_PROVIDERS.financial_advisor.filter(p => p.name === 'VZ VermögensZentrum')
      ];
      
    case 'property':
      return [
        ...RECOMMENDED_PROVIDERS.bank.filter(p => p.name === 'UBS' || p.name === 'Raiffeisen'),
        ...RECOMMENDED_PROVIDERS.real_estate.slice(0, 2)
      ];
      
    case 'business':
      return [
        ...RECOMMENDED_PROVIDERS.tax_advisor.slice(0, 3),
        ...RECOMMENDED_PROVIDERS.legal.filter(p => p.name === 'Walder Wyss')
      ];
      
    case 'wealth':
      return [
        ...RECOMMENDED_PROVIDERS.financial_advisor.slice(0, 3),
        ...RECOMMENDED_PROVIDERS.bank.filter(p => p.name === 'UBS' || p.name === 'Credit Suisse')
      ];
      
    case 'inheritance':
      return [
        ...RECOMMENDED_PROVIDERS.legal.slice(0, 2),
        ...RECOMMENDED_PROVIDERS.tax_advisor.filter(p => p.name === 'PwC Switzerland')
      ];
      
    case 'family':
      return [
        ...RECOMMENDED_PROVIDERS.financial_advisor.filter(p => p.name === 'VZ VermögensZentrum'),
        ...RECOMMENDED_PROVIDERS.tax_advisor.filter(p => p.name === 'BDO Switzerland')
      ];
      
    case 'charity':
      return [
        ...RECOMMENDED_PROVIDERS.tax_advisor.filter(p => p.name === 'KPMG Switzerland'),
        ...RECOMMENDED_PROVIDERS.legal.filter(p => p.name === 'Lenz & Staehelin')
      ];
      
    default:
      return RECOMMENDED_PROVIDERS.financial_advisor.slice(0, 3);
  }
}

// ====================================
// Main Optimization Function
// ====================================

/**
 * Generate comprehensive AI tax optimizations
 * 
 * @param personalInfo Personal information
 * @param financialInfo Financial information
 * @returns Array of tax optimization strategies
 */
export function generateAIOptimizations(
  personalInfo: PersonalInfo,
  financialInfo: FinancialInfo
): AIOptimization[] {
  const optimizations: AIOptimization[] = [];
  const currentYear = getCurrentTaxYear();

  // ====================================
  // 1. Pillar 3a Optimization
  // ====================================
  if (financialInfo.yearlyIncome > 30000) {
    const maxContribution = getPillar3aLimit(currentYear, financialInfo.selfEmployed);
    const currentContribution = financialInfo.pillar3aContributions || 0;
    const potentialExtra = Math.max(0, maxContribution - currentContribution);
    
    if (potentialExtra > 0) {
      const taxBracket = getTaxBracket(financialInfo.yearlyIncome);
      const potentialSavings = Math.round(potentialExtra * taxBracket);
      const confidence = calculateConfidence(personalInfo, financialInfo, 'pillar3a', 0.95);
      const suitabilityScore = calculateSuitabilityScore(personalInfo, financialInfo, 'pillar3a');
      
      optimizations.push({
        id: 'pillar3a',
        title: t('optimizations.pillar3a.title'),
        description: t('optimizations.pillar3a.description'),
        impact: 'high',
        potentialSavings,
        confidence,
        suitabilityScore,
        steps: [
          t('optimizations.pillar3a.steps.increase', { amount: potentialExtra.toLocaleString() }),
          t('optimizations.pillar3a.steps.split'),
          t('optimizations.pillar3a.steps.invest')
        ],
        requirements: [
          t('optimizations.pillar3a.requirements.income'),
          t('optimizations.pillar3a.requirements.horizon')
        ],
        timeline: t('optimizations.pillar3a.timeline'),
        recommendedProviders: getRecommendedProviders('pillar3a'),
        multiYearProjection: generateMultiYearProjection(personalInfo, financialInfo, 'pillar3a', potentialSavings),
        legalReferences: [
          t('optimizations.pillar3a.legal.bvg'),
          t('optimizations.pillar3a.legal.tax')
        ]
      });
    }
    
    // Add spouse pillar 3a if applicable
    if ((personalInfo.maritalStatus === 'married' || personalInfo.maritalStatus === 'registered_partnership') && 
        financialInfo.spouseYearlyIncome && financialInfo.spouseYearlyIncome > 30000) {
      const spouseMaxContribution = getPillar3aLimit(currentYear, financialInfo.spouseSelfEmployed || false);
      const spouseCurrentContribution = financialInfo.spousePillar3aContributions || 0;
      const spousePotentialExtra = Math.max(0, spouseMaxContribution - spouseCurrentContribution);
      
      if (spousePotentialExtra > 0) {
        const taxBracket = getTaxBracket(financialInfo.spouseYearlyIncome);
        const potentialSavings = Math.round(spousePotentialExtra * taxBracket);
        
        optimizations.push({
          id: 'spouse_pillar3a',
          title: t('optimizations.spousePillar3a.title'),
          description: t('optimizations.spousePillar3a.description'),
          impact: 'high',
          potentialSavings,
          confidence: 0.95,
          steps: [
            t('optimizations.spousePillar3a.steps.increase', { amount: spousePotentialExtra.toLocaleString() }),
            t('optimizations.spousePillar3a.steps.split'),
            t('optimizations.spousePillar3a.steps.invest')
          ],
          requirements: [
            t('optimizations.spousePillar3a.requirements.income'),
            t('optimizations.spousePillar3a.requirements.horizon')
          ],
          timeline: t('optimizations.spousePillar3a.timeline'),
          recommendedProviders: getRecommendedProviders('pillar3a'),
          multiYearProjection: generateMultiYearProjection(personalInfo, financialInfo, 'pillar3a', potentialSavings)
        });
      }
    }
  }

  // ====================================
  // 2. Pension Fund Optimization
  // ====================================
  const maxPensionPurchase = Math.max(0, financialInfo.yearlyIncome * 0.15);
  const currentPensionContribution = financialInfo.pensionContributions || 0;
  
  if (maxPensionPurchase > currentPensionContribution && financialInfo.yearlyIncome > 80000) {
    const potentialExtra = maxPensionPurchase - currentPensionContribution;
    const taxBracket = getTaxBracket(financialInfo.yearlyIncome);
    const potentialSavings = Math.round(potentialExtra * taxBracket);
    const confidence = calculateConfidence(personalInfo, financialInfo, 'pension', 0.9);
    const suitabilityScore = calculateSuitabilityScore(personalInfo, financialInfo, 'pension');
    
    optimizations.push({
      id: 'pension',
      title: t('optimizations.pension.title'),
      description: t('optimizations.pension.description'),
      impact: 'high',
      potentialSavings,
      confidence,
      suitabilityScore,
      steps: [
        t('optimizations.pension.steps.request'),
        t('optimizations.pension.steps.calculate'),
        t('optimizations.pension.steps.plan')
      ],
      requirements: [
        t('optimizations.pension.requirements.potential'),
        t('optimizations.pension.requirements.liquidity'),
        t('optimizations.pension.requirements.planning')
      ],
      risks: [
        t('optimizations.pension.risks.liquidity'),
        t('optimizations.pension.risks.regulations')
      ],
      timeline: t('optimizations.pension.timeline'),
      recommendedProviders: getRecommendedProviders('pension'),
      multiYearProjection: generateMultiYearProjection(personalInfo, financialInfo, 'pension', potentialSavings),
      legalReferences: [
        t('optimizations.pension.legal.bvg'),
        t('optimizations.pension.legal.tax')
      ]
    });
  }

  // ====================================
  // 3. Property Investment Strategy
  // ====================================
  if (!financialInfo.propertyOwnership && financialInfo.yearlyIncome > 120000) {
    const potentialSavings = Math.round(financialInfo.yearlyIncome * 0.03);
    const confidence = calculateConfidence(personalInfo, financialInfo, 'property', 0.85);
    const suitabilityScore = calculateSuitabilityScore(personalInfo, financialInfo, 'property');
    
    optimizations.push({
      id: 'property',
      title: t('optimizations.property.title'),
      description: t('optimizations.property.description'),
      impact: 'high',
      potentialSavings,
      confidence,
      suitabilityScore,
      steps: [
        t('optimizations.property.steps.evaluate'),
        t('optimizations.property.steps.mortgage'),
        t('optimizations.property.steps.energy')
      ],
      risks: [
        t('optimizations.property.risks.market'),
        t('optimizations.property.risks.interest'),
        t('optimizations.property.risks.maintenance')
      ],
      requirements: [
        t('optimizations.property.requirements.equity'),
        t('optimizations.property.requirements.income'),
        t('optimizations.property.requirements.credit')
      ],
      timeline: t('optimizations.property.timeline'),
      recommendedProviders: getRecommendedProviders('property'),
      multiYearProjection: generateMultiYearProjection(personalInfo, financialInfo, 'property', potentialSavings),
      legalReferences: [
        t('optimizations.property.legal.tax'),
        t('optimizations.property.legal.mortgage')
      ]
    });
  } else if (financialInfo.propertyOwnership && financialInfo.mortgageDebt > 0) {
    // Property optimization for existing owners
    optimizations.push({
      id: 'property_optimization',
      title: t('optimizations.propertyOptimization.title'),
      description: t('optimizations.propertyOptimization.description'),
      impact: 'medium',
      potentialSavings: Math.round(financialInfo.yearlyIncome * 0.02),
      confidence: 0.8,
      steps: [
        t('optimizations.propertyOptimization.steps.mortgage'),
        t('optimizations.propertyOptimization.steps.renovation'),
        t('optimizations.propertyOptimization.steps.timing')
      ],
      risks: [
        t('optimizations.propertyOptimization.risks.interest'),
        t('optimizations.propertyOptimization.risks.value')
      ],
      timeline: t('optimizations.propertyOptimization.timeline'),
      recommendedProviders: getRecommendedProviders('property')
    });
  }

  // ====================================
  // 4. Business Structure Optimization
  // ====================================
  if (financialInfo.selfEmployed && financialInfo.yearlyIncome > 100000) {
    const potentialSavings = Math.round(financialInfo.yearlyIncome * 0.05);
    const confidence = calculateConfidence(personalInfo, financialInfo, 'business', 0.88);
    const suitabilityScore = calculateSuitabilityScore(personalInfo, financialInfo, 'business');
    
    optimizations.push({
      id: 'business',
      title: t('optimizations.business.title'),
      description: t('optimizations.business.description'),
      impact: 'medium',
      potentialSavings,
      confidence,
      suitabilityScore,
      steps: [
        t('optimizations.business.steps.evaluate'),
        t('optimizations.business.steps.optimize'),
        t('optimizations.business.steps.review')
      ],
      risks: [
        t('optimizations.business.risks.setup'),
        t('optimizations.business.risks.admin'),
        t('optimizations.business.risks.transition')
      ],
      requirements: [
        t('optimizations.business.requirements.revenue'),
        t('optimizations.business.requirements.structure'),
        t('optimizations.business.requirements.planning')
      ],
      timeline: t('optimizations.business.timeline'),
      recommendedProviders: getRecommendedProviders('business'),
      multiYearProjection: generateMultiYearProjection(personalInfo, financialInfo, 'business', potentialSavings),
      legalReferences: [
        t('optimizations.business.legal.or'),
        t('optimizations.business.legal.tax')
      ]
    });
  }

  // ====================================
  // 5. Wealth Management Strategy
  // ====================================
  if (financialInfo.wealthAmount > 500000) {
    const cantonCode = personalInfo.canton.substring(0, 2).toUpperCase();
    const wealthTaxThreshold = CANTON_TAX_RULES[cantonCode]?.wealthTaxThreshold || 100000;
    const maxWealthTaxRate = CANTON_TAX_RULES[cantonCode]?.maxWealthTaxRate || 0.3;
    
    const taxableWealth = Math.max(0, financialInfo.wealthAmount - wealthTaxThreshold);
    const currentWealthTax = taxableWealth * maxWealthTaxRate / 100;
    const potentialSavings = Math.round(currentWealthTax * 0.3); // Assume 30% optimization potential
    
    const confidence = calculateConfidence(personalInfo, financialInfo, 'wealth', 0.85);
    const suitabilityScore = calculateSuitabilityScore(personalInfo, financialInfo, 'wealth');
    
    optimizations.push({
      id: 'wealth',
      title: t('optimizations.wealth.title'),
      description: t('optimizations.wealth.description'),
      impact: 'medium',
      potentialSavings,
      confidence,
      suitabilityScore,
      steps: [
        t('optimizations.wealth.steps.structure'),
        t('optimizations.wealth.steps.diversify'),
        t('optimizations.wealth.steps.timing')
      ],
      risks: [
        t('optimizations.wealth.risks.market'),
        t('optimizations.wealth.risks.liquidity'),
        t('optimizations.wealth.risks.compliance')
      ],
      requirements: [
        t('optimizations.wealth.requirements.assets'),
        t('optimizations.wealth.requirements.horizon'),
        t('optimizations.wealth.requirements.advice')
      ],
      timeline: t('optimizations.wealth.timeline'),
      recommendedProviders: getRecommendedProviders('wealth'),
      cantonSpecific: true,
      legalReferences: [
        t('optimizations.wealth.legal.cantonal'),
        t('optimizations.wealth.legal.federal')
      ]
    });
  }

  // ====================================
  // 6. Inheritance & Estate Planning
  // ====================================
  const age = Number(personalInfo.age);
  if (age > 55 && financialInfo.wealthAmount > 300000) {
    const cantonCode = personalInfo.canton.substring(0, 2).toUpperCase();
    const hasInheritanceTax = CANTON_TAX_RULES[cantonCode]?.hasInheritanceTax !== false;
    
    if (hasInheritanceTax) {
      const potentialInheritanceTax = financialInfo.wealthAmount * 0.1; // Rough estimate
      const potentialSavings = Math.round(potentialInheritanceTax * 0.4); // 40% optimization potential
      
      const confidence = calculateConfidence(personalInfo, financialInfo, 'inheritance', 0.8);
      const suitabilityScore = calculateSuitabilityScore(personalInfo, financialInfo, 'inheritance');
      
      optimizations.push({
        id: 'inheritance',
        title: t('optimizations.inheritance.title'),
        description: t('optimizations.inheritance.description'),
        impact: 'high',
        potentialSavings,
        confidence,
        suitabilityScore,
        steps: [
          t('optimizations.inheritance.steps.planning'),
          t('optimizations.inheritance.steps.gifts'),
          t('optimizations.inheritance.steps.structures')
        ],
        risks: [
          t('optimizations.inheritance.risks.legal'),
          t('optimizations.inheritance.risks.control'),
          t('optimizations.inheritance.risks.changes')
        ],
        requirements: [
          t('optimizations.inheritance.requirements.assets'),
          t('optimizations.inheritance.requirements.family'),
          t('optimizations.inheritance.requirements.legal')
        ],
        timeline: t('optimizations.inheritance.timeline'),
        recommendedProviders: getRecommendedProviders('inheritance'),
        cantonSpecific: true,
        legalReferences: [
          t('optimizations.inheritance.legal.civil'),
          t('optimizations.inheritance.legal.cantonal')
        ]
      });
    }
  }

  // ====================================
  // 7. Family Tax Planning
  // ====================================
  if (personalInfo.hasChildren && personalInfo.numberOfChildren > 0) {
    const cantonCode = personalInfo.canton.substring(0, 2).toUpperCase();
    const childDeduction = CHILD_DEDUCTIONS[cantonCode] || 6500;
    const potentialSavings = Math.round(childDeduction * personalInfo.numberOfChildren * 0.2);
    
    const confidence = calculateConfidence(personalInfo, financialInfo, 'family', 0.92);
    const suitabilityScore = calculateSuitabilityScore(personalInfo, financialInfo, 'family');
    
    optimizations.push({
      id: 'family',
      title: t('optimizations.family.title'),
      description: t('optimizations.family.description'),
      impact: 'medium',
      potentialSavings,
      confidence,
      suitabilityScore,
      steps: [
        t('optimizations.family.steps.childcare'),
        t('optimizations.family.steps.education'),
        t('optimizations.family.steps.deductions')
      ],
      requirements: [
        t('optimizations.family.requirements.children'),
        t('optimizations.family.requirements.expenses'),
        t('optimizations.family.requirements.documentation')
      ],
      timeline: t('optimizations.family.timeline'),
      recommendedProviders: getRecommendedProviders('family'),
      cantonSpecific: true,
      legalReferences: [
        t('optimizations.family.legal.federal'),
        t('optimizations.family.legal.cantonal')
      ]
    });
  }

  // ====================================
  // 8. Charitable Giving Strategy
  // ====================================
  const maxCharitableDeduction = financialInfo.yearlyIncome * 0.2;
  if (financialInfo.charitableDonations < maxCharitableDeduction && financialInfo.yearlyIncome > 100000) {
    const potentialExtra = maxCharitableDeduction - financialInfo.charitableDonations;
    const taxBracket = getTaxBracket(financialInfo.yearlyIncome);
    const potentialSavings = Math.round(potentialExtra * taxBracket * 0.5); // Assume 50% efficiency
    
    const confidence = calculateConfidence(personalInfo, financialInfo, 'charity', 0.9);
    const suitabilityScore = calculateSuitabilityScore(personalInfo, financialInfo, 'charity');
    
    optimizations.push({
      id: 'charity',
      title: t('optimizations.charity.title'),
      description: t('optimizations.charity.description'),
      impact: 'medium',
      potentialSavings,
      confidence,
      suitabilityScore,
      steps: [
        t('optimizations.charity.steps.timing'),
        t('optimizations.charity.steps.methods'),
        t('optimizations.charity.steps.documentation')
      ],
      requirements: [
        t('optimizations.charity.requirements.income'),
        t('optimizations.charity.requirements.eligible'),
        t('optimizations.charity.requirements.documentation')
      ],
      timeline: t('optimizations.charity.timeline'),
      recommendedProviders: getRecommendedProviders('charity'),
      legalReferences: [
        t('optimizations.charity.legal.federal'),
        t('optimizations.charity.legal.deductions')
      ]
    });
  }

  // ====================================
  // 9. Cross-border Tax Optimization
  // ====================================
  // This would be implemented for people with international ties
  // Omitted for brevity

  // ====================================
  // 10. Tax Loss Harvesting
  // ====================================
  if (financialInfo.wealthAmount > 200000) {
    optimizations.push({
      id: 'taxloss',
      title: t('optimizations.taxloss.title'),
      description: t('optimizations.taxloss.description'),
      impact: 'medium',
      potentialSavings: Math.round(financialInfo.wealthAmount * 0.01),
      confidence: 0.8,
      steps: [
        t('optimizations.taxloss.steps.review'),
        t('optimizations.taxloss.steps.timing'),
        t('optimizations.taxloss.steps.reinvest')
      ],
      risks: [
        t('optimizations.taxloss.risks.market'),
        t('optimizations.taxloss.risks.wash')
      ],
      timeline: t('optimizations.taxloss.timeline'),
      recommendedProviders: [
        ...RECOMMENDED_PROVIDERS.financial_advisor.slice(0, 2),
        ...RECOMMENDED_PROVIDERS.bank.slice(0, 2)
      ]
    });
  }

  // Sort optimizations by potential savings (descending)
  return optimizations.sort((a, b) => b.potentialSavings - a.potentialSavings);
}
