import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PersonalInfo, FinancialInfo } from '../types/TaxInfo';

interface TaxPlanningState {
  personalInfo: PersonalInfo | null;
  financialInfo: FinancialInfo | null;
  setPersonalInfo: (info: PersonalInfo) => void;
  setFinancialInfo: (info: FinancialInfo) => void;
  reset: () => void;
}

const initialPersonalInfo: PersonalInfo = {
  age: '',
  maritalStatus: 'single',
  canton: 'Zürich',
  municipality: '',
  hasChildren: false,
  numberOfChildren: 0,
  religion: 'none'
};

const initialFinancialInfo: FinancialInfo = {
  yearlyIncome: 0,
  wealthAmount: 0,
  mortgageDebt: 0,
  pensionContributions: 0,
  pillar3aContributions: 0,
  charitableDonations: 0,
  propertyOwnership: false,
  selfEmployed: false,
  currentTaxBurden: 0
};

export const useTaxPlanningStore = create<TaxPlanningState>()(
  persist(
    (set) => ({
      personalInfo: initialPersonalInfo,
      financialInfo: initialFinancialInfo,
      setPersonalInfo: (info) => set({ personalInfo: info }),
      setFinancialInfo: (info) => set({ financialInfo: info }),
      reset: () => set({
        personalInfo: initialPersonalInfo,
        financialInfo: initialFinancialInfo
      })
    }),
    {
      name: 'tax-planning-storage',
      partialize: (state) => ({
        personalInfo: state.personalInfo,
        financialInfo: state.financialInfo
      })
    }
  )
);