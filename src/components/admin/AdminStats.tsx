import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Calculator, TrendingUp, Clock } from 'lucide-react';

export function AdminStats() {
  const { t } = useTranslation();

  const stats = [
    {
      name: t('admin.stats.totalUsers'),
      value: '2,451',
      change: '+12.5%',
      icon: Users,
      trend: 'up'
    },
    {
      name: t('admin.stats.calculationsToday'),
      value: '154',
      change: '+21.2%',
      icon: Calculator,
      trend: 'up'
    },
    {
      name: t('admin.stats.averageSavings'),
      value: 'CHF 4,320',
      change: '+8.1%',
      icon: TrendingUp,
      trend: 'up'
    },
    {
      name: t('admin.stats.avgCalculationTime'),
      value: '2.4s',
      change: '-4.3%',
      icon: Clock,
      trend: 'down'
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">{t('admin.stats.title')}</h2>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="relative bg-white px-4 py-5 shadow rounded-lg overflow-hidden">
              <div className="absolute top-4 right-4">
                <Icon className="h-6 w-6 text-gray-400" />
              </div>
              <dt>
                <p className="text-sm font-medium text-gray-500 truncate">{stat.name}</p>
              </dt>
              <dd className="mt-1">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </p>
              </dd>
            </div>
          );
        })}
      </div>
    </div>
  );
}