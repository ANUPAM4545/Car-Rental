const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');

console.log("Server file is running..."); 

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'simplekey',
  resave: false,
  saveUninitialized: true
}));


const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', 
  database: process.env.DB_NAME || 'car_rental',
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : undefined // Required for Aiven cloud connections
});

//db.connect((err) => {
 // if (err) {
 //   console.log("DB ERROR:", err);
 // } else {
 //   console.log("MySQL Connected ");
//  }
//});




app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/auth-status', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, role: req.session.user.role });
  } else {
    res.json({ loggedIn: false });
  }
});

app.get('/customer-signup', (req, res) => {
  res.sendFile(__dirname + '/public/customer_signup.html');
});

app.get('/agency-signup', (req, res) => {
  res.sendFile(__dirname + '/public/agency_signup.html');
});


app.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;

  db.query(
    'INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)',
    [name, email, password, role],
    (err) => {
      if (err) {
        console.log("Insert Error:", err);
        return res.send("<script>alert('Error in registration. Email might already exist.'); window.location.href='/signup';</script>");
      }
      res.send("<script>alert('Registration successful! Please login.'); window.location.href='/login';</script>");
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
        return res.send("<script>alert('Error logging in.'); window.location.href='/login';</script>");
      }

      if (result.length > 0) {
        req.session.user = result[0];
        res.redirect('/dashboard');
      } else {
        res.send("<script>alert('Invalid email or password.'); window.location.href='/login';</script>");
      }
    }
  );
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});


app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  
  if (req.session.user.role === 'agency') {
    res.sendFile(__dirname + '/public/agency_dashboard.html');
  } else {
    res.sendFile(__dirname + '/public/customer_dashboard.html');
  }
});


app.post('/add-car', (req, res) => {
  const user = req.session.user;

  if (!user || user.role !== 'agency') {
    return res.send("<script>alert('Not allowed: Only agencies can add cars'); window.location.href='/dashboard';</script>");
  }

  const { model, number, seats, rent } = req.body;

  db.query(
    'INSERT INTO cars (model,number,seats,rent,agency_id) VALUES (?,?,?,?,?)',
    [model, number, seats, rent, user.id],
    (err) => {
      if (err) {
        console.log("Car Insert Error:", err);
        return res.send("<script>alert('Error adding car'); window.location.href='/dashboard';</script>");
      }
      res.redirect('/dashboard');
    }
  );
});

app.get('/cars', (req, res) => {
  db.query('SELECT * FROM cars', (err, result) => {
    if (err) {
      console.log("Fetch Error:", err);
      return res.send("Error fetching cars");
    }
    res.json(result);
  });
});


app.get('/edit-car/:id', (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'agency') {
    return res.redirect('/login');
  }

  const carId = req.params.id;
  db.query('SELECT * FROM cars WHERE id=? AND agency_id=?', [carId, user.id], (err, result) => {
    if (err || result.length === 0) {
      return res.send("<script>alert('Car not found or unauthorized'); window.location.href='/dashboard';</script>");
    }
    // Render an edit page via simple dynamic replacement or send a static file
    // Ideally we would use a template engine, but we'll stick to a simple strategy for now.
    res.sendFile(__dirname + '/public/edit_car.html');
  });
});

app.get('/api/car/:id', (req, res) => {
  const carId = req.params.id;
  db.query('SELECT * FROM cars WHERE id=?', [carId], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({error: "Not found"});
    }
    res.json(result[0]);
  });
});

app.post('/edit-car/:id', (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'agency') {
    return res.status(403).send("Not allowed");
  }

  const carId = req.params.id;
  const { model, number, seats, rent } = req.body;

  db.query(
    'UPDATE cars SET model=?, number=?, seats=?, rent=? WHERE id=? AND agency_id=?',
    [model, number, seats, rent, carId, user.id],
    (err) => {
      if (err) {
        console.log("Edit Car Error:", err);
        return res.send("<script>alert('Error updating car'); window.location.href='/dashboard';</script>");
      }
      res.redirect('/dashboard');
    }
  );
});

app.post('/rent', (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.redirect('/login');
  }
  if (user.role !== 'customer') {
    return res.send("<script>alert('Only customers can book cars'); window.location.href='/dashboard';</script>");
  }

  const { car_id, days, start_date } = req.body;

  db.query(
    'INSERT INTO bookings (user_id,car_id,days,start_date) VALUES (?,?,?,?)',
    [user.id, car_id, days, start_date],
    (err) => {
      if (err) {
        console.log("Booking Error:", err);
        return res.send("<script>alert('Error booking car'); window.location.href='/dashboard';</script>");
      }
      res.send("<script>alert('Booked successfully!'); window.location.href='/dashboard';</script>");
    }
  );
});

app.get('/my-bookings', (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'customer') {
    return res.status(403).json({ error: "Only customers can view their bookings" });
  }

  const query = `
    SELECT b.id, b.days, b.status, c.model, c.number, c.rent 
    FROM bookings b 
    JOIN cars c ON b.car_id = c.id 
    WHERE b.user_id = ?
    ORDER BY b.id DESC
  `;
  
  db.query(query, [user.id], (err, result) => {
    if (err) {
      console.log("Error fetching my bookings:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

app.get('/agency-requests', (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'agency') {
    return res.status(403).json({ error: "Only agencies can view requests" });
  }

  const query = `
    SELECT b.id, b.days, b.status, c.model, c.number, u.name as customer_name
    FROM bookings b
    JOIN cars c ON b.car_id = c.id
    JOIN users u ON b.user_id = u.id
    WHERE c.agency_id = ? AND b.status = 'pending'
    ORDER BY b.id DESC
  `;

  db.query(query, [user.id], (err, result) => {
    if (err) {
      console.log("Error fetching agency requests:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

app.post('/agency-requests/action', (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'agency') {
    return res.status(403).json({ error: "Only agencies can take action" });
  }

  const { booking_id, action } = req.body;
  if (!booking_id || !['confirmed', 'rejected'].includes(action)) {
    return res.status(400).json({ error: "Invalid parameters" });
  }

  const verifyQuery = `
    SELECT b.id FROM bookings b 
    JOIN cars c ON b.car_id = c.id 
    WHERE b.id = ? AND c.agency_id = ?
  `;
  
  db.query(verifyQuery, [booking_id, user.id], (err, result) => {
    if (err || result.length === 0) {
      return res.status(403).json({ error: "Unauthorized or booking not found" });
    }

    db.query('UPDATE bookings SET status = ? WHERE id = ?', [action, booking_id], (updateErr) => {
      if (updateErr) {
        console.log("Error updating booking status:", updateErr);
        return res.status(500).json({ error: "Failed to update booking" });
      }
      res.redirect('/dashboard');
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});