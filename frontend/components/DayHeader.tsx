import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DayHeaderProps {
  date: string;
  isToday: boolean;
}

export default function DayHeader({ date, isToday }: DayHeaderProps) {
  const formattedDate = isToday 
    ? "Aujourd'hui" 
    : format(new Date(date), 'EEEE d MMMM', { locale: fr });

  return (
    <div className="p-4 bg-white border-b border-gray-200">
      <h2 className="text-lg font-bold text-gray-800 capitalize">{formattedDate}</h2>
      <div className="h-0.5 w-10 bg-[#FF6154] mt-2" />
    </div>
  );
} 