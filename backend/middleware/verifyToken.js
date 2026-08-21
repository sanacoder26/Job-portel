// Dummy auth middleware — drop-in placeholder.
// Swap this out for your real JWT verification later.
// It decodes a Bearer token (if present) or falls back to a fake user
// so routes work during local development without a real auth server.

const jwt = require('jsonwebtoken');

const FALLBACK_USER = {
  id: '65f1c2a3b4d5e6f7a8b9c0d1', // a stable fake ObjectId
  name: 'Demo User',
  email: 'demo@jobportal.local',
};

function verifyToken(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    // No token supplied — use the fallback user for local dev.
    req.user = { ...FALLBACK_USER };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = decoded;
    next();
  } catch (_err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = verifyToken;
