const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'K123n45as12',
  database:  'dermatouch'
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// Create database and table if they don't exist
async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database};`);
  await connection.query(`USE ${dbConfig.database};`);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      treatment_type VARCHAR(255) NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await connection.end();
}

// API endpoint for booking appointments
app.post('/api/appointments', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, treatmentType, notes } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO appointments (first_name, last_name, email, phone, treatment_type, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, phone, treatmentType, notes]
    );
    
    connection.release();
    res.status(201).json({ message: 'Appointment booked successfully!', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// Initialize database and start server
initializeDatabase().then(() => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});