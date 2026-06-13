/**
 * Normalize email for storage and lookup (trim + lowercase).
 */
function normalizeEmail(email) {
  if (email == null || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

function isValidEmail(email) {
  const normalized = normalizeEmail(email);
  return normalized.length > 0 && /^\S+@\S+\.\S+$/.test(normalized);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  normalizeEmail,
  isValidEmail,
  escapeRegex,
};
