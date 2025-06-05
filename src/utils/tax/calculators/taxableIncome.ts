import { PersonalInfo, FinancialInfo } from '../../../types/TaxInfo';
import { TaxableIncomeResult } from '../types';
import { getTaxYearData, getLatestTaxYear, isTaxYearSupported } from '../constants/taxYears';

/**
 * Calculates taxable income based on personal and financial information for a specific tax year
 * 
 * @param personalInfo Personal information (canton, marital status, etc.)
 * @param financialInfo Financial information (income, deductions, etc.)
 * @param year The tax year to calculate for (defaults to latest supported year)
 * @returns Calculated taxable income with all deductions
 */
export function calculateTaxableIncome(
  personalInfo: PersonalInfo,
  financialInfo: FinancialInfo,
  year?: number
): TaxableIncomeResult {
  // Validate inputs
  if (!personalInfo || !financialInfo) {
    throw new Error('Personal and financial information are required');
  }
  
  if (!personalInfo.canton) {
    throw new Error('Canton is required for tax calculation');
  }
  
  // Determine tax year to use
  const taxYear = year || getLatestTaxYear();
  if (year && !isTaxYearSupported(taxYear)) {
    console.warn(`Tax year ${taxYear} not supported. Using latest available year.`);
  }
  
  // Get tax data for the specified year
  const taxData = getTaxYearData(taxYear);
  
  // Determine filing status
  const isJointFiling = personalInfo.maritalStatus === 'married' || 
                        personalInfo.maritalStatus === 'registered_partnership';

  // Calculate social security contributions (AHV/IV/EO/ALV)
  const socialContributions = financialInfo.yearlyIncome * 0.053;
  const spouseSocialContributions = isJointFiling && financialInfo.spouseYearlyIncome ? 
    financialInfo.spouseYearlyIncome * 0.053 : 0;

  // Calculate pension fund contributions (typical rate)
  const pensionContributions = Math.min(
    financialInfo.pensionContributions || 0,
    financialInfo.yearlyIncome * 0.25
  );
  const spousePensionContributions = isJointFiling && financialInfo.spouseYearlyIncome ? 
    Math.min(
      financialInfo.spousePensionContributions || 0,
      financialInfo.spouseYearlyIncome * 0.25
    ) : 0;

  // Calculate Pillar 3a deductions using year-specific limits
  const maxPillar3a = financialInfo.selfEmployed ? 
    taxData.pillar3aLimits.SELF_EMPLOYED : 
    taxData.pillar3aLimits.EMPLOYED;
  const pillar3a = Math.min(financialInfo.pillar3aContributions || 0, maxPillar3a);
  
  const spouseMaxPillar3a = isJointFiling && financialInfo.spouseSelfEmployed ?
    taxData.pillar3aLimits.SELF_EMPLOYED :
    taxData.pillar3aLimits.EMPLOYED;
  const spousePillar3a = isJointFiling ?
    Math.min(financialInfo.spousePillar3aContributions || 0, spouseMaxPillar3a) : 0;

  // Calculate professional expenses using year-specific limits
  const professionalExpenses = calculateProfessionalExpenses(financialInfo.yearlyIncome, taxData.professionalExpenses);
  const spouseProfessionalExpenses = isJointFiling && financialInfo.spouseYearlyIncome ?
    calculateProfessionalExpenses(financialInfo.spouseYearlyIncome, taxData.professionalExpenses) : 0;

  // Calculate insurance deductions using year-specific limits
  const insuranceDeductions = calculateInsuranceDeductions(personalInfo, taxData.insuranceDeductions);

  // Calculate child deductions using year-specific limits
  const childDeductions = calculateChildDeductions(personalInfo, taxData.childDeductions);

  // Calculate other deductions (charitable donations, mortgage interest, etc.)
  const otherDeductions = calculateOtherDeductions(financialInfo);

  // Calculate total deductions
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

  // Calculate total income
  const totalIncome = financialInfo.yearlyIncome + 
    (isJointFiling && financialInfo.spouseYearlyIncome ? financialInfo.spouseYearlyIncome : 0);

  // Calculate federal and cantonal taxable income
  // Note: In some cantons, these can differ due to canton-specific deductions
  const federalTaxableIncome = Math.max(0, totalIncome - totalDeductions);
  const cantonalTaxableIncome = Math.max(0, totalIncome - totalDeductions);

  return {
    federalTaxableIncome,
    cantonalTaxableIncome,
    isJointFiling,
    deductions: {
      social: socialContributions + spouseSocialContributions,
      pension: pensionContributions + spousePensionContributions,
      pillar3a: pillar3a + spousePillar3a,
      professional: professionalExpenses + spouseProfessionalExpenses,
      insurance: insuranceDeductions,
      children: childDeductions,
      other: otherDeductions,
      total: totalDeductions
    }
  };
}

/**
 * Calculates professional expenses based on income and year-specific limits
 * 
 * @param income Yearly income
 * @param expenseLimits Professional expense limits for the tax year
 * @returns Calculated professional expense deduction
 */
function calculateProfessionalExpenses(
  income: number,
  expenseLimits: {
    BASE_RATE: number;
    MIN_AMOUNT: number;
    MAX_AMOUNT: number;
    MEAL_ALLOWANCE: number;
    WORKING_DAYS: number;
    MAX_COMMUTE: number;
  }
): number {
  // Calculate base expenses (3% of income, min 2000, max 4000)
  const baseExpenses = Math.min(
    Math.max(income * expenseLimits.BASE_RATE, expenseLimits.MIN_AMOUNT),
    expenseLimits.MAX_AMOUNT
  );
  
  // Calculate meal expenses (typically 15 CHF per working day)
  const mealExpenses = expenseLimits.MEAL_ALLOWANCE * expenseLimits.WORKING_DAYS;
  
  // Calculate commute expenses (max 3000 CHF)
  const commuteExpenses = Math.min(expenseLimits.MAX_COMMUTE, income * 0.02);
  
  return baseExpenses + mealExpenses + commuteExpenses;
}

/**
 * Calculates insurance deductions based on personal information and year-specific limits
 * 
 * @param personalInfo Personal information including marital status and children
 * @param insuranceLimits Insurance deduction limits for the tax year
 * @returns Calculated insurance deduction
 */
function calculateInsuranceDeductions(
  personalInfo: PersonalInfo,
  insuranceLimits: {
    SINGLE: number;
    MARRIED: number;
    CHILD: number;
  }
): number {
  // Base deduction depends on marital status
  const baseDeduction = personalInfo.maritalStatus === 'married' || 
                       personalInfo.maritalStatus === 'registered_partnership' ? 
    insuranceLimits.MARRIED : 
    insuranceLimits.SINGLE;
  
  // Additional deduction for children
  const childDeduction = personalInfo.hasChildren && personalInfo.numberOfChildren > 0 ? 
    personalInfo.numberOfChildren * insuranceLimits.CHILD : 
    0;
  
  return baseDeduction + childDeduction;
}

/**
 * Calculates child deductions based on personal information and year-specific limits
 * 
 * @param personalInfo Personal information including canton and number of children
 * @param childDeductionLimits Child deduction limits by canton for the tax year
 * @returns Calculated child deduction
 */
function calculateChildDeductions(
  personalInfo: PersonalInfo,
  childDeductionLimits: { [canton: string]: number }
): number {
  // No children, no deductions
  if (!personalInfo.hasChildren || !personalInfo.numberOfChildren || personalInfo.numberOfChildren <= 0) {
    return 0;
  }
  
  // Get deduction per child for the canton
  const deductionPerChild = childDeductionLimits[personalInfo.canton] || 6500;
  
  // Calculate total child deductions
  return deductionPerChild * personalInfo.numberOfChildren;
}

/**
 * Calculates other deductions such as charitable donations and mortgage interest
 * 
 * @param financialInfo Financial information including donations and mortgage
 * @returns Calculated other deductions
 */
function calculateOtherDeductions(financialInfo: FinancialInfo): number {
  let deductions = 0;

  // Charitable donations (max 20% of income)
  if (financialInfo.charitableDonations && financialInfo.charitableDonations > 0) {
    const maxDonation = financialInfo.yearlyIncome * 0.2;
    deductions += Math.min(financialInfo.charitableDonations, maxDonation);
  }

  // Mortgage interest
  if (financialInfo.mortgageDebt && financialInfo.mortgageDebt > 0) {
    const mortgageInterest = financialInfo.mortgageDebt * 0.035; // 3.5% average rate
    deductions += mortgageInterest;
  }

  // Add any additional deductions from the financialInfo object
  if (financialInfo.additionalDeductions && financialInfo.additionalDeductions > 0) {
    deductions += financialInfo.additionalDeductions;
  }

  return deductions;
}
