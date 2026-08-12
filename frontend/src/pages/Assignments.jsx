import React, { useState, useEffect } from 'react';

const Assignments = () => {
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [assignmentsList, setAssignmentsList] = useState([]);

  const [selectedBase, setSelectedBase] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [assignedQuantity, setAssignedQuantity] = useState('');
  const [expendedQuantity, setExpendedQuantity] = useState('');

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const metaRes = await fetch('http://localhost:5000/api/v1/assets/metadata', { headers });
      if (metaRes.ok) {
        const metaData = await metaRes.json();
        setBases(metaData.bases || []);
        setEquipmentTypes(metaData.equipmentTypes || metaData.equipment_types || []);
      }

      const listRes = await fetch('http://localhost:5000/api/v1/assets/assignments', { headers });
      if (listRes.ok) {
        const listData = await listRes.json();
        setAssignmentsList(Array.isArray(listData) ? listData : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogRecord = async () => {
    if (!selectedBase || !selectedEquipment) {
      alert('Please select both a Base and an Equipment Type.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/assets/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          base_id: Number(selectedBase),
          equipment_type_id: Number(selectedEquipment),
          assigned_quantity: Number(assignedQuantity) || 0,
          expended_quantity: Number(expendedQuantity) || 0
        })
      });

      const resData = await response.json();

      if (response.ok) {
        alert('Record logged successfully!');
        setAssignedQuantity('');
        setExpendedQuantity('');
        fetchData();
      } else {
        alert(resData.error || 'Failed to log assignment record.');
      }
    } catch (error) {
      console.error('Error logging record:', error);
      alert('Network error while logging record.');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ color: '#0f172a', marginBottom: '16px' }}>Assignments & Expenditures</h2>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#334155' }}>Log Assignment or Operational Expenditure</h4>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          <select 
            value={selectedBase} 
            onChange={(e) => setSelectedBase(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', minWidth: '180px' }}
          >
            <option value="">Select Base</option>
            {bases.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <select 
            value={selectedEquipment} 
            onChange={(e) => setSelectedEquipment(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', minWidth: '180px' }}
          >
            <option value="">Select Equipment Type</option>
            {equipmentTypes.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>

          <input 
            type="number" 
            placeholder="Assigned Qty" 
            value={assignedQuantity} 
            onChange={(e) => setAssignedQuantity(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '130px' }}
          />

          <input 
            type="number" 
            placeholder="Expended Qty" 
            value={expendedQuantity} 
            onChange={(e) => setExpendedQuantity(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '130px' }}
          />

          <button 
            type="button"
            onClick={handleLogRecord}
            style={{ background: '#0f172a', color: '#fff', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Log Record
          </button>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '12px 16px' }}>ID</th>
              <th style={{ padding: '12px 16px' }}>Base</th>
              <th style={{ padding: '12px 16px' }}>Equipment</th>
              <th style={{ padding: '12px 16px' }}>Assigned Qty</th>
              <th style={{ padding: '12px 16px' }}>Expended Qty</th>
              <th style={{ padding: '12px 16px' }}>Logged Date</th>
            </tr>
          </thead>
          <tbody>
            {assignmentsList.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                  No assignment or expenditure records logged yet.
                </td>
              </tr>
            ) : (
              assignmentsList.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>#{item.id}</td>
                  <td style={{ padding: '12px 16px' }}>{item.base}</td>
                  <td style={{ padding: '12px 16px' }}>{item.equipment}</td>
                  <td style={{ padding: '12px 16px', color: '#d97706', fontWeight: 'bold' }}>{item.assigned_quantity}</td>
                  <td style={{ padding: '12px 16px', color: '#dc2626', fontWeight: 'bold' }}>{item.expended_quantity}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>
                    {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assignments;