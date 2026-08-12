import db from '../config/db.js';

export const createTransfer = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { sourceBaseId, destinationBaseId, equipmentTypeId, quantity } = req.body;
    const userId = req.user.id;

    if (sourceBaseId === destinationBaseId) {
      return res.status(400).json({ message: "Source and destination base cannot be identical" });
    }

    await connection.beginTransaction();

    const [transferResult] = await connection.execute(
      'INSERT INTO transfers (source_base_id, destination_base_id, equipment_type_id, quantity, initiated_by) VALUES (?, ?, ?, ?, ?)',
      [sourceBaseId, destinationBaseId, equipmentTypeId, quantity, userId]
    );

    const details = `Transferred ${quantity} items (Type #${equipmentTypeId}) from Base #${sourceBaseId} to Base #${destinationBaseId}`;
    await connection.execute(
      'INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)',
      [userId, 'TRANSFER', details]
    );

    await connection.commit();
    return res.status(201).json({
      message: "Transfer executed successfully",
      transferId: transferResult.insertId
    });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ error: "Transaction failed: " + error.message });
  } finally {
    connection.release();
  }
};

export const getTransfers = async (req, res) => {
  try {
    const baseId = req.query.baseId ? parseInt(req.query.baseId) : null;
    const query = `
      SELECT 
        t.id, 
        sb.name as source_base, 
        db_base.name as destination_base, 
        e.name as equipment_name, 
        t.quantity, 
        t.status, 
        u.username as initiated_by, 
        t.created_at
      FROM transfers t
      JOIN bases sb ON t.source_base_id = sb.id
      JOIN bases db_base ON t.destination_base_id = db_base.id
      JOIN equipment_types e ON t.equipment_type_id = e.id
      LEFT JOIN users u ON t.initiated_by = u.id
      WHERE (? IS NULL OR t.source_base_id = ? OR t.destination_base_id = ?)
      ORDER BY t.created_at DESC
    `;
    const [rows] = await db.query(query, [baseId, baseId, baseId]);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};