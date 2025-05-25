// middleware/authMiddleware.js
import { verifyToken } from '../utils/jwt.js';

export function authenticate(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  // Verify the token
  try {
    const decoded = verifyToken(token);
    req.user = decoded; // attach decoded info to request
    next(); // continue to next middleware/controller
  } catch (err) {
    res.redirect("/login");
  }
}
