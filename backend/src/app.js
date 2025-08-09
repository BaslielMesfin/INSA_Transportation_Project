// Import express module
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = require('./config/db');  // your Postgres pool connection config
const bcrypt = require('bcrypt');

// Middleware to parse JSON data from incoming requests
app.use(express.json());

// Debugging middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Body:`, req.body);
  next();
});

// Registration endpoint
app.post('/register', async (req, res) => {
  const { name, email, password, phone_number, role, company_id } = req.body;

  // Simple validation (expand as needed)
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with that email' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Normalize company_id to null if falsy (undefined, empty string, etc.)
    const companyIdValue = company_id || null;

    // Insert new user
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone_number, role, company_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role`,
      [name, email, hashedPassword, phone_number, role, companyIdValue]
    );

    res.status(201).json({ message: 'User registered', user: newUser.rows[0] });
  } catch (err) {
    console.error('Error in /register:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password, phone_number, role } = req.body;

  try {
    let user;

    if (email) {
      user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    } else if (phone_number) {
      user = await pool.query('SELECT * FROM users WHERE phone_number = $1', [phone_number]);
    } else {
      return res.status(400).json({ message: 'Email or phone number required for login' });
    }

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const foundUser = user.rows[0];

    // Check role if provided (optional)
    if (role && foundUser.role !== role) {
      return res.status(403).json({ message: 'Role mismatch' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, foundUser.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // For now, just return success with basic user info (no JWT yet)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        phone_number: foundUser.phone_number,
        role: foundUser.role,
        company_id: foundUser.company_id,
      },
    });

  } catch (err) {
    console.error('Error in /login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Start the server after middleware and routes are set
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
