import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useTaxPlanningStore } from '../stores/taxPlanningStore';
import { calculateTaxBreakdown } from '../utils/taxCalculator';
import { getCantonalBaseRate, getMunicipalMultiplier } from '../utils/taxCalculator';

export function TaxBreakdown() {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const personalInfo = useTaxPlanningStore((state) => state.personalInfo);
  const financialInfo = useTaxPlanningStore((state) => state.financialInfo);

  if (!personalInfo || !financialInfo) return null;

  const breakdown = calculateTaxBreakdown(personalInfo, financialInfo);
  const cantonalRate = getCantonalBaseRate(personalInfo.canton);
  const municipalMultiplier = getMunicipalMultiplier(personalInfo.canton, personalInfo.municipality);
  const churchRate = personalInfo.religion === 'roman_catholic' || personalInfo.religion === 'protestant' ? 0.08 : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">{t('taxBreakdown.title')}</h3>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>

        <div className="mt-2">
          <div className="text-2xl font-bold text-gray-900">
            CHF {breakdown.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-sm text-gray-500">
            {t('taxBreakdown.effectiveRate')}: {breakdown.effectiveRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200 space-y-6">
          {/* Tax Rates Section */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              {t('taxBreakdown.appliedRates')}
              <Info className="w-4 h-4 text-gray-400" />
            </h4>
            <div className="space-y-2 text-sm bg-gray-50 p-3 rounded-lg">
              <div>
                <div className="text-gray-600 mb-1">{t('taxBreakdown.canton')}: {personalInfo.canton}</div>
                <div className="flex justify-between">
                  <span>{t('taxBreakdown.baseRate')}:</span>
                  <span>{(cantonalRate * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">{t('taxBreakdown.municipality')}: {personalInfo.municipality}</div>
                <div className="flex justify-between">
                  <span>{t('taxBreakdown.multiplier')}:</span>
                  <span>{(municipalMultiplier * 100).toFixed(1)}%</span>
                </div>
              </div>
              {churchRate > 0 && (
                <div>
                  <div className="text-gray-600 mb-1">{t('taxBreakdown.churchTax')}</div>
                  <div className="flex justify-between">
                    <span>{t('taxBreakdown.rate')}:</span>
                    <span>{(churchRate * 100).toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Deductions Section */}
          <div>
            <h4 className="font-medium mb-2">{t('taxBreakdown.deductions')}</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>{t('taxBreakdown.baseAmount')}:</span>
                <span className="font-medium">CHF {breakdown.details.baseAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('taxBreakdown.pillar3a')}:</span>
                <span>- CHF {breakdown.details.deductions.pillar3a.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('taxBreakdown.childDeductions')}:</span>
                <span>- CHF {breakdown.details.deductions.childDeductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('taxBreakdown.professionalExpenses')}:</span>
                <span>- CHF {breakdown.details.deductions.professionalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('taxBreakdown.otherDeductions')}:</span>
                <span>- CHF {breakdown.details.deductions.otherDeductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium pt-1 border-t">
                <span>{t('taxBreakdown.taxableIncome')}:</span>
                <span>CHF {breakdown.details.taxableIncome.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Tax Breakdown Section */}
          <div>
            <h4 className="font-medium mb-2">{t('taxBreakdown.taxesByType')}</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>{t('taxBreakdown.federal')}:</span>
                <span>CHF {breakdown.federal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('taxBreakdown.cantonal')}:</span>
                <span>CHF {breakdown.cantonal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('taxBreakdown.municipal')}:</span>
                <span>CHF {breakdown.municipal.toLocaleString()}</span>
              </div>
              {breakdown.church && (
                <div className="flex justify-between">
                  <span>{t('taxBreakdown.church')}:</span>
                  <span>CHF {breakdown.church.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-medium pt-1 border-t">
                <span>{t('taxBreakdown.total')}:</span>
                <span>CHF {breakdown.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}