import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { AffiliateList } from './AffiliateList';
import { AffiliateForm } from './AffiliateForm';
import { useAffiliateStore } from '../../../stores/affiliateStore';

export function AffiliateManagement() {
  const { t } = useTranslation();
  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">{t('admin.affiliates.title')}</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('admin.affiliates.addNew')}
        </button>
      </div>

      {showForm ? (
        <AffiliateForm affiliateId={editingId} onClose={handleClose} />
      ) : (
        <AffiliateList onEdit={handleEdit} />
      )}
    </div>
  );
}