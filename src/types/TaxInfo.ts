export interface PersonalInfo {
  age: string | number;
  maritalStatus: 'single' | 'married' | 'registered_partnership' | 'divorced' | 'widowed';
  canton: string;
  municipality: string;
  hasChildren: boolean;
  numberOfChildren: number;
  religion: 'roman_catholic' | 'protestant' | 'other' | 'none';
  spouse?: {
    age: string | number;
    religion: 'roman_catholic' | 'protestant' | 'other' | 'none';
  };
}

export interface FinancialInfo {
  yearlyIncome: number;
  spouseYearlyIncome?: number;
  wealthAmount: number;
  spouseWealthAmount?: number;
  mortgageDebt: number;
  pensionContributions: number;
  spousePensionContributions?: number;
  pillar3aContributions: number;
  spousePillar3aContributions?: number;
  charitableDonations: number;
  propertyOwnership: boolean;
  selfEmployed: boolean;
  spouseSelfEmployed?: boolean;
  currentTaxBurden: number;
}