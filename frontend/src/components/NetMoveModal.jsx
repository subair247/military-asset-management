import React from 'react';

export const NetMoveModal = ({ metrics, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-2xl border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Net Movement Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Purchases (+)</span>
            <span className="font-semibold text-slate-800">+{metrics?.total_purchases || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Transfers In (+)</span>
            <span className="font-semibold text-emerald-600">+{metrics?.total_transfer_in || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Transfers Out (-)</span>
            <span className="font-semibold text-rose-600">-{metrics?.total_transfer_out || 0}</span>
          </div>
          <hr className="border-slate-200" />
          <div className="flex justify-between text-base font-bold text-slate-900">
            <span>Net Inventory Impact</span>
            <span>{metrics?.net_movement || 0}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-slate-800 text-white font-medium py-2.5 rounded-lg hover:bg-slate-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};