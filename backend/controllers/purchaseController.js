import db from '../config/db.js';

export const createPurchase = async (req, res) => {
  try {
    const { baseId, equipmentTypeId, quantity } = req.body;
    const [result] = await db.query(
      'INSERT INTO purchases (base_id, equipment_type_id, quantity) VALUES (?, ?, ?)',
      [baseId, equipmentTypeId, quantity]
    );

    return res.status(201).json({
      message: "Purchase logged successfully",
      purchaseId: result.insertId
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getPurchases = async (req, res) => {
  try {
    const baseId = req.query.baseId ? parseInt(req.query.baseId) : null;
    const query = `
      SELECT p.id, b.name as base_name, e.name as equipment_name, e.category, p.quantity, p.created_at
      FROM purchases p
      JOIN bases b ON p.base_id = b.id
      JOIN equipment_types e ON p.equipment_type_id = e.id
      WHERE (? IS NULL OR p.base_id = ?)
      ORDER BY p.created_at DESC
    `;
    const [rows] = await db.query(query, [baseId, baseId]);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};