import { calculateTaxes } from '../calculators/taxCalculator';
import { calculateFederalTax } from '../calculators/federalTax';
import { calculateCantonalTax } from '../calculators/cantonalTax';
import { calculateTaxableIncome } from '../calculators/taxableIncome';
import { PersonalInfo, FinancialInfo } from '../../../types/TaxInfo';
import { TAX_YEAR_2024, TAX_YEAR_2025 } from '../constants/taxYears';
import { getMunicipalityTaxMultiplier } from '../../../data/municipalities/comprehensive';

describe('Swiss Tax Calculator', () => {
  // Base test data
  const basePersonalInfo: PersonalInfo = {
    age: 35,
    maritalStatus: 'single',
    canton: 'Zürich',
    municipality: 'Zürich',
    hasChildren: false,
    numberOfChildren: 0,
    religion: 'none'
  };

  const baseFinancialInfo: FinancialInfo = {
    yearlyIncome: 100000,
    wealthAmount: 50000,
    mortgageDebt: 0,
    pensionContributions: 7000,
    pillar3aContributions: 6883,
    charitableDonations: 1000,
    propertyOwnership: false,
    selfEmployed: false,
    currentTaxBurden: 0,
    totalWealth: 50000,
    totalLiabilities: 0
  };

  describe('Federal Tax Calculation', () => {
    test('should calculate correct federal tax for single person with low income', () => {
      const taxableIncome = 30000;
      const tax = calculateFederalTax(taxableIncome, 'single', 2024);
      // Based on 2024 brackets: 0.77% rate for income between 15000-32800
      const expectedTax = (30000 - 15000) * 0.0077;
      expect(tax).toBeCloseTo(expectedTax, 2);
    });

    test('should calculate correct federal tax for single person with medium income', () => {
      const taxableIncome = 85000;
      const tax = calculateFederalTax(taxableIncome, 'single', 2024);
      // Complex calculation with multiple brackets
      expect(tax).toBeGreaterThan(0);
      // Verify using the base amount + rate calculation for the bracket
      const bracket = TAX_YEAR_2024.federalTaxBrackets.single.find(b => taxableIncome <= b.limit);
      const prevBracket = TAX_YEAR_2024.federalTaxBrackets.single[TAX_YEAR_2024.federalTaxBrackets.single.indexOf(bracket!) - 1];
      const expectedTax = bracket!.baseAmount + ((taxableIncome - prevBracket.limit) * (bracket!.rate / 100));
      expect(tax).toBeCloseTo(expectedTax, 2);
    });

    test('should calculate correct federal tax for high income', () => {
      const taxableIncome = 500000;
      const tax = calculateFederalTax(taxableIncome, 'single', 2024);
      // For high incomes, should be in the second-highest bracket
      expect(tax).toBeGreaterThan(50000);
      // Verify using the base amount + rate calculation for the bracket
      const bracket = TAX_YEAR_2024.federalTaxBrackets.single.find(b => taxableIncome <= b.limit);
      const prevBracket = TAX_YEAR_2024.federalTaxBrackets.single[TAX_YEAR_2024.federalTaxBrackets.single.indexOf(bracket!) - 1];
      const expectedTax = bracket!.baseAmount + ((taxableIncome - prevBracket.limit) * (bracket!.rate / 100));
      expect(tax).toBeCloseTo(expectedTax, 2);
    });

    test('should calculate correct federal tax for married couple', () => {
      const taxableIncome = 120000;
      const tax = calculateFederalTax(taxableIncome, 'married', 2024);
      // Married couples have different brackets
      expect(tax).toBeLessThan(calculateFederalTax(taxableIncome, 'single', 2024));
      // Verify using the married brackets
      const bracket = TAX_YEAR_2024.federalTaxBrackets.married.find(b => taxableIncome <= b.limit);
      const prevBracket = TAX_YEAR_2024.federalTaxBrackets.married[TAX_YEAR_2024.federalTaxBrackets.married.indexOf(bracket!) - 1];
      const expectedTax = bracket!.baseAmount + ((taxableIncome - prevBracket.limit) * (bracket!.rate / 100));
      expect(tax).toBeCloseTo(expectedTax, 2);
    });

    test('should handle zero income correctly', () => {
      const tax = calculateFederalTax(0, 'single', 2024);
      expect(tax).toBe(0);
    });

    test('should handle income at bracket boundaries correctly', () => {
      // Test exact bracket boundary
      const taxableIncome = 32800; // Boundary between first and second bracket for single
      const tax = calculateFederalTax(taxableIncome, 'single', 2024);
      const expectedTax = 137.35; // Base amount for the next bracket
      expect(tax).toBeCloseTo(expectedTax, 2);
    });
  });

  describe('Cantonal Tax Calculation', () => {
    test('should calculate correct cantonal tax for Zürich', () => {
      const taxableIncome = 100000;
      const tax = calculateCantonalTax(taxableIncome, 'Zürich', 2024);
      // Zürich has a base rate of 0.082 (8.2%)
      expect(tax).toBeGreaterThan(0);
      // The actual calculation is more complex due to progressive scaling
      expect(tax).toBeLessThan(taxableIncome * 0.15); // Sanity check
    });

    test('should calculate correct cantonal tax for Geneva', () => {
      const taxableIncome = 100000;
      const tax = calculateCantonalTax(taxableIncome, 'Geneva', 2024);
      // Geneva has a base rate of 0.115 (11.5%)
      expect(tax).toBeGreaterThan(0);
      expect(tax).toBeGreaterThan(calculateCantonalTax(taxableIncome, 'Zug', 2024));
    });

    test('should calculate correct cantonal tax for Zug (low tax canton)', () => {
      const taxableIncome = 100000;
      const tax = calculateCantonalTax(taxableIncome, 'Zug', 2024);
      // Zug has a base rate of 0.052 (5.2%)
      expect(tax).toBeGreaterThan(0);
      expect(tax).toBeLessThan(calculateCantonalTax(taxableIncome, 'Zürich', 2024));
    });

    test('should handle unknown canton correctly', () => {
      const taxableIncome = 100000;
      // Use a non-existent canton name
      const tax = calculateCantonalTax(taxableIncome, 'NonExistentCanton', 2024);
      // Should fall back to default calculation
      expect(tax).toBeGreaterThan(0);
    });
  });

  describe('Municipal Tax Calculation', () => {
    test('should apply correct municipal multiplier for Zürich', () => {
      const personalInfo = { ...basePersonalInfo, municipality: 'Zürich' };
      const financialInfo = { ...baseFinancialInfo };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      // Zürich has a multiplier of 1.19
      const expectedMultiplier = getMunicipalityTaxMultiplier('Zürich', 'Zürich', '2024');
      expect(result.municipal).toBeCloseTo(result.cantonal * expectedMultiplier, 2);
    });

    test('should apply correct municipal multiplier for Zollikon (low tax municipality in Zürich)', () => {
      const personalInfo = { ...basePersonalInfo, municipality: 'Zollikon' };
      const financialInfo = { ...baseFinancialInfo };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      // Zollikon has a lower multiplier than Zürich
      const expectedMultiplier = getMunicipalityTaxMultiplier('Zollikon', 'Zürich', '2024');
      expect(result.municipal).toBeCloseTo(result.cantonal * expectedMultiplier, 2);
      expect(result.municipal).toBeLessThan(result.cantonal * getMunicipalityTaxMultiplier('Zürich', 'Zürich', '2024'));
    });

    test('should fall back to canton default multiplier for unknown municipality', () => {
      const personalInfo = { ...basePersonalInfo, municipality: 'UnknownMunicipality' };
      const financialInfo = { ...baseFinancialInfo };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      // Should use the default multiplier for Zürich canton
      expect(result.municipal).toBeGreaterThan(0);
    });
  });

  describe('Wealth Tax Calculation', () => {
    test('should calculate wealth tax when above threshold', () => {
      const personalInfo = { ...basePersonalInfo };
      const financialInfo = { 
        ...baseFinancialInfo,
        totalWealth: 500000,
        totalLiabilities: 100000
      };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      // Should have wealth tax
      expect(result.wealth).toBeDefined();
      expect(result.wealth!.total).toBeGreaterThan(0);
    });

    test('should not calculate wealth tax when below threshold', () => {
      const personalInfo = { ...basePersonalInfo };
      const financialInfo = { 
        ...baseFinancialInfo,
        totalWealth: 100000,
        totalLiabilities: 50000
      };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      // Net wealth is below Zürich's threshold (77,000)
      if (result.wealth) {
        expect(result.wealth.total).toBe(0);
      }
    });

    test('should calculate different wealth tax rates by canton', () => {
      const zurichInfo = { ...basePersonalInfo, canton: 'Zürich' };
      const genevaInfo = { ...basePersonalInfo, canton: 'Geneva' };
      const financialInfo = { 
        ...baseFinancialInfo,
        totalWealth: 1000000,
        totalLiabilities: 0
      };
      
      const zurichResult = calculateTaxes(zurichInfo, financialInfo, 2024);
      const genevaResult = calculateTaxes(genevaInfo, financialInfo, 2024);
      
      // Geneva has higher wealth tax rate than Zürich
      expect(genevaResult.wealth!.cantonal).toBeGreaterThan(zurichResult.wealth!.cantonal);
    });
  });

  describe('Church Tax Calculation', () => {
    test('should calculate church tax for Roman Catholic', () => {
      const personalInfo = { 
        ...basePersonalInfo,
        religion: 'roman_catholic'
      };
      const financialInfo = { ...baseFinancialInfo };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      // Should have church tax
      expect(result.church).toBeDefined();
      expect(result.church!.total).toBeGreaterThan(0);
    });

    test('should calculate church tax for Protestant', () => {
      const personalInfo = { 
        ...basePersonalInfo,
        religion: 'protestant'
      };
      const financialInfo = { ...baseFinancialInfo };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      // Should have church tax
      expect(result.church).toBeDefined();
      expect(result.church!.total).toBeGreaterThan(0);
    });

    test('should not calculate church tax for non-religious person', () => {
      const personalInfo = { 
        ...basePersonalInfo,
        religion: 'none'
      };
      const financialInfo = { ...baseFinancialInfo };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      // Should have zero church tax
      expect(result.church!.total).toBe(0);
    });

    test('should calculate church tax for married couple with different religions', () => {
      const personalInfo = { 
        ...basePersonalInfo,
        maritalStatus: 'married',
        religion: 'roman_catholic',
        spouse: {
          age: 35,
          religion: 'protestant'
        }
      };
      const financialInfo = { 
        ...baseFinancialInfo,
        spouseYearlyIncome: 80000
      };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      // Both spouses should pay church tax
      expect(result.church).toBeDefined();
      expect(result.church!.person1).toBeDefined();
      expect(result.church!.person2).toBeDefined();
      expect(result.church!.total).toBeGreaterThan(0);
    });

    test('should not calculate church tax in cantons without church tax', () => {
      const personalInfo = { 
        ...basePersonalInfo,
        canton: 'Geneva', // Geneva has no church tax
        religion: 'roman_catholic'
      };
      const financialInfo = { ...baseFinancialInfo };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      // Should have zero church tax
      expect(result.church!.total).toBe(0);
    });
  });

  describe('Withholding Tax Calculation', () => {
    test('should calculate withholding tax for eligible person', () => {
      const personalInfo = { 
        ...basePersonalInfo,
        isWithholdingTaxEligible: true
      };
      const financialInfo = { ...baseFinancialInfo };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      // Should have withholding tax
      expect(result.withholding).toBeDefined();
      expect(result.withholding!.amount).toBeGreaterThan(0);
    });

    test('should adjust withholding tax rate for married person', () => {
      const singleInfo = { 
        ...basePersonalInfo,
        isWithholdingTaxEligible: true
      };
      const marriedInfo = { 
        ...basePersonalInfo,
        maritalStatus: 'married',
        isWithholdingTaxEligible: true,
        spouse: {
          age: 35,
          religion: 'none'
        }
      };
      const financialInfo = { ...baseFinancialInfo };
      
      const singleResult = calculateTaxes(singleInfo, financialInfo, 2024);
      const marriedResult = calculateTaxes(marriedInfo, financialInfo, 2024);
      
      // Married person should have lower withholding tax rate
      expect(marriedResult.withholding!.rate).toBeLessThan(singleResult.withholding!.rate);
    });

    test('should adjust withholding tax rate for person with children', () => {
      const noChildrenInfo = { 
        ...basePersonalInfo,
        isWithholdingTaxEligible: true
      };
      const withChildrenInfo = { 
        ...basePersonalInfo,
        isWithholdingTaxEligible: true,
        hasChildren: true,
        numberOfChildren: 2
      };
      const financialInfo = { ...baseFinancialInfo };
      
      const noChildrenResult = calculateTaxes(noChildrenInfo, financialInfo, 2024);
      const withChildrenResult = calculateTaxes(withChildrenInfo, financialInfo, 2024);
      
      // Person with children should have lower withholding tax rate
      expect(withChildrenResult.withholding!.rate).toBeLessThan(noChildrenResult.withholding!.rate);
    });

    test('should use withholding tax if lower than regular tax', () => {
      const personalInfo = { 
        ...basePersonalInfo,
        isWithholdingTaxEligible: true
      };
      // Lower income makes withholding tax potentially more favorable
      const financialInfo = { 
        ...baseFinancialInfo,
        yearlyIncome: 60000
      };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      // If withholding tax is lower, it should be used for the total
      if (result.withholding!.amount < (result.federal + result.cantonal + result.municipal)) {
        expect(result.total).toBeCloseTo(result.withholding!.amount, 2);
      }
    });
  });

  describe('Multi-Year Support', () => {
    test('should calculate taxes for 2024', () => {
      const personalInfo = { ...basePersonalInfo };
      const financialInfo = { ...baseFinancialInfo };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      expect(result.taxYear).toBe(2024);
    });

    test('should calculate taxes for 2025', () => {
      const personalInfo = { ...basePersonalInfo };
      const financialInfo = { ...baseFinancialInfo };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2025);
      
      expect(result.taxYear).toBe(2025);
    });

    test('should use different tax brackets for different years', () => {
      const personalInfo = { ...basePersonalInfo };
      const financialInfo = { ...baseFinancialInfo };
      
      const result2024 = calculateTaxes(personalInfo, financialInfo, 2024);
      const result2025 = calculateTaxes(personalInfo, financialInfo, 2025);
      
      // Due to inflation adjustments, 2025 brackets are slightly higher
      // This might result in slightly lower taxes for the same income
      expect(result2024.federal).not.toEqual(result2025.federal);
    });

    test('should use different deduction limits for different years', () => {
      const personalInfo = { ...basePersonalInfo };
      const financialInfo = { 
        ...baseFinancialInfo,
        pillar3aContributions: 7200 // Higher than 2024 limit but within 2025 limit
      };
      
      const result2024 = calculateTaxableIncome(personalInfo, financialInfo, 2024);
      const result2025 = calculateTaxableIncome(personalInfo, financialInfo, 2025);
      
      // 2024 should cap at the lower limit
      expect(result2024.deductions.pillar3a).toBeLessThan(result2025.deductions.pillar3a);
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    test('should handle zero income correctly', () => {
      const personalInfo = { ...basePersonalInfo };
      const financialInfo = { 
        ...baseFinancialInfo,
        yearlyIncome: 0
      };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      expect(result.federal).toBe(0);
      expect(result.cantonal).toBe(0);
      expect(result.municipal).toBe(0);
      expect(result.total).toBe(0);
    });

    test('should handle income below tax-free threshold correctly', () => {
      const personalInfo = { ...basePersonalInfo };
      const financialInfo = { 
        ...baseFinancialInfo,
        yearlyIncome: 10000 // Below federal tax-free threshold
      };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      expect(result.federal).toBe(0);
    });

    test('should handle extremely high income correctly', () => {
      const personalInfo = { ...basePersonalInfo };
      const financialInfo = { 
        ...baseFinancialInfo,
        yearlyIncome: 10000000
      };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      expect(result.federal).toBeGreaterThan(0);
      expect(result.cantonal).toBeGreaterThan(0);
      expect(result.municipal).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);
      expect(result.effectiveRate).toBeGreaterThan(0);
      expect(result.effectiveRate).toBeLessThan(50); // Sanity check, no Swiss tax should be >50%
    });

    test('should handle missing canton correctly', () => {
      const personalInfo = { 
        ...basePersonalInfo,
        canton: ''
      };
      const financialInfo = { ...baseFinancialInfo };
      
      expect(() => calculateTaxes(personalInfo, financialInfo, 2024)).toThrow();
    });
  });

  describe('Deduction Calculations', () => {
    test('should calculate Pillar 3a deductions correctly', () => {
      const personalInfo = { ...basePersonalInfo };
      const financialInfo = { 
        ...baseFinancialInfo,
        pillar3aContributions: 6883 // 2024 limit for employed
      };
      
      const result = calculateTaxableIncome(personalInfo, financialInfo, 2024);
      
      expect(result.deductions.pillar3a).toBe(6883);
    });

    test('should cap Pillar 3a deductions at yearly limit', () => {
      const personalInfo = { ...basePersonalInfo };
      const financialInfo = { 
        ...baseFinancialInfo,
        pillar3aContributions: 10000 // Above 2024 limit
      };
      
      const result = calculateTaxableIncome(personalInfo, financialInfo, 2024);
      
      expect(result.deductions.pillar3a).toBe(TAX_YEAR_2024.pillar3aLimits.EMPLOYED);
    });

    test('should calculate higher Pillar 3a limit for self-employed', () => {
      const personalInfo = { ...basePersonalInfo };
      const financialInfo = { 
        ...baseFinancialInfo,
        selfEmployed: true,
        pillar3aContributions: 30000
      };
      
      const result = calculateTaxableIncome(personalInfo, financialInfo, 2024);
      
      expect(result.deductions.pillar3a).toBe(TAX_YEAR_2024.pillar3aLimits.SELF_EMPLOYED);
    });

    test('should calculate professional expenses correctly', () => {
      const personalInfo = { ...basePersonalInfo };
      const financialInfo = { 
        ...baseFinancialInfo,
        yearlyIncome: 100000
      };
      
      const result = calculateTaxableIncome(personalInfo, financialInfo, 2024);
      
      // Professional expenses include base amount, meal allowance, and commute
      expect(result.deductions.professional).toBeGreaterThan(TAX_YEAR_2024.professionalExpenses.MIN_AMOUNT);
    });

    test('should calculate child deductions correctly', () => {
      const personalInfo = { 
        ...basePersonalInfo,
        hasChildren: true,
        numberOfChildren: 2
      };
      const financialInfo = { ...baseFinancialInfo };
      
      const result = calculateTaxableIncome(personalInfo, financialInfo, 2024);
      
      // Child deduction should be the per-child amount times number of children
      expect(result.deductions.children).toBe(TAX_YEAR_2024.childDeductions['Zürich'] * 2);
    });

    test('should calculate insurance deductions correctly', () => {
      const singleInfo = { ...basePersonalInfo };
      const marriedInfo = { 
        ...basePersonalInfo,
        maritalStatus: 'married',
        spouse: {
          age: 35,
          religion: 'none'
        }
      };
      const marriedWithChildrenInfo = { 
        ...basePersonalInfo,
        maritalStatus: 'married',
        hasChildren: true,
        numberOfChildren: 2,
        spouse: {
          age: 35,
          religion: 'none'
        }
      };
      const financialInfo = { ...baseFinancialInfo };
      
      const singleResult = calculateTaxableIncome(singleInfo, financialInfo, 2024);
      const marriedResult = calculateTaxableIncome(marriedInfo, financialInfo, 2024);
      const marriedWithChildrenResult = calculateTaxableIncome(marriedWithChildrenInfo, financialInfo, 2024);
      
      // Single person gets base deduction
      expect(singleResult.deductions.insurance).toBe(TAX_YEAR_2024.insuranceDeductions.SINGLE);
      
      // Married couple gets higher deduction
      expect(marriedResult.deductions.insurance).toBe(TAX_YEAR_2024.insuranceDeductions.MARRIED);
      
      // Married with children gets additional child deductions
      expect(marriedWithChildrenResult.deductions.insurance).toBe(
        TAX_YEAR_2024.insuranceDeductions.MARRIED + 
        (TAX_YEAR_2024.insuranceDeductions.CHILD * 2)
      );
    });

    test('should calculate other deductions correctly', () => {
      const personalInfo = { ...basePersonalInfo };
      const financialInfo = { 
        ...baseFinancialInfo,
        charitableDonations: 5000,
        mortgageDebt: 500000
      };
      
      const result = calculateTaxableIncome(personalInfo, financialInfo, 2024);
      
      // Other deductions include charitable donations and mortgage interest
      expect(result.deductions.other).toBeGreaterThan(5000);
    });
  });

  describe('Integration Tests', () => {
    test('should calculate complete tax scenario for single person in Zürich', () => {
      const personalInfo: PersonalInfo = {
        age: 35,
        maritalStatus: 'single',
        canton: 'Zürich',
        municipality: 'Zürich',
        hasChildren: false,
        numberOfChildren: 0,
        religion: 'none'
      };
      
      const financialInfo: FinancialInfo = {
        yearlyIncome: 120000,
        wealthAmount: 200000,
        mortgageDebt: 0,
        pensionContributions: 8400,
        pillar3aContributions: 6883,
        charitableDonations: 2000,
        propertyOwnership: false,
        selfEmployed: false,
        currentTaxBurden: 0,
        totalWealth: 200000,
        totalLiabilities: 0
      };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      // Verify all components are calculated
      expect(result.federal).toBeGreaterThan(0);
      expect(result.cantonal).toBeGreaterThan(0);
      expect(result.municipal).toBeGreaterThan(0);
      expect(result.wealth).toBeDefined();
      expect(result.wealth!.total).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);
      
      // Verify total is sum of components
      expect(result.total).toBeCloseTo(
        result.federal + result.cantonal + result.municipal + result.wealth!.total,
        2
      );
      
      // Verify effective rate is reasonable
      expect(result.effectiveRate).toBeGreaterThan(10);
      expect(result.effectiveRate).toBeLessThan(30);
    });

    test('should calculate complete tax scenario for married couple with children in Geneva', () => {
      const personalInfo: PersonalInfo = {
        age: 40,
        maritalStatus: 'married',
        canton: 'Geneva',
        municipality: 'Geneva',
        hasChildren: true,
        numberOfChildren: 2,
        religion: 'roman_catholic',
        spouse: {
          age: 38,
          religion: 'protestant'
        }
      };
      
      const financialInfo: FinancialInfo = {
        yearlyIncome: 150000,
        spouseYearlyIncome: 80000,
        wealthAmount: 300000,
        spouseWealthAmount: 100000,
        mortgageDebt: 800000,
        pensionContributions: 10500,
        spousePensionContributions: 5600,
        pillar3aContributions: 6883,
        spousePillar3aContributions: 6883,
        charitableDonations: 3000,
        propertyOwnership: true,
        selfEmployed: false,
        spouseSelfEmployed: false,
        currentTaxBurden: 0,
        totalWealth: 400000,
        totalLiabilities: 800000
      };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      // Verify all components are calculated
      expect(result.federal).toBeGreaterThan(0);
      expect(result.cantonal).toBeGreaterThan(0);
      expect(result.municipal).toBeGreaterThan(0);
      
      // Geneva has no church tax
      expect(result.church!.total).toBe(0);
      
      // Wealth is below threshold after deducting liabilities
      if (result.wealth) {
        expect(result.wealth.total).toBe(0);
      }
      
      // Verify total is correct
      expect(result.total).toBeGreaterThan(0);
      
      // Verify effective rate is reasonable for joint filing
      expect(result.effectiveRate).toBeGreaterThan(5);
      expect(result.effectiveRate).toBeLessThan(25);
    });

    test('should calculate complete tax scenario for self-employed person in Zug', () => {
      const personalInfo: PersonalInfo = {
        age: 45,
        maritalStatus: 'single',
        canton: 'Zug',
        municipality: 'Zug',
        hasChildren: false,
        numberOfChildren: 0,
        religion: 'protestant'
      };
      
      const financialInfo: FinancialInfo = {
        yearlyIncome: 200000,
        wealthAmount: 1000000,
        mortgageDebt: 600000,
        pensionContributions: 0, // Self-employed often don't have 2nd pillar
        pillar3aContributions: 35280, // Higher limit for self-employed
        charitableDonations: 10000,
        propertyOwnership: true,
        selfEmployed: true,
        currentTaxBurden: 0,
        totalWealth: 1000000,
        totalLiabilities: 600000
      };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      // Verify all components are calculated
      expect(result.federal).toBeGreaterThan(0);
      expect(result.cantonal).toBeGreaterThan(0);
      expect(result.municipal).toBeGreaterThan(0);
      expect(result.church).toBeDefined();
      expect(result.church!.total).toBeGreaterThan(0);
      expect(result.wealth).toBeDefined();
      expect(result.wealth!.total).toBeGreaterThan(0);
      
      // Verify deductions include higher Pillar 3a limit
      expect(result.details.deductions.pillar3a).toBe(TAX_YEAR_2024.pillar3aLimits.SELF_EMPLOYED);
      
      // Verify total is correct
      expect(result.total).toBeGreaterThan(0);
      
      // Zug has low tax rates
      expect(result.effectiveRate).toBeLessThan(20);
    });

    test('should calculate complete tax scenario for withholding tax eligible person', () => {
      const personalInfo: PersonalInfo = {
        age: 30,
        maritalStatus: 'single',
        canton: 'Zürich',
        municipality: 'Zürich',
        hasChildren: false,
        numberOfChildren: 0,
        religion: 'none',
        isWithholdingTaxEligible: true
      };
      
      const financialInfo: FinancialInfo = {
        yearlyIncome: 80000,
        wealthAmount: 50000,
        mortgageDebt: 0,
        pensionContributions: 5600,
        pillar3aContributions: 0,
        charitableDonations: 0,
        propertyOwnership: false,
        selfEmployed: false,
        currentTaxBurden: 0,
        totalWealth: 50000,
        totalLiabilities: 0
      };
      
      const result = calculateTaxes(personalInfo, financialInfo, 2024);
      
      // Verify withholding tax is calculated
      expect(result.withholding).toBeDefined();
      expect(result.withholding!.amount).toBeGreaterThan(0);
      
      // Verify total uses the lower of regular tax or withholding tax
      const regularTax = result.federal + result.cantonal + result.municipal;
      if (result.withholding!.amount < regularTax) {
        expect(result.total).toBeCloseTo(result.withholding!.amount, 2);
      } else {
        expect(result.total).toBeCloseTo(regularTax, 2);
      }
    });
  });
});
