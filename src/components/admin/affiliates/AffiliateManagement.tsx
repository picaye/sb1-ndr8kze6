import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAffiliateStore, Affiliate } from '../../../stores/affiliateStore';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Pencil, Trash2, PlusCircle, EyeOff } from 'lucide-react';

const AVERAGE_CONVERSION_VALUE_CHF = 100; // Example value, should be configurable

type AffiliateFormData = Omit<Affiliate, 'id' | 'clicks' | 'conversions'>;

const INITIAL_FORM_DATA: AffiliateFormData = {
  name: '',
  website: '',
  commissionRate: 0,
  contactPerson: '',
  email: '',
  phone: '',
  notes: '',
  status: 'active',
};

const AffiliateManagement: React.FC = () => {
  const { t } = useTranslation();
  const affiliates = useAffiliateStore(state => state.affiliates);
  const addAffiliate = useAffiliateStore(state => state.addAffiliate);
  const updateAffiliate = useAffiliateStore(state => state.updateAffiliate);
  const removeAffiliate = useAffiliateStore(state => state.removeAffiliate);

  const [showForm, setShowForm] = useState(false);
  const [editingAffiliateId, setEditingAffiliateId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AffiliateFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (showForm) {
      if (editingAffiliateId) {
        const affiliateToEdit = affiliates.find(aff => aff.id === editingAffiliateId);
        if (affiliateToEdit) {
          const { id, clicks, conversions, ...editableData } = affiliateToEdit;
          setFormData(editableData);
        } else {
          // Affiliate not found, switch to add mode
          setEditingAffiliateId(null);
          setFormData(INITIAL_FORM_DATA);
        }
      } else {
        setFormData(INITIAL_FORM_DATA);
      }
    }
  }, [showForm, editingAffiliateId, affiliates]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'commissionRate' ? parseFloat(value) || 0 : value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value as 'active' | 'inactive' }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = t('validation.generic.required');
    if (!formData.website.trim()) {
      errors.website = t('validation.generic.required');
    } else if (!/^https?:\/\/.+/.test(formData.website)) {
      errors.website = t('validation.generic.invalidUrl', { defaultValue: 'Please enter a valid URL (e.g., http://example.com)' });
    }
    if (formData.commissionRate < 0 || formData.commissionRate > 100) {
      errors.commissionRate = t('validation.generic.numberRange', { min: 0, max: 100 });
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('validation.generic.invalidEmail', { defaultValue: 'Please enter a valid email address' });
    }
    if (!formData.status) errors.status = t('validation.generic.required');

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingAffiliateId) {
      updateAffiliate(editingAffiliateId, formData);
    } else {
      addAffiliate(formData);
    }
    setShowForm(false);
    setEditingAffiliateId(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
  };

  const handleAddNew = () => {
    setEditingAffiliateId(null);
    setFormData(INITIAL_FORM_DATA); // Reset form for new entry
    setShowForm(true);
  };

  const handleEdit = (affiliate: Affiliate) => {
    setEditingAffiliateId(affiliate.id);
    const { id, clicks, conversions, ...editableData } = affiliate;
    setFormData(editableData);
    setShowForm(true);
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setEditingAffiliateId(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('admin.affiliates.confirmDelete'))) {
      removeAffiliate(id);
    }
  };

  const getConversionRate = (clicks: number, conversions: number): number => {
    if (clicks === 0) return 0;
    return parseFloat(((conversions / clicks) * 100).toFixed(2));
  };

  const getTotalCommission = (conversions: number, commissionRate: number): number => {
    return parseFloat((conversions * (commissionRate / 100) * AVERAGE_CONVERSION_VALUE_CHF).toFixed(2));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.affiliates.title')}</CardTitle>
          <CardDescription>{t('admin.affiliates.description', {defaultValue: 'Manage your affiliate partners and track their performance.'})}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => showForm ? handleCancel() : handleAddNew()} variant="outline" className="mb-4">
            {showForm ? <EyeOff className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            {showForm ? t('common.hideForm', {defaultValue: 'Hide Form'}) : t('admin.affiliates.addNew')}
          </Button>

          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingAffiliateId ? t('admin.affiliates.editAffiliate') : t('admin.affiliates.addNew')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{t('admin.affiliates.name')}</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                      {formErrors.name && <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="website">{t('admin.affiliates.website')}</Label>
                      <Input id="website" name="website" value={formData.website} onChange={handleInputChange} />
                      {formErrors.website && <p className="text-sm text-red-500 mt-1">{formErrors.website}</p>}
                    </div>
                    <div>
                      <Label htmlFor="commissionRate">{t('admin.affiliates.commission')}</Label>
                      <Input id="commissionRate" name="commissionRate" type="number" value={formData.commissionRate} onChange={handleInputChange} step="0.1" min="0" max="100" />
                      {formErrors.commissionRate && <p className="text-sm text-red-500 mt-1">{formErrors.commissionRate}</p>}
                    </div>
                    <div>
                      <Label htmlFor="contactPerson">{t('admin.affiliates.contact')}</Label>
                      <Input id="contactPerson" name="contactPerson" value={formData.contactPerson || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                      <Label htmlFor="email">{t('admin.affiliates.email')}</Label>
                      <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleInputChange} />
                      {formErrors.email && <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone">{t('admin.affiliates.phone')}</Label>
                      <Input id="phone" name="phone" value={formData.phone || ''} onChange={handleInputChange} />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="notes">{t('admin.affiliates.notes')}</Label>
                      <Textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                      <Label htmlFor="status">{t('admin.affiliates.status')}</Label>
                      <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('admin.affiliates.selectStatus', {defaultValue: 'Select status'})} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">{t('admin.affiliates.active')}</SelectItem>
                          <SelectItem value="inactive">{t('admin.affiliates.inactive')}</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.status && <p className="text-sm text-red-500 mt-1">{formErrors.status}</p>}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>{t('common.cancel')}</Button>
                    <Button type="submit">{editingAffiliateId ? t('common.saveChanges', {defaultValue: 'Save Changes'}) : t('common.save')}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.affiliates.listTitle', {defaultValue: 'Affiliate List'})}</CardTitle>
        </CardHeader>
        <CardContent>
          {affiliates.length === 0 ? (
            <p>{t('admin.affiliates.noAffiliates')}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.affiliates.name')}</TableHead>
                    <TableHead>{t('admin.affiliates.website')}</TableHead>
                    <TableHead className="text-right">{t('admin.affiliates.commission')}</TableHead>
                    <TableHead>{t('admin.affiliates.status')}</TableHead>
                    <TableHead className="text-right">{t('admin.affiliates.clicks')}</TableHead>
                    <TableHead className="text-right">{t('admin.affiliates.conversions')}</TableHead>
                    <TableHead className="text-right">{t('admin.affiliates.conversionRate')}</TableHead>
                    <TableHead className="text-right">{t('admin.affiliates.totalCommission')}</TableHead>
                    <TableHead>{t('admin.affiliates.contact')}</TableHead>
                    <TableHead>{t('admin.affiliates.email')}</TableHead>
                    <TableHead>{t('admin.affiliates.actions', {defaultValue: 'Actions'})}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliates.map(affiliate => (
                    <TableRow key={affiliate.id}>
                      <TableCell className="font-medium">{affiliate.name}</TableCell>
                      <TableCell><a href={affiliate.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{affiliate.website}</a></TableCell>
                      <TableCell className="text-right">{affiliate.commissionRate}%</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          affiliate.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {affiliate.status === 'active' ? t('admin.affiliates.active') : t('admin.affiliates.inactive')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{affiliate.clicks}</TableCell>
                      <TableCell className="text-right">{affiliate.conversions}</TableCell>
                      <TableCell className="text-right">{getConversionRate(affiliate.clicks, affiliate.conversions)}%</TableCell>
                      <TableCell className="text-right">{getTotalCommission(affiliate.conversions, affiliate.commissionRate).toLocaleString(undefined, {style:'currency', currency:'CHF'})}</TableCell>
                      <TableCell>{affiliate.contactPerson || '-'}</TableCell>
                      <TableCell>{affiliate.email || '-'}</TableCell>
                      <TableCell className="space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(affiliate)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(affiliate.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateManagement;
