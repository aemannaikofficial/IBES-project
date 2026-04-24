/**
 * 🔐 IBES Portal - Centralized User & Leader Registry (EXAMPLE TEMPLATE)
 * ------------------------------------------------------------------
 * Rename this file to userRegistry.js and provide real credentials.
 * This file is managed locally and should not be tracked by Git.
 */

export const ADMIN_CONFIG = {
  email: "admin@example.com",
  name: "Admin (IBES)",
  password: "your_password_here" 
};

export const LEADER_REGISTRY = [
  {
    name: "Dr. Example Name",
    email: "leader@example.com",
    programmes: [
      "Programme Name 1",
      "Programme Name 2"
    ]
  }
];

export const validateAuth = (role, email, password) => {
  // Implementation logic same as original
  if (password !== "your_password_here") return null;

  if (role === 'admin') {
    return email.toLowerCase() === ADMIN_CONFIG.email.toLowerCase() ? ADMIN_CONFIG : null;
  }

  const leader = LEADER_REGISTRY.find(l => l.email.toLowerCase() === email.toLowerCase());
  return leader || null;
};

export const getLeadersForProgramme = (programmeName) => {
  return LEADER_REGISTRY
    .filter(leader => leader.programmes.includes(programmeName))
    .map(leader => leader.name);
};
