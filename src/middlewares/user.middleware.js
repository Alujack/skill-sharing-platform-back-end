module.exports = {
    isAdmin: (req, res, next) => {
      if (req.user?.role === 'Admin') return next();
      return res.status(403).json({ message: 'Admin access only' });
    },
    isSelfOrAdmin: (req, res, next) => {
      const userId = parseInt(req.params.id);
      if (req.user?.role === 'Admin' || req.user?.id === userId) return next();
      return res.status(403).json({ message: 'Forbidden' });
    }
  };
  