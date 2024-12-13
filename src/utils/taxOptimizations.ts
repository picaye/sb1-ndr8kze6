import { PersonalInfo, FinancialInfo } from '../types/TaxInfo';

interface TaxOptimization {
  title: string;
  description: string;
  potentialSavings?: number;
  steps?: string[];
}

export function calculateOptimizations(
  personalInfo: PersonalInfo,
  financialInfo: FinancialInfo
): TaxOptimization[] {
  const optimizations: TaxOptimization[] = [];

  // 3a Retirement Optimization
  const maxPillar3aContribution = personalInfo.age >= 25 ? 7056 : 35280; // 2024 values
  if (financialInfo.retirementContributions < maxPillar3aContribution) {
    const potentialAdditionalContribution = maxPillar3aContribution - financialInfo.retirementContributions;
    const estimatedTaxSaving = potentialAdditionalContribution * 0.25; // Approximate tax saving

    optimizations.push({
      title: 'Pillar 3a Optimization',
      description: 'Maximize your tax deductions by fully utilizing your Pillar 3a contribution allowance.',
      potentialSavings: estimatedTaxSaving,
      steps: [
        `Increase your yearly Pillar 3a contribution by CHF ${potentialAdditionalContribution.toLocaleString()}`,
        'Consider opening multiple Pillar 3a accounts for more flexible withdrawal options',
        'Invest in securities-based 3a solutions for potentially higher returns'
      ]
    });
  }

  // Property-related optimizations
  if (financialInfo.propertyOwnership) {
    optimizations.push({
      title: 'Property Maintenance Deductions',
      description: 'Optimize your property-related tax deductions through strategic maintenance timing and energy-efficient renovations.',
      steps: [
        'Bundle maintenance work in alternating years to maximize periodic deductions',
        'Consider energy-efficient renovations for additional tax benefits',
        'Document all property maintenance expenses meticulously'
      ]
    });
  }

  // Self-employed optimizations
  if (financialInfo.selfEmployed) {
    optimizations.push({
      title: 'Business Expense Optimization',
      description: 'Maximize legitimate business expense deductions and optimize your business structure.',
      steps: [
        'Review and optimize your business structure (e.g., LLC vs. sole proprietorship)',
        'Maintain detailed records of all business-related expenses',
        'Consider timing of major business purchases for optimal tax impact'
      ]
    });
  }

  // Charitable donations optimization
  const maxCharitableDeduction = financialInfo.yearlyIncome * 0.2; // 20% of income
  if (financialInfo.charitableDonations < maxCharitableDeduction) {
    optimizations.push({
      title: 'Charitable Donations Strategy',
      description: 'Optimize your tax position through strategic charitable giving.',
      potentialSavings: (maxCharitableDeduction - financialInfo.charitableDonations) * 0.2,
      steps: [
        'Consider increasing charitable donations up to 20% of your income',
        'Bundle donations in specific tax years for maximum impact',
        'Ensure all donations are properly documented and to qualified organizations'
      ]
    });
  }

  // Family-related optimizations
  if (personalInfo.hasChildren) {
    optimizations.push({
      title: 'Family Tax Benefits',
      description: 'Maximize available family-related tax benefits and deductions.',
      steps: [
        'Claim child care expenses',
        'Consider education savings accounts',
        'Review and claim all available child and education deductions'
      ]
    });
  }

  return optimizations;
}