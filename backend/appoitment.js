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
  
  // Updated table creation query
  await connection.query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      treatment_type VARCHAR(255) NOT NULL,
      appointment_datetime DATETIME NOT NULL,  // Added column
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  await connection.end();
}

// API endpoint for booking appointments
app.post('/api/appointments', async (req, res) => {
  const {
      firstName,
      lastName,
      email,
      phone,
      appointmentDate,
      appointmentTime,
      treatmentType,
      notes
  } = req.body;

  try {
      // Combine date and time for MySQL DATETIME format
      const appointmentDateTime = `${appointmentDate} ${appointmentTime}:00`;
      
      // Validate datetime
      const appointmentDateObj = new Date(appointmentDateTime);
      if (appointmentDateObj < new Date()) {
          return res.status(400).json({ error: 'Appointment date cannot be in the past' });
      }

      // Check time boundaries
      const hours = appointmentDateObj.getHours();
      if (hours < 9 || hours >= 18) {
          return res.status(400).json({ error: 'Appointments available between 9 AM to 6 PM' });
      }

      // Insert into MySQL
      const [result] = await pool.execute(
          `INSERT INTO appointments 
          (first_name, last_name, email, phone, treatment_type, appointment_datetime, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [firstName, lastName, email, phone, treatmentType, appointmentDateTime, notes]
      );

      res.status(201).json({
          message: 'Appointment booked successfully',
          appointmentId: result.insertId
      });

  } catch (error) {
      console.error('Database error:', error);
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