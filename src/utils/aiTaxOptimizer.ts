import { PersonalInfo, FinancialInfo } from '../types/TaxInfo';
import { t } from 'i18next';

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

export function generateAIOptimizations(
  personalInfo: PersonalInfo,
  financialInfo: FinancialInfo
): AIOptimization[] {
  const optimizations: AIOptimization[] = [];

  // Pillar 3a Optimization
  if (financialInfo.yearlyIncome > 50000) {
    const maxContribution = 7056; // 2024 value
    const currentContribution = financialInfo.pillar3aContributions;
    const potentialExtra = Math.max(0, maxContribution - currentContribution);
    
    if (potentialExtra > 0) {
      optimizations.push({
        id: 'pillar3a',
        title: t('optimizations.pillar3a.title'),
        description: t('optimizations.pillar3a.description'),
        impact: 'high',
        potentialSavings: potentialExtra * 0.25,
        confidence: 0.95,
        steps: [
          t('optimizations.pillar3a.steps.increase', { amount: potentialExtra.toLocaleString() }),
          t('optimizations.pillar3a.steps.split'),
          t('optimizations.pillar3a.steps.invest')
        ],
        requirements: [
          t('optimizations.pillar3a.requirements.income'),
          t('optimizations.pillar3a.requirements.horizon')
        ]
      });
    }
  }

  // Pension Fund Optimization
  const maxPensionPurchase = Math.max(0, financialInfo.yearlyIncome * 0.15);
  const currentPensionContribution = financialInfo.pensionContributions;
  
  if (maxPensionPurchase > currentPensionContribution) {
    optimizations.push({
      id: 'pension',
      title: t('optimizations.pension.title'),
      description: t('optimizations.pension.description'),
      impact: 'high',
      potentialSavings: (maxPensionPurchase - currentPensionContribution) * 0.3,
      confidence: 0.9,
      steps: [
        t('optimizations.pension.steps.request'),
        t('optimizations.pension.steps.calculate'),
        t('optimizations.pension.steps.plan')
      ],
      requirements: [
        t('optimizations.pension.requirements.potential'),
        t('optimizations.pension.requirements.liquidity'),
        t('optimizations.pension.requirements.planning')
      ]
    });
  }

  // Property Investment Strategy
  if (!financialInfo.propertyOwnership && financialInfo.yearlyIncome > 120000) {
    optimizations.push({
      id: 'property',
      title: t('optimizations.property.title'),
      description: t('optimizations.property.description'),
      impact: 'high',
      potentialSavings: financialInfo.yearlyIncome * 0.03,
      confidence: 0.85,
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
      ]
    });
  }

  // Business Structure Optimization
  if (financialInfo.selfEmployed && financialInfo.yearlyIncome > 100000) {
    optimizations.push({
      id: 'business',
      title: t('optimizations.business.title'),
      description: t('optimizations.business.description'),
      impact: 'medium',
      potentialSavings: financialInfo.yearlyIncome * 0.05,
      confidence: 0.88,
      steps: [
        t('optimizations.business.steps.evaluate'),
        t('optimizations.business.steps.optimize'),
        t('optimizations.business.steps.review')
      ],
      risks: [
        t('optimizations.business.risks.setup'),
        t('optimizations.business.risks.admin'),
        t('optimizations.business.risks.transition')
      ]
    });
  }

  // Family Tax Planning
  if (personalInfo.hasChildren && personalInfo.numberOfChildren > 0) {
    optimizations.push({
      id: 'family',
      title: t('optimizations.family.title'),
      description: t('optimizations.family.description'),
      impact: 'medium',
      potentialSavings: personalInfo.numberOfChildren * 2000,
      confidence: 0.92,
      steps: [
        t('optimizations.family.steps.childcare'),
        t('optimizations.family.steps.education'),
        t('optimizations.family.steps.deductions')
      ]
    });
  }

  // Charitable Giving Strategy
  const maxCharitableDeduction = financialInfo.yearlyIncome * 0.2;
  if (financialInfo.charitableDonations < maxCharitableDeduction) {
    optimizations.push({
      id: 'charity',
      title: t('optimizations.charity.title'),
      description: t('optimizations.charity.description'),
      impact: 'medium',
      potentialSavings: (maxCharitableDeduction - financialInfo.charitableDonations) * 0.2,
      confidence: 0.9,
      steps: [
        t('optimizations.charity.steps.timing'),
        t('optimizations.charity.steps.methods'),
        t('optimizations.charity.steps.documentation')
      ]
    });
  }

  return optimizations;
}