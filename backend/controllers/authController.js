import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_military_jwt_key_2026';

// Login User
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const rows = result[0] || result;

    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, base_id: user.base_id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      token,
      user: { id: user.id, username: user.username, role: user.role, base_id: user.base_id }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Get User Profile
export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMe = getProfile;