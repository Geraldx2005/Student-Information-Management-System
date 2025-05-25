// utils/jwt.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET;

// Create (sign) a token
export function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' }); // expires in 15 min
}

// Create (sign) a refresh token
export function generateRefreshToken(user) {
  return jwt.sign(user, REFRESH_SECRET_KEY, { expiresIn: '7d' });
}

// Verify token
export function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

// Verify refresh token.
export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET_KEY);
}
