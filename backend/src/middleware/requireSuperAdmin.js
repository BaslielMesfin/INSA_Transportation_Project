const requireSuperAdmin = (req, res, next) => {
  try {
    if (req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. SuperAdmin role required.'
      });
    }
    next();
  } catch (error) {
    console.error('SuperAdmin middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in role verification'
    });
  }
};

module.exports = requireSuperAdmin;