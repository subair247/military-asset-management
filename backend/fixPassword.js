import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function resetPassword() {
  const connection = await mysql.createConnection({
    host: 'mysql-32635b88-military-asset-db.g.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_wARPkqdq9GvQTXOnHUw',
    database: 'defaultdb',
    port: 15682,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const hashedPassword = await bcrypt.hash('AdminPass123!', 10);
    
    // Update or insert admin_user
    await connection.query(
      `INSERT INTO users (username, password_hash, role) 
       VALUES ('admin_user', ?, 'ADMIN') 
       ON DUPLICATE KEY UPDATE password_hash = ?`,
      [hashedPassword, hashedPassword]
    );

    console.log('Password for admin_user successfully updated!');
  } catch (err) {
    console.error('Password reset error:', err);
  } finally {
    await connection.end();
  }
}

resetPassword();