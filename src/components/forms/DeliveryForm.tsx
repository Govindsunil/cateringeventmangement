import React from 'react';
import { MapPin } from 'lucide-react';
import type { DeliveryInfo } from '../../types';

interface DeliveryFormProps {
  value: DeliveryInfo;
  onChange: (value: DeliveryInfo) => void;
}

export default function DeliveryForm({ value, onChange }: DeliveryFormProps) {
  const handleChange = (field: keyof DeliveryInfo, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Delivery Address *</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            required
            value={value.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Delivery Date *</label>
          <input
            type="date"
            required
            value={value.deliveryDate}
            onChange={(e) => handleChange('deliveryDate', e.target.value)}
            className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Delivery Time *</label>
          <input
            type="time"
            required
            value={value.deliveryTime}
            onChange={(e) => handleChange('deliveryTime', e.target.value)}
            className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Special Instructions</label>
        <textarea
          value={value.specialInstructions || ''}
          onChange={(e) => handleChange('specialInstructions', e.target.value)}
          rows={3}
          className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Any special delivery instructions..."
        />
      </div>
    </div>
  );
}