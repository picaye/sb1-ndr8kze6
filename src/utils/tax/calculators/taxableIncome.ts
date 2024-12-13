import { PersonalInfo, FinancialInfo } from '../../../types/TaxInfo';
import { TaxableIncomeResult } from '../types';
import { CHILD_DEDUCTIONS, INSURANCE_DEDUCTIONS, PROFESSIONAL_EXPENSES, PILLAR_3A_LIMITS } from '../constants/deductions';

export function calculateTaxableIncome(
  personalInfo: PersonalInfo,
  financialInfo: FinancialInfo
): TaxableIncomeResult {
  const isJointFiling = personalInfo.maritalStatus === 'married' || 
                       personalInfo.maritalStatus === 'registered_partnership';

  // Social security contributions (AHV/IV/EO/ALV)
  const socialContributions = financialInfo.yearlyIncome * 0.053;
  const spouseSocialContributions = isJointFiling && financialInfo.spouseYearlyIncome ? 
    financialInfo.spouseYearlyIncome * 0.053 : 0;

  // Pension fund contributions (typical rate)
  const pensionContributions = Math.min(
    financialInfo.pensionContributions,
    financialInfo.yearlyIncome * 0.25
  );
  const spousePensionContributions = isJointFiling && financialInfo.spouseYearlyIncome ? 
    Math.min(
      financialInfo.spousePensionContributions || 0,
      financialInfo.spouseYearlyIncome * 0.25
    ) : 0;

  // Pillar 3a
  const maxPillar3a = financialInfo.selfEmployed ? 
    PILLAR_3A_LIMITS.SELF_EMPLOYED : 
    PILLAR_3A_LIMITS.EMPLOYED;
  const pillar3a = Math.min(financialInfo.pillar3aContributions, maxPillar3a);
  
  const spouseMaxPillar3a = isJointFiling && financialInfo.spouseSelfEmployed ?
    PILLAR_3A_LIMITS.SELF_EMPLOYED :
    PILLAR_3A_LIMITS.EMPLOYED;
  const spousePillar3a = isJointFiling ?
    Math.min(financialInfo.spousePillar3aContributions || 0, spouseMaxPillar3a) : 0;

  // Professional expenses
  const professionalExpenses = calculateProfessionalExpenses(financialInfo.yearlyIncome);
  const spouseProfessionalExpenses = isJointFiling && financialInfo.spouseYearlyIncome ?
    calculateProfessionalExpenses(financialInfo.spouseYearlyIncome) : 0;

  // Insurance premiums
  const insuranceDeductions = calculateInsuranceDeductions(personalInfo);

  // Child deductions
  const childDeductions = calculateChildDeductions(personalInfo);

  // Other deductions (charitable donations, etc.)
  const otherDeductions = calculateOtherDeductions(financialInfo);

  // Total deductions
  const totalDeductions = 
    socialContributions +
    spouseSocialContributions +
    pensionContributions +
    spousePensionContributions +
    pillar3a +
    spousePillar3a +
    professionalExpenses +
    spouseProfessionalExpenses +
    insuranceDeductions +
    childDeductions +
    otherDeductions;

  // Calculate taxable incomes
  const totalIncome = financialInfo.yearlyIncome + 
    (isJointFiling && financialInfo.spouseYearlyIncome ? financialInfo.spouseYearlyIncome : 0);

  const federalTaxableIncome = Math.max(0, totalIncome - totalDeductions);
  const cantonalTaxableIncome = Math.max(0, totalIncome - totalDeductions);

  return {
    federalTaxableIncome,
    cantonalTaxableIncome,
    isJointFiling,
    deductions: {
      social: socialContributions,
      pension: pensionContributions,
      pillar3a,
      professional: professionalExpenses,
      insurance: insuranceDeductions,
      children: childDeductions,
      other: otherDeductions,
      total: totalDeductions
    }
  };
}

function calculateProfessionalExpenses(income: number): number {
  const baseExpenses = Math.min(
    Math.max(income * PROFESSIONAL_EXPENSES.BASE_RATE, PROFESSIONAL_EXPENSES.MIN_AMOUNT),
    PROFESSIONAL_EXPENSES.MAX_AMOUNT
  );
  
  const mealExpenses = PROFESSIONAL_EXPENSES.MEAL_ALLOWANCE * PROFESSIONAL_EXPENSES.WORKING_DAYS;
  const commuteExpenses = Math.min(PROFESSIONAL_EXPENSES.MAX_COMMUTE, income * 0.02);
  
  return baseExpenses + mealExpenses + commuteExpenses;
}

function calculateInsuranceDeductions(personalInfo: PersonalInfo): number {
  const baseDeduction = personalInfo.maritalStatus === 'married' ? 
    INSURANCE_DEDUCTIONS.MARRIED : 
    INSURANCE_DEDUCTIONS.SINGLE;
  
  const childDeduction = personalInfo.hasChildren ? 
    personalInfo.numberOfChildren * INSURANCE_DEDUCTIONS.CHILD : 
    0;
  
  return baseDeduction + childDeduction;
}

function calculateChildDeductions(personalInfo: PersonalInfo): number {
  if (!personalInfo.hasChildren || personalInfo.numberOfChildren === 0) {
    return 0;
  }
  
  const deductionPerChild = CHILD_DEDUCTIONS[personalInfo.canton] || 6500;
  return deductionPerChild * personalInfo.numberOfChildren;
}

function calculateOtherDeductions(financialInfo: FinancialInfo): number {
  let deductions = 0;

  // Charitable donations (max 20% of income)
  if (financialInfo.charitableDonations > 0) {
    const maxDonation = financialInfo.yearlyIncome * 0.2;
    deductions += Math.min(financialInfo.charitableDonations, maxDonation);
  }

  // Mortgage interest
  if (financialInfo.mortgageDebt > 0) {
    const mortgageInterest = financialInfo.mortgageDebt * 0.035; // 3.5% average rate
    deductions += mortgageInterest;
  }

  return deductions;
}