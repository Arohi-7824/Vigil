exports.requireAuth = (req, res, next) => {
  // TEMP: bypass auth for now
  req.user = {
    id:1,
    email: "admin@vigil.com",
    role: "ADMIN"
  };

  next();
};

exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admins only" });
  }
  next();
};