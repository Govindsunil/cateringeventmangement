import React from 'react';
import type { CalendarEvent } from '../types';

interface CalendarProps {
  events: CalendarEvent[];
}

export default function Calendar({ events }: CalendarProps) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === currentMonth && 
             eventDate.getFullYear() === currentYear;
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">
        {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
      </h2>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {blanks.map(blank => (
          <div key={`blank-${blank}`} className="h-32 bg-gray-50 rounded"></div>
        ))}
        {days.map(day => {
          const dayEvents = getEventsForDay(day);
          return (
            <div key={day} className="h-32 border rounded p-2 overflow-y-auto">
              <div className="font-medium mb-1">{day}</div>
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  className="text-xs bg-indigo-100 text-indigo-800 rounded p-1 mb-1"
                >
                  <div className="font-medium">{event.title}</div>
                  <div>{event.time}</div>
                  <div>{event.guestCount} guests</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}