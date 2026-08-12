import React from 'react';

export const StatCard = ({ title, value, borderAccent, onClick, isClickable }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${borderAccent} ${
        isClickable ? 'cursor-pointer hover:shadow-md transition-all' : ''
      }`}
    >
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-extrabold text-slate-800 mt-2">{value}</p>
      {isClickable && (
        <p className="text-xs text-emerald-600 font-medium mt-1">Click to view details &rarr;</p>
      )}
    </div>
  );
};