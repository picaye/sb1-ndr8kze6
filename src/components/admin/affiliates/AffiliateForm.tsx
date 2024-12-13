import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useAffiliateStore } from '../../../stores/affiliateStore';

interface Props {
  affiliateId: string | null;
  onClose: () => void;
}

export function AffiliateForm({ affiliateId, onClose }: Props) {
  const { t } = useTranslation();
  const { affiliates, addAffiliate, updateAffiliate } = useAffiliateStore();
  const affiliate = affiliateId ? affiliates.find(a => a.id === affiliateId) : null;

  const [formData, setFormData] = React.useState({
    name: affiliate?.name || '',
    website: affiliate?.website || '',
    logo: affiliate?.logo || '',
    commission: affiliate?.commission || 0,
    description: affiliate?.description || '',
    features: affiliate?.features || [],
    minInvestment: affiliate?.minInvestment || 0,
    maxInvestment: affiliate?.maxInvestment || 0,
    trackingCode: affiliate?.trackingCode || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (affiliateId) {
      updateAffiliate(affiliateId, formData);
    } else {
      addAffiliate({
        ...formData,
        id: Date.now().toString(),
        stats: { clicks: 0, conversions: 0 }
      });
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-medium">
          {affiliateId ? t('admin.affiliates.edit') : t('admin.affiliates.create')}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('admin.affiliates.form.name')}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('admin.affiliates.form.website')}
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('admin.affiliates.form.logo')}
            </label>
            <input
              type="url"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('admin.affiliates.form.commission')}
            </label>
            <input
              type="number"
              name="commission"
              value={formData.commission}
              onChange={handleChange}
              required
              min="0"
              max="100"
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('admin.affiliates.form.description')}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('admin.affiliates.form.minInvestment')}
            </label>
            <input
              type="number"
              name="minInvestment"
              value={formData.minInvestment}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('admin.affiliates.form.maxInvestment')}
            </label>
            <input
              type="number"
              name="maxInvestment"
              value={formData.maxInvestment}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('admin.affiliates.form.trackingCode')}
            </label>
            <input
              type="text"
              name="trackingCode"
              value={formData.trackingCode}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {t('common.save')}
          </button>
        </div>
      </form>
    </div>
  );
}