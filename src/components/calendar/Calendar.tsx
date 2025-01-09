import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarEvent, Recipe, MenuItem } from '../../types';
import Modal from '../common/Modal';
import EventDetails from './EventDetails';

interface CalendarProps {
  events: CalendarEvent[];
  recipes: Recipe[];
  menuItems: MenuItem[];
  onEventEdit: (event: CalendarEvent) => void;
}

export default function Calendar({ events, recipes, menuItems, onEventEdit }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.deliveryInfo.deliveryDate);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + (direction === 'next' ? 1 : -1),
      1
    ));
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {blanks.map(blank => (
            <div key={`blank-${blank}`} className="bg-gray-50 p-2 h-32" />
          ))}
          {days.map(day => {
            const dayEvents = getEventsForDay(day);
            return (
              <div key={day} className="bg-white p-2 h-32 overflow-y-auto">
                <div className="font-medium text-sm mb-1">{day}</div>
                {dayEvents.map(event => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="w-full text-left mb-1 p-1 rounded text-xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <div className="font-medium truncate">
                      {event.customerInfo.fullName}
                    </div>
                    <div className="text-gray-500">
                      {event.deliveryInfo.deliveryTime}
                    </div>
                    <div className="text-gray-500">
                      {event.guestCount} guests
                    </div>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Event Details"
      >
        {selectedEvent && (
          <EventDetails 
            event={selectedEvent} 
            recipes={recipes}
            menuItems={menuItems}
            onEdit={(updatedEvent) => {
              onEventEdit(updatedEvent);
              setSelectedEvent(null);
            }}
          />
        )}
      </Modal>
    </>
  );
}