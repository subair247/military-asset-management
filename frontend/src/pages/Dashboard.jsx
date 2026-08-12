import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { StatCard } from '../components/StatCard';
import { NetMoveModal } from '../components/NetMoveModal';

export const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [metadata, setMetadata] = useState({ bases: [], equipmentTypes: [] });
  const [filters, setFilters] = useState({ baseId: '', equipmentTypeId: '' });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    API.get('/assets/metadata').then((res) => setMetadata(res.data));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.baseId) params.append('baseId', filters.baseId);
    if (filters.equipmentTypeId) params.append('equipmentTypeId', filters.equipmentTypeId);

    API.get(`/assets/metrics?${params.toString()}`).then((res) => setMetrics(res.data));
  }, [filters]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Operational Overview</h1>
        <div className="flex space-x-3">
          <select
            value={filters.baseId}
            onChange={(e) => setFilters({ ...filters, baseId: e.target.value })}
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
          >
            <option value="">All Military Bases</option>
            {metadata.bases.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <select
            value={filters.equipmentTypeId}
            onChange={(e) => setFilters({ ...filters, equipmentTypeId: e.target.value })}
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
          >
            <option value="">All Asset Types</option>
            {metadata.equipmentTypes.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Net Movement"
          value={metrics?.net_movement || 0}
          borderAccent="border-emerald-500"
          onClick={() => setShowModal(true)}
          isClickable={true}
        />
        <StatCard
          title="Assigned Equipment"
          value={metrics?.total_assigned || 0}
          borderAccent="border-amber-500"
        />
        <StatCard
          title="Expended Ammo/Stock"
          value={metrics?.total_expended || 0}
          borderAccent="border-rose-500"
        />
        <StatCard
          title="Closing Balance"
          value={metrics?.closing_balance || 0}
          borderAccent="border-indigo-500"
        />
      </div>

      {showModal && (
        <NetMoveModal metrics={metrics} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};