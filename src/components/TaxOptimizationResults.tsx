import React from 'react';
import { useTranslation } from 'react-i18next';
import { PersonalInfo, FinancialInfo } from '../types/TaxInfo';
import { generateAIOptimizations } from '../utils/aiTaxOptimizer';
import { AIOptimizationCard } from './AIOptimizationCard';
import { TaxBreakdown } from './TaxBreakdown';
import { useTaxPlanningStore } from '../stores/taxPlanningStore';
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react';

export function TaxOptimizationResults() {
  const { t } = useTranslation();
  const personalInfo = useTaxPlanningStore((state) => state.personalInfo);
  const financialInfo = useTaxPlanningStore((state) => state.financialInfo);

  if (!personalInfo || !financialInfo) return null;

  const aiOptimizations = generateAIOptimizations(personalInfo, financialInfo);
  const totalPotentialSavings = aiOptimizations.reduce(
    (sum, opt) => sum + opt.potentialSavings,
    0
  );

  return (
    <div className="space-y-8">
      <TaxBreakdown />

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-8 h-8" />
          <h2 className="text-2xl font-bold">{t('optimizations.aiTitle')}</h2>
        </div>
        <p className="text-blue-100 mb-4">{t('optimizations.aiDescription')}</p>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <span className="text-lg">
            {t('optimizations.totalPotentialSavings')}:{' '}
            <strong>CHF {totalPotentialSavings.toLocaleString()}</strong>
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {aiOptimizations.map((optimization) => (
          <AIOptimizationCard
            key={optimization.id}
            {...optimization}
          />
        ))}
      </div>

      {/* Legal Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              {t('optimizations.legalDisclaimer.title')}
            </h3>
            <p className="text-yellow-700 text-sm">
              {t('optimizations.legalDisclaimer.text')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}