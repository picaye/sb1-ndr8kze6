import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ChevronDown, ChevronUp, Lightbulb, TrendingUp } from 'lucide-react';
import { useAffiliateStore } from '../stores/affiliateStore';

interface AIOptimizationCardProps {
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

export function AIOptimizationCard({
  id,
  title,
  description,
  impact,
  potentialSavings,
  confidence,
  steps,
  risks,
  requirements
}: AIOptimizationCardProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { affiliates, incrementClicks } = useAffiliateStore();

  const impactColors = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-gray-100 text-gray-800'
  };

  // Only show affiliates for Pillar 3a optimization
  const showAffiliates = id === 'pillar3a';
  const relevantAffiliates = showAffiliates ? affiliates : [];

  const handleAffiliateClick = (affiliateId: string, website: string) => {
    incrementClicks(affiliateId);
    window.open(website, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <span className={`px-2 py-1 rounded-full text-sm ${impactColors[impact]}`}>
            {t('optimizations.impact')}: {impact}
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {t('optimizations.confidence')}: {(confidence * 100).toFixed(0)}%
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            {t('optimizations.potentialSavings')}: CHF {potentialSavings.toLocaleString()}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <p className="text-gray-600 mb-4">{description}</p>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4" />
                {t('optimizations.steps')}
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>

            {risks && risks.length > 0 && (
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  {t('optimizations.risks')}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {risks.map((risk, index) => (
                    <li key={index}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}

            {requirements && requirements.length > 0 && (
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  {t('optimizations.requirements')}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {showAffiliates && relevantAffiliates.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-4">{t('optimizations.recommendedProviders')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relevantAffiliates.map((affiliate) => (
                    <div
                      key={affiliate.id}
                      onClick={() => handleAffiliateClick(affiliate.id, affiliate.website)}
                      className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <img
                        src={affiliate.logo}
                        alt={affiliate.name}
                        className="h-12 w-auto mb-2"
                      />
                      <h5 className="font-medium text-gray-900">{affiliate.name}</h5>
                      <p className="text-sm text-gray-500 text-center mt-1">
                        {affiliate.description}
                      </p>
                      <div className="mt-2 text-xs text-gray-600">
                        {t('optimizations.minInvestment')}: CHF {affiliate.minInvestment}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}