const mysql = require('mysql2');
require('dotenv').config(); // Optional, if you have a .env file

const host = process.env.DB_HOST;
const port = process.env.DB_PORT || 3306;

console.log(`🔍 Testing connection to: ${host}:${port}...`);

if (!host || host === 'localhost') {
  console.error("❌ ERROR: DB_HOST is not set or is 'localhost'. Please set your Aiven host in your terminal or .env file.");
  process.exit(1);
}

const connection = mysql.createConnection({
  host: host,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: port,
  ssl: { rejectUnauthorized: false }
});

connection.connect((err) => {
  if (err) {
    console.error("❌ FAILED TO CONNECT!");
    console.error("Error Code:", err.code);
    console.error("Error Message:", err.message);
    console.log("\n💡 TIPS:");
    if (err.code === 'ENOTFOUND') {
      console.log("- The Hostname is typoed. Double check the address in Aiven.");
    } else if (err.code === 'ETIMEDOUT') {
      console.log("- Connection timed out. Check if 'Public Access' is ON in Aiven.");
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log("- Wrong Username or Password.");
    }
  } else {
    console.log("✅ SUCCESS! Your database is reachable from outside.");
    connection.end();
  }
  process.exit();
});
