const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'database-personne-age.ct0ywk044gpj.eu-west-3.rds.amazonaws.com',
  user: 'julien',
  password: 'julien75012',
  database: 'database-personne-age',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
