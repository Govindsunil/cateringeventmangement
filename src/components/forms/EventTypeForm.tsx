import React from 'react';
import { Users } from 'lucide-react';

interface EventTypeFormProps {
  eventType: string;
  guestCount: number;
  onEventTypeChange: (type: string) => void;
  onGuestCountChange: (count: number) => void;
}

export default function EventTypeForm({
  eventType,
  guestCount,
  onEventTypeChange,
  onGuestCountChange,
}: EventTypeFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Event Type *</label>
        <select
          value={eventType}
          onChange={(e) => onEventTypeChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        >
          <option value="">Select event type</option>
          <option value="wedding">Wedding</option>
          <option value="birthday">Birthday</option>
          <option value="corporate">Corporate</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Number of Guests *</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            min="1"
            value={guestCount}
            onChange={(e) => onGuestCountChange(Number(e.target.value))}
            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
      </div>
    </div>
  );
}