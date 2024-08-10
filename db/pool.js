const { Pool } = require('pg');
require('dotenv').config();

const user=process.env.DB_USER;
const password=process.env.DB_PASS;
const db_host=process.env.DB_HOST;
const db_port=process.env.DB_PORT;
const database_name=process.env.DB_NAME;



const pool = new Pool({
  connectionString:`postgresql://${user}:${password}@${db_host}:${db_port}/${database_name}`,
});


module.exports = pool;