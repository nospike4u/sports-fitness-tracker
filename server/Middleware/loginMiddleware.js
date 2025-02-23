import { verifyToken } from '../utils/auth.js';

export const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden' });
  }
};

export const isOwnerOrAdmin = async (req, res, next) => {
  try {
    const loggedInUserId = req.user.id;
    const { id } = req.params;
    const isAdmin = req.user.isAdmin;

    if (!loggedInUserId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (loggedInUserId === id || isAdmin) {
      return next();
    } else {
      return res.status(403).json({
        message: 'Forbidden: You do not have permission to perform this action',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admins only' });
  }
};