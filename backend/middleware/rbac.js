const rbac = (requiredRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Access denied. No user found.' });
    }

    if (requiredRoles.length === 0) {
      return next();
    }

    const userRole = req.user.role;
    
    // Role hierarchy: Admin > Manager > Member
    const roleHierarchy = {
      'Admin': 3,
      'Manager': 2,
      'Member': 1
    };

    const requiredLevel = Math.max(...requiredRoles.map(role => roleHierarchy[role] || 0));
    const userLevel = roleHierarchy[userRole] || 0;

    if (userLevel >= requiredLevel) {
      return next();
    }

    return res.status(403).json({ 
      message: 'Access denied. Insufficient permissions.',
      required: requiredRoles,
      current: userRole 
    });
  };
};

module.exports = rbac;
