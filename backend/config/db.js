import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql-32635b88-military-asset-db.g.aivencloud.com',
  user: process.env.DB_USER || 'avnadmin',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'defaultdb',
  port: Number(process.env.DB_PORT) || 15682,
  ssl: { rejectUnauthorized: false }
});

export default pool;