import React from 'react';
import { Calculator } from 'lucide-react';
import { SwissCross } from './icons/SwissCross';

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Calculator className="w-4 h-4 text-white" />
        </div>
        <SwissCross className="w-8 h-8" color="#FF0000" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          steuerberatung<span className="text-red-600">.ch</span>
        </h1>
        <p className="text-xs text-gray-600 -mt-1">Swiss Tax Optimization</p>
      </div>
    </div>
  );
}