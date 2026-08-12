import React, { useState, useEffect } from 'react';
import API from '../services/api';

export const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [metadata, setMetadata] = useState({ bases: [], equipmentTypes: [] });
  const [formData, setFormData] = useState({ baseId: '', equipmentTypeId: '', quantity: '' });

  const fetchPurchases = () => {
    API.get('/purchases').then((res) => setPurchases(res.data));
  };

  useEffect(() => {
    API.get('/assets/metadata').then((res) => setMetadata(res.data));
    fetchPurchases();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/purchases', {
      baseId: parseInt(formData.baseId),
      equipmentTypeId: parseInt(formData.equipmentTypeId),
      quantity: parseInt(formData.quantity)
    });
    setFormData({ baseId: '', equipmentTypeId: '', quantity: '' });
    fetchPurchases();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Asset Acquisitions</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-base font-semibold text-slate-800 mb-4">Log New Purchase Order</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={formData.baseId}
            onChange={(e) => setFormData({ ...formData, baseId: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
            required
          >
            <option value="">Select Destination Base</option>
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
            <option value="">Select Equipment Type</option>
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
            Record Purchase
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-800 font-semibold border-b">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Base</th>
              <th className="p-4">Equipment</th>
              <th className="p-4">Category</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Logged Date</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id} className="border-b hover:bg-slate-50">
                <td className="p-4">#{p.id}</td>
                <td className="p-4 font-medium text-slate-800">{p.base_name}</td>
                <td className="p-4">{p.equipment_name}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4 font-bold text-emerald-600">+{p.quantity}</td>
                <td className="p-4">{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};