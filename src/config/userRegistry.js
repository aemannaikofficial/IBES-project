/**
 * 🔐 IBES Portal - Centralized User & Leader Registry
 * --------------------------------------------------
 * This file serves as the single source of truth for all 
 * administrative and academic accounts in the portal.
 */

export const ADMIN_CONFIG = {
  email: "aemannaik.official@gmail.com",
  name: "Admin (IBES)",
  password: "123456" // Standard mock password
};

export const LEADER_REGISTRY = [
  {
    name: "Dr. Sarah Collins",
    email: "sarah@gmail.com",
    programmes: [
      "Doctor of Business Administration (DBA) Mixed Mode",
      "Doctor of Business Administration by (Research)",
      "Master of Business Administration",
      "Bachelors of Arts(Hons) in Business Administration"
    ]
  },
  {
    name: "Dr. Alice Thompson",
    email: "alice@gmail.com",
    programmes: [
      "Doctor of Education (EdD) Mixed Mode",
      "Doctor of Education (EdD) Research Mode",
      "Master of Education - M.Ed",
      "Bachelor of Arts in Education"
    ]
  },
  {
    name: "Prof. James Miller",
    email: "james@gmail.com",
    programmes: [
      "Doctor of Business Administration (DBA) Mixed Mode",
      "Master of Business Administration"
    ]
  },
  {
    name: "Prof. Robert Reed",
    email: "robert@gmail.com",
    programmes: [
      "Doctor of Education (EdD) Mixed Mode",
      "Bachelor of Arts in Education"
    ]
  },
  {
    name: "Dr. Emily Watson",
    email: "emily@gmail.com",
    programmes: ["Mastère TESOL"]
  },
  {
    name: "Dr. Kevin Zhang",
    email: "kevin@gmail.com",
    programmes: ["Bachelor of Science (Hons) in Computer Science"]
  },
  {
    name: "Prof. Linda Wu",
    email: "linda@gmail.com",
    programmes: ["Bachelor of Science (Hons) in Computer Science"]
  }
];

/**
 * Validates credentials against the registry
 * @returns {Object|null} The user object if valid, else null
 */
export const validateAuth = (role, email, password) => {
  if (password !== "123456") return null;

  if (role === 'admin') {
    return email.toLowerCase() === ADMIN_CONFIG.email.toLowerCase() ? ADMIN_CONFIG : null;
  }

  const leader = LEADER_REGISTRY.find(l => l.email.toLowerCase() === email.toLowerCase());
  return leader || null;
};

/**
 * Returns a list of leader names for a specific programme
 */
export const getLeadersForProgramme = (programmeName) => {
  return LEADER_REGISTRY
    .filter(leader => leader.programmes.includes(programmeName))
    .map(leader => leader.name);
};
