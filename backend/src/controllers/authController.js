const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { body, validationResult } = require('express-validator');

// Token lifetimes
const ACCESS_TOKEN_EXPIRES_IN = '1h';
const REFRESH_TOKEN_EXPIRES_IN = '10y';

// ------------------- REGISTER -------------------
exports.registerUser = [
  // Validation & Sanitization
  body('name').trim().escape().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  body('phone_number')
    .optional()
    .customSanitizer(value => value.replace(/\s+/g, '')) // remove all spaces
    .trim()
    .escape(),
  body('role').notEmpty().isIn(['SUPER_ADMIN','COMPANY_ADMIN','DRIVER','PASSENGER']),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    let { name, email, password, phone_number, role, company_id } = req.body;

    try {
      // Ensure phone_number is sanitized one more time
      phone_number = phone_number?.replace(/\s+/g, '');

      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) return res.status(400).json({ message: 'User already exists with that email' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const companyIdValue = company_id || null;

      const newUser = await pool.query(
        `INSERT INTO users (name, email, password_hash, phone_number, role, company_id)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role`,
        [name, email, hashedPassword, phone_number, role, companyIdValue]
      );

      res.status(201).json({ message: 'User registered', user: newUser.rows[0] });
    } catch (err) {
      console.error('Error in registerUser:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
];

// ------------------- LOGIN -------------------
exports.loginUser = [
  // Validation & Sanitization
  body('email').optional().isEmail().normalizeEmail(),
  body('phone_number').optional().customSanitizer(value => value.replace(/\s+/g, '')).trim().escape(),
  body('password').notEmpty(),
  body('role').optional().isIn(['SUPER_ADMIN','COMPANY_ADMIN','DRIVER','PASSENGER']),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    let { email, password, phone_number, role } = req.body;

    try {
      // sanitize phone number again just in case
      phone_number = phone_number?.replace(/\s+/g, '');

      let user;
      if (email) {
        user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      } else if (phone_number) {
        user = await pool.query('SELECT * FROM users WHERE phone_number = $1', [phone_number]);
      } else {
        return res.status(400).json({ message: 'Email or phone number required for login' });
      }

      if (user.rows.length === 0) return res.status(400).json({ message: 'User not found' });

      const foundUser = user.rows[0];
      if (role && foundUser.role !== role) return res.status(403).json({ message: 'Role mismatch' });

      const isMatch = await bcrypt.compare(password, foundUser.password_hash);
      if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

      const payload = { 
        id: foundUser.id, 
        role: foundUser.role,
        companyId: foundUser.company_id  // <-- add this
      };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

      // Store refresh token in DB
      await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, foundUser.id]);

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
        accessToken,
        refreshToken
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
];


exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Check if token matches the one in DB
    const result = await pool.query('SELECT refresh_token FROM users WHERE id = $1', [decoded.id]);
    if (result.rows.length === 0 || result.rows[0].refresh_token !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const payload = { id: decoded.id, role: decoded.role };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};
