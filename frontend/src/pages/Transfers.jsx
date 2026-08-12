import React, { useState, useEffect } from 'react';
import API from '../services/api';

export const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [metadata, setMetadata] = useState({ bases: [], equipmentTypes: [] });
  const [formData, setFormData] = useState({
    sourceBaseId: '',
    destinationBaseId: '',
    equipmentTypeId: '',
    quantity: ''
  });

  const fetchTransfers = () => {
    API.get('/transfers').then((res) => setTransfers(res.data));
  };

  useEffect(() => {
    API.get('/assets/metadata').then((res) => setMetadata(res.data));
    fetchTransfers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/transfers', {
      sourceBaseId: parseInt(formData.sourceBaseId),
      destinationBaseId: parseInt(formData.destinationBaseId),
      equipmentTypeId: parseInt(formData.equipmentTypeId),
      quantity: parseInt(formData.quantity)
    });
    setFormData({ sourceBaseId: '', destinationBaseId: '', equipmentTypeId: '', quantity: '' });
    fetchTransfers();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Cross-Base Transfers</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-base font-semibold text-slate-800 mb-4">Initiate Stock Transfer</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            value={formData.sourceBaseId}
            onChange={(e) => setFormData({ ...formData, sourceBaseId: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
            required
          >
            <option value="">Source Base</option>
            {metadata.bases.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <select
            value={formData.destinationBaseId}
            onChange={(e) => setFormData({ ...formData, destinationBaseId: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
            required
          >
            <option value="">Destination Base</option>
            {metadata.bases.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <select
            value={formData.equipmentTypeId}
            onChange={(e) => setFormData({ ...formData, equipmentTypeId: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
            required
          >
            <option value="">Equipment Type</option>
            {metadata.equipmentTypes.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
            required
            min="1"
          />

          <button type="submit" className="bg-slate-900 text-white rounded-lg text-sm font-medium py-2">
            Dispatch Transfer
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-800 font-semibold border-b">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Source Base</th>
              <th className="p-4">Destination Base</th>
              <th className="p-4">Equipment</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Initiated By</th>
              <th className="p-4">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((t) => (
              <tr key={t.id} className="border-b hover:bg-slate-50">
                <td className="p-4">#{t.id}</td>
                <td className="p-4 text-slate-800">{t.source_base}</td>
                <td className="p-4 text-slate-800">{t.destination_base}</td>
                <td className="p-4">{t.equipment_name}</td>
                <td className="p-4 font-bold text-slate-800">{t.quantity}</td>
                <td className="p-4">{t.initiated_by || 'System'}</td>
                <td className="p-4">{new Date(t.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};