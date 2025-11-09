'use client';

import React from 'react';

type EmptyDayViewProps = {
  selectedDate: Date;
  onBack: () => void;
  onAddEvent: () => void;
};

const EmptyDayView: React.FC<EmptyDayViewProps> = ({ selectedDate, onBack, onAddEvent }) => {
  const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
  const dayOfMonth = selectedDate.getDate();

  return (
    <div className="bg-[#353131] p-6 rounded-lg shadow-lg w-full max-w-6xl mx-auto text-white">
      <div className="flex justify-between items-center border-b border-gray-600 pb-4">
        <h2 className="text-2xl font-bold">{`${dayOfWeek} ${dayOfMonth}`}</h2>
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          &lt; Back to Month
        </button>
      </div>
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="w-24 h-24 mb-4 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">ICON</span>
        </div>
        <p className="text-gray-400 text-lg mb-6">There are no currently assign event</p>
        <button
          onClick={onAddEvent}
          className="bg-[#FFD966] text-[#353131] font-bold py-2 px-4 rounded hover:bg-[#e6c555]"
        >
          Add Event
        </button>
      </div>
    </div>
  );
};

export default EmptyDayView;