import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'mysql-32635b88-military-asset-db.g.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_wARPkqdq9GvQTXOnHUw',
  database: 'defaultdb',
  port: 15682,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default {
  query: (sql, params) => pool.execute(sql, params),
  getConnection: () => pool.getConnection()
};