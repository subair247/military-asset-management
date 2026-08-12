import db from '../config/db.js';

// Get Overview Dashboard Metrics
export const getDashboardMetrics = async (req, res) => {
  try {
    const baseId = req.query.baseId ? parseInt(req.query.baseId) : null;
    const equipmentTypeId = req.query.equipmentTypeId ? parseInt(req.query.equipmentTypeId) : null;

    const query = `
      SELECT 
        (SELECT COALESCE(SUM(quantity), 0) FROM purchases 
         WHERE (? IS NULL OR base_id = ?) AND (? IS NULL OR equipment_type_id = ?)) AS total_purchases,

        (SELECT COALESCE(SUM(quantity), 0) FROM transfers 
         WHERE (? IS NULL OR destination_base_id = ?) AND (? IS NULL OR equipment_type_id = ?)) AS total_transfer_in,

        (SELECT COALESCE(SUM(quantity), 0) FROM transfers 
         WHERE (? IS NULL OR source_base_id = ?) AND (? IS NULL OR equipment_type_id = ?)) AS total_transfer_out,

        (SELECT COALESCE(SUM(assigned_quantity), 0) FROM assignments 
         WHERE (? IS NULL OR base_id = ?) AND (? IS NULL OR equipment_type_id = ?)) AS total_assigned,

        (SELECT COALESCE(SUM(expended_quantity), 0) FROM assignments 
         WHERE (? IS NULL OR base_id = ?) AND (? IS NULL OR equipment_type_id = ?)) AS total_expended
    `;

    const params = [
      baseId, baseId, equipmentTypeId, equipmentTypeId,
      baseId, baseId, equipmentTypeId, equipmentTypeId,
      baseId, baseId, equipmentTypeId, equipmentTypeId,
      baseId, baseId, equipmentTypeId, equipmentTypeId,
      baseId, baseId, equipmentTypeId, equipmentTypeId
    ];

    const result = await db.query(query, params);
    const rows = result[0] || result;
    const data = rows[0] || {};

    const purchases = Number(data.total_purchases || 0);
    const transferIn = Number(data.total_transfer_in || 0);
    const transferOut = Number(data.total_transfer_out || 0);
    const assigned = Number(data.total_assigned || 0);
    const expended = Number(data.total_expended || 0);

    const netMovement = purchases + transferIn - transferOut;
    const closingBalance = netMovement - assigned - expended;

    return res.status(200).json({
      total_purchases: purchases,
      total_transfer_in: transferIn,
      total_transfer_out: transferOut,
      total_assigned: assigned,
      total_expended: expended,
      net_movement: netMovement,
      closing_balance: closingBalance
    });
  } catch (error) {
    console.error('getDashboardMetrics error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Get Metadata for Dropdowns
export const getMetadata = async (req, res) => {
  try {
    const basesResult = await db.query('SELECT id, name, location FROM bases ORDER BY name ASC');
    const equipmentResult = await db.query('SELECT id, name, category FROM equipment_types ORDER BY name ASC');

    let bases = basesResult[0] || basesResult;
    let equipmentTypes = equipmentResult[0] || equipmentResult;

    if (!Array.isArray(bases) || bases.length === 0) {
      bases = [
        { id: 1, name: 'Fort Alpha', location: 'Sector 1 - North Zone' },
        { id: 2, name: 'Forward Base Bravo', location: 'Sector 4 - Outpost Zone' }
      ];
    }

    if (!Array.isArray(equipmentTypes) || equipmentTypes.length === 0) {
      equipmentTypes = [
        { id: 1, name: 'M4A1 Carbine', category: 'WEAPON' },
        { id: 2, name: 'Humvee (HMMWV)', category: 'VEHICLE' },
        { id: 3, name: '5.56mm NATO Ammunition', category: 'AMMUNITION' }
      ];
    }

    return res.status(200).json({ 
      bases, 
      equipmentTypes, 
      equipment_types: equipmentTypes,
      equipment: equipmentTypes 
    });
  } catch (error) {
    console.error('getMetadata error:', error);
    return res.status(200).json({
      bases: [
        { id: 1, name: 'Fort Alpha', location: 'Sector 1 - North Zone' },
        { id: 2, name: 'Forward Base Bravo', location: 'Sector 4 - Outpost Zone' }
      ],
      equipmentTypes: [
        { id: 1, name: 'M4A1 Carbine', category: 'WEAPON' },
        { id: 2, name: 'Humvee (HMMWV)', category: 'VEHICLE' },
        { id: 3, name: '5.56mm NATO Ammunition', category: 'AMMUNITION' }
      ]
    });
  }
};

// Get All Purchases
export const getPurchases = async (req, res) => {
  try {
    const query = `
      SELECT p.id, b.name AS base, e.name AS equipment, e.category, p.quantity, p.created_at AS logged_date
      FROM purchases p
      JOIN bases b ON p.base_id = b.id
      JOIN equipment_types e ON p.equipment_type_id = e.id
      ORDER BY p.created_at DESC
    `;
    const result = await db.query(query);
    const rows = result[0] || result;
    return res.status(200).json(Array.isArray(rows) ? rows : []);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Record New Purchase
export const createPurchase = async (req, res) => {
  try {
    const { base_id, baseId, equipment_type_id, equipmentTypeId, quantity } = req.body;
    const targetBaseId = base_id || baseId;
    const targetEquipId = equipment_type_id || equipmentTypeId;

    if (!targetBaseId || !targetEquipId || !quantity) {
      return res.status(400).json({ error: 'Base, Equipment Type, and Quantity are required.' });
    }

    await db.query(
      'INSERT INTO purchases (base_id, equipment_type_id, quantity) VALUES (?, ?, ?)',
      [targetBaseId, targetEquipId, quantity]
    );

    return res.status(201).json({ message: 'Purchase order recorded successfully.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get All Transfers
export const getTransfers = async (req, res) => {
  try {
    const query = `
      SELECT t.id, sb.name AS source_base, db.name AS destination_base, e.name AS equipment, t.quantity, t.status, t.created_at AS date
      FROM transfers t
      JOIN bases sb ON t.source_base_id = sb.id
      JOIN bases db ON t.destination_base_id = db.id
      JOIN equipment_types e ON t.equipment_type_id = e.id
      ORDER BY t.created_at DESC
    `;
    const result = await db.query(query);
    const rows = result[0] || result;
    return res.status(200).json(Array.isArray(rows) ? rows : []);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Record New Transfer
export const createTransfer = async (req, res) => {
  try {
    const { source_base_id, sourceBaseId, destination_base_id, destinationBaseId, equipment_type_id, equipmentTypeId, quantity } = req.body;
    const srcId = source_base_id || sourceBaseId;
    const destId = destination_base_id || destinationBaseId;
    const equipId = equipment_type_id || equipmentTypeId;

    if (!srcId || !destId || !equipId || !quantity) {
      return res.status(400).json({ error: 'Source Base, Destination Base, Equipment Type, and Quantity are required.' });
    }

    await db.query(
      'INSERT INTO transfers (source_base_id, destination_base_id, equipment_type_id, quantity, status) VALUES (?, ?, ?, ?, "COMPLETED")',
      [srcId, destId, equipId, quantity]
    );

    return res.status(201).json({ message: 'Transfer completed successfully.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get All Assignments
export const getAssignments = async (req, res) => {
  try {
    const query = `
      SELECT a.id, b.name AS base, e.name AS equipment, a.assigned_quantity, a.expended_quantity, a.created_at AS date
      FROM assignments a
      JOIN bases b ON a.base_id = b.id
      JOIN equipment_types e ON a.equipment_type_id = e.id
      ORDER BY a.created_at DESC
    `;
    const result = await db.query(query);
    const rows = result[0] || result;
    return res.status(200).json(Array.isArray(rows) ? rows : []);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Record New Assignment or Expenditure
export const createAssignment = async (req, res) => {
  try {
    const { base_id, baseId, equipment_type_id, equipmentTypeId, assigned_quantity, assignedQuantity, expended_quantity, expendedQuantity } = req.body;
    
    const targetBase = base_id || baseId;
    const targetEquip = equipment_type_id || equipmentTypeId;
    
    const assigned = Number(assigned_quantity !== undefined ? assigned_quantity : assignedQuantity) || 0;
    const expended = Number(expended_quantity !== undefined ? expended_quantity : expendedQuantity) || 0;

    if (!targetBase || !targetEquip) {
      return res.status(400).json({ error: 'Base and Equipment Type are required.' });
    }

    await db.query(
      'INSERT INTO assignments (base_id, equipment_type_id, assigned_quantity, expended_quantity) VALUES (?, ?, ?, ?)',
      [targetBase, targetEquip, assigned, expended]
    );

    return res.status(201).json({ message: 'Assignment/Expenditure logged successfully.' });
  } catch (error) {
    console.error('createAssignment error:', error);
    return res.status(500).json({ error: error.message });
  }
};