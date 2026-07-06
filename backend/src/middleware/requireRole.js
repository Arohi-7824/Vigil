module.exports = function requireRole(role) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (userRole !== role) {
      return res.status(403).json({ error: "Forbidden: Admin only" });
    }

    next();
  };
};