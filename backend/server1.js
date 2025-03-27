const express = require('express');
const mysql = require('mysql2/promise'); // Use promise-based API
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: '*' })); // Allow all origins for testing

// Database configuration
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port:'3306',
  password: 'K123n45as12',
  database: 'shopping',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Order submission endpoint
app.post('/orders', async (req, res) => {
  const orderData = req.body;
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Insert order
    const [orderResult] = await connection.execute(
      `INSERT INTO orders 
      (customer_name, customer_email, customer_address, 
       payment_method, payment_details, total_amount)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        orderData.customer.name,
        orderData.customer.email,
        orderData.customer.address,
        orderData.payment.method,
        JSON.stringify(orderData.payment.details),
        orderData.total
      ]
    );

    // Insert order items
    const orderId = orderResult.insertId;
    for (const item of orderData.items) {
      await connection.execute(
        `INSERT INTO order_items 
        (order_id, product_name, quantity, price)
        VALUES (?, ?, ?, ?)`,
        [orderId, item.name, item.quantity, item.price]
      );
    }

    await connection.commit();
    res.status(201).json({
      message: 'Order placed successfully',
      redirect: '/order-success.html'
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Database Error:', error.message);
    res.status(500).json({
      error: 'Order failed',
      details: error.message
    });
  } finally {
    if (connection) connection.release();
  }
});

// Start server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});