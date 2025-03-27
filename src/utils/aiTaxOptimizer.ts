import { PersonalInfo, FinancialInfo } from '../types/TaxInfo';
import { t } from 'i18next';
import { taxOptimizationRules, TaxOptimizationRule } from '../data/taxOptimizations';

interface AIOptimization {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  potentialSavings: number;
  confidence: number;
  steps: string[];
  risks?: string[];
  requirements?: string[];
}

// Enhanced AI tax optimization function that checks for special cases
// and provides comprehensive, personalized optimization suggestions
export function generateAIOptimizations(
  personalInfo: PersonalInfo,
  financialInfo: FinancialInfo
): AIOptimization[] {
  const optimizations: AIOptimization[] = [];
  const specialCaseChecks: Record<string, boolean> = {};

  // Apply rule-based optimizations
  for (const rule of taxOptimizationRules) {
    if (rule.condition(personalInfo, financialInfo)) {
      // Correct calculation of potential savings - with minimum CHF 100 threshold
      const calculatedSavings = rule.calculation(personalInfo, financialInfo);
      const potentialSavings = Math.max(100, calculatedSavings * rule.potentialSavingsFactor);
      
      // Only include optimizations with meaningful savings potential
      if (potentialSavings > 0) {
        optimizations.push({
          id: rule.id,
          title: t(rule.titleKey),
          description: t(rule.descriptionKey),
          impact: rule.impact,
          potentialSavings: potentialSavings,
          confidence: rule.confidence,
          steps: rule.stepsKeys.map(key => t(key)),
          risks: rule.risksKeys ? rule.risksKeys.map(key => t(key)) : undefined,
          requirements: rule.requirementsKeys ? rule.requirementsKeys.map(key => t(key)) : undefined,
        });
      }
      
      // Track which optimization types we've added
      specialCaseChecks[rule.id] = true;
    }
  }
  
  // Handle special cases and add missing optimization strategies
  
  // 1. Cross-border workers (Grenzgänger) - special tax rules
  if ((personalInfo as any).residenceCountry !== 'Switzerland' && financialInfo.yearlyIncome > 0) {
    optimizations.push(createCrossBorderOptimization(personalInfo, financialInfo));
    specialCaseChecks['crossBorder'] = true;
  }
  
  // 2. Health insurance premium optimization
  if (!specialCaseChecks['healthInsurance'] && financialInfo.yearlyIncome > 30000) {
    optimizations.push(createHealthInsuranceOptimization(personalInfo, financialInfo));
  }
  
  // 3. Income splitting/timing optimization for high-income taxpayers
  if (!specialCaseChecks['incomeSplitting'] &&
      financialInfo.yearlyIncome > 150000 &&
      (financialInfo as any).hasFlexibleIncome) {
    optimizations.push(createIncomeSplittingOptimization(personalInfo, financialInfo));
  }
  
  // 4. Capital gains tax planning
  if (!specialCaseChecks['capitalGains'] &&
      ((financialInfo as any).securitiesValue > 50000 || (financialInfo as any).hasInvestmentProperty)) {
    optimizations.push(createCapitalGainsOptimization(personalInfo, financialInfo));
  }
  
  // 5. Foreign assets disclosure compliance
  if ((financialInfo as any).hasForeignAssets && !specialCaseChecks['foreignAssets']) {
    optimizations.push(createForeignAssetsOptimization(personalInfo, financialInfo));
  }
  
  // Sort optimizations by impact and potential savings
  return optimizations.sort((a, b) => {
    // First sort by impact
    const impactOrder = { high: 3, medium: 2, low: 1 };
    const impactDiff = impactOrder[a.impact] - impactOrder[b.impact];
    
    // If same impact, sort by potential savings
    if (impactDiff === 0) {
      return b.potentialSavings - a.potentialSavings;
    }
    
    return impactDiff;
  });
}

// Helper functions for special case optimizations

function createCrossBorderOptimization(personalInfo: PersonalInfo, financialInfo: FinancialInfo): AIOptimization {
  const country = (personalInfo as any).residenceCountry || 'neighboring country';
  const potentialSavings = financialInfo.yearlyIncome * 0.03; // Approximate savings
  
  return {
    id: 'crossBorder',
    title: t('optimizations.crossBorder.title'),
    description: t('optimizations.crossBorder.description', { country }),
    impact: 'high',
    potentialSavings,
    confidence: 0.85,
    steps: [
      t('optimizations.crossBorder.steps.taxAgreement'),
      t('optimizations.crossBorder.steps.documentation'),
      t('optimizations.crossBorder.steps.consult')
    ],
    risks: [
      t('optimizations.crossBorder.risks.compliance'),
      t('optimizations.crossBorder.risks.changes')
    ],
    requirements: [
      t('optimizations.crossBorder.requirements.residency'),
      t('optimizations.crossBorder.requirements.permit')
    ]
  };
}

function createHealthInsuranceOptimization(personalInfo: PersonalInfo, financialInfo: FinancialInfo): AIOptimization {
  const basicSavings = 500;
  const familySizeMultiplier = personalInfo.hasChildren ? (1 + personalInfo.numberOfChildren * 0.5) : 1;
  const potentialSavings = basicSavings * familySizeMultiplier;
  
  return {
    id: 'healthInsurance',
    title: t('optimizations.healthInsurance.title'),
    description: t('optimizations.healthInsurance.description'),
    impact: 'medium',
    potentialSavings,
    confidence: 0.9,
    steps: [
      t('optimizations.healthInsurance.steps.compare'),
      t('optimizations.healthInsurance.steps.deductible'),
      t('optimizations.healthInsurance.steps.model')
    ]
  };
}

function createIncomeSplittingOptimization(personalInfo: PersonalInfo, financialInfo: FinancialInfo): AIOptimization {
  const potentialSavings = financialInfo.yearlyIncome * 0.02;
  
  return {
    id: 'incomeSplitting',
    title: t('optimizations.incomeSplitting.title'),
    description: t('optimizations.incomeSplitting.description'),
    impact: 'medium',
    potentialSavings,
    confidence: 0.75,
    steps: [
      t('optimizations.incomeSplitting.steps.timing'),
      t('optimizations.incomeSplitting.steps.structure'),
      t('optimizations.incomeSplitting.steps.planning')
    ],
    risks: [
      t('optimizations.incomeSplitting.risks.audit'),
      t('optimizations.incomeSplitting.risks.changes')
    ]
  };
}

function createCapitalGainsOptimization(personalInfo: PersonalInfo, financialInfo: FinancialInfo): AIOptimization {
  const assetBase = (financialInfo as any).securitiesValue || 50000;
  const potentialSavings = assetBase * 0.01;
  
  return {
    id: 'capitalGains',
    title: t('optimizations.capitalGains.title'),
    description: t('optimizations.capitalGains.description'),
    impact: 'medium',
    potentialSavings,
    confidence: 0.8,
    steps: [
      t('optimizations.capitalGains.steps.timing'),
      t('optimizations.capitalGains.steps.holding'),
      t('optimizations.capitalGains.steps.structure')
    ]
  };
}

function createForeignAssetsOptimization(personalInfo: PersonalInfo, financialInfo: FinancialInfo): AIOptimization {
  return {
    id: 'foreignAssets',
    title: t('optimizations.foreignAssets.title'),
    description: t('optimizations.foreignAssets.description'),
    impact: 'high',
    potentialSavings: 5000, // Penalty avoidance
    confidence: 0.95,
    steps: [
      t('optimizations.foreignAssets.steps.disclosure'),
      t('optimizations.foreignAssets.steps.reporting'),
      t('optimizations.foreignAssets.steps.compliance')
    ],
    risks: [
      t('optimizations.foreignAssets.risks.penalties'),
      t('optimizations.foreignAssets.risks.audit')
    ]
  };
}