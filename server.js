const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(express.static('public')); // Keep for existing assets if needed

app.use(session({
  secret: 'simplekey',
  resave: false,
  saveUninitialized: true
}));

const db = process.env.DATABASE_URL 
  ? mysql.createConnection(process.env.DATABASE_URL)
  : mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '', 
      database: process.env.DB_NAME || 'car_rental',
      port: process.env.DB_PORT || 3306,
      ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : undefined
    });

db.connect((err) => {
  if (err) {
    console.error("❌ DATABASE CONNECTION ERROR:", err.message);
  } else {
    console.log("✅ MySQL Connected Successfully");
  }
});

// API Routes
app.get('/auth-status', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

app.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;
  db.query(
    'INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)',
    [name, email, password, role],
    (err) => {
      if (err) {
        console.log("Insert Error:", err);
        return res.status(400).json({ error: "Email already exists or invalid data" });
      }
      res.json({ success: true, message: "Registration successful" });
    }
  );
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query(
    'SELECT * FROM users WHERE email=? AND password=?',
    [email, password],
    (err, result) => {
      if (err) {
        console.log("Login Error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (result.length > 0) {
        req.session.user = result[0];
        res.json({ success: true, user: result[0] });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    }
  );
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.post('/add-car', (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'agency') {
    return res.status(403).json({ error: "Unauthorized" });
  }
  const { model, number, seats, rent } = req.body;
  db.query(
    'INSERT INTO cars (model,number,seats,rent,agency_id) VALUES (?,?,?,?,?)',
    [model, number, seats, rent, user.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ success: true });
    }
  );
});

app.get('/cars', (req, res) => {
  db.query('SELECT * FROM cars', (err, result) => {
    if (err) return res.status(500).json({ error: "Internal server error" });
    res.json(result);
  });
});

app.get('/api/car/:id', (req, res) => {
  db.query('SELECT * FROM cars WHERE id=?', [req.params.id], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result[0]);
  });
});

app.post('/edit-car/:id', (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'agency') return res.status(403).json({ error: "Unauthorized" });
  const { model, number, seats, rent } = req.body;
  db.query(
    'UPDATE cars SET model=?, number=?, seats=?, rent=? WHERE id=? AND agency_id=?',
    [model, number, seats, rent, req.params.id, user.id],
    (err) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ success: true });
    }
  );
});

app.post('/rent', (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'customer') return res.status(403).json({ error: "Unauthorized" });
  const { car_id, days, start_date } = req.body;
  db.query(
    'INSERT INTO bookings (user_id,car_id,days,start_date) VALUES (?,?,?,?)',
    [user.id, car_id, days, start_date],
    (err) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ success: true });
    }
  );
});

app.get('/my-bookings', (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'customer') return res.status(403).json({ error: "Unauthorized" });
  const query = `
    SELECT b.id, b.days, b.status, c.model, c.number, c.rent 
    FROM bookings b 
    JOIN cars c ON b.car_id = c.id 
    WHERE b.user_id = ?
    ORDER BY b.id DESC
  `;
  db.query(query, [user.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(result);
  });
});

app.get('/agency-requests', (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'agency') return res.status(403).json({ error: "Unauthorized" });
  const query = `
    SELECT b.id, b.days, b.status, c.model, c.number, u.name as customer_name
    FROM bookings b
    JOIN cars c ON b.car_id = c.id
    JOIN users u ON b.user_id = u.id
    WHERE c.agency_id = ? AND b.status = 'pending'
    ORDER BY b.id DESC
  `;
  db.query(query, [user.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(result);
  });
});

app.post('/agency-requests/action', (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'agency') return res.status(403).json({ error: "Unauthorized" });
  const { booking_id, action } = req.body;
  db.query(
    'UPDATE bookings SET status = ? WHERE id = ? AND car_id IN (SELECT id FROM cars WHERE agency_id = ?)',
    [action, booking_id, user.id],
    (err) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ success: true });
    }
  );
});

// Wildcard route for React SPA (Express 5 safe)
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

module.exports = app;