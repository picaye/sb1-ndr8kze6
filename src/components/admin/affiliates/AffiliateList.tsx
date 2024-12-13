import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import { useAffiliateStore } from '../../../stores/affiliateStore';

interface Props {
  onEdit: (id: string) => void;
}

export function AffiliateList({ onEdit }: Props) {
  const { t } = useTranslation();
  const { affiliates, removeAffiliate } = useAffiliateStore();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.affiliates.provider')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.affiliates.commission')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.affiliates.clicks')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.affiliates.conversions')}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.affiliates.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {affiliates.map((affiliate) => (
            <tr key={affiliate.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img
                    src={affiliate.logo}
                    alt={affiliate.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{affiliate.name}</div>
                    <div className="text-sm text-gray-500">{affiliate.website}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{affiliate.commission}%</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{affiliate.stats.clicks}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {affiliate.stats.conversions} ({(affiliate.stats.conversions / affiliate.stats.clicks * 100).toFixed(1)}%)
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => window.open(affiliate.website, '_blank')}
                  className="text-gray-600 hover:text-gray-900 mr-3"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(affiliate.id)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeAffiliate(affiliate.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}