const User = require('../models/User');
const { normalizeEmail, escapeRegex } = require('./normalizeEmail');

/**
 * Find user by email — exact lowercase match first, then case-insensitive fallback
 * for legacy documents that may not have been normalized on save.
 */
async function findUserByEmail(email, { withPassword = false, withResetFields = false } = {}) {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  let select = '';
  if (withPassword) select += '+password';
  if (withResetFields) select += (select ? ' ' : '') + '+resetPasswordToken +resetPasswordExpire';

  let user = await User.findOne({ email: normalized }).select(select);
  if (!user) {
    user = await User.findOne({
      email: { $regex: new RegExp(`^${escapeRegex(normalized)}$`, 'i') },
    }).select(select);

    // Migrate legacy mixed-case email to lowercase
    if (user && user.email !== normalized) {
      user.email = normalized;
      await user.save({ validateBeforeSave: false });
      console.log(`[Auth] Migrated email to lowercase: ${normalized}`);
    }
  }

  return user;
}

module.exports = { findUserByEmail };
