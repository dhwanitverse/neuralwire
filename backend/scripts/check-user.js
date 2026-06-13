#!/usr/bin/env node
/**
 * Check if an email exists in the active User collection.
 * Usage: node scripts/check-user.js dhwanit293@gmail.com
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const connectDB = require('../config/db');
const { findUserByEmail } = require('../utils/findUserByEmail');
const { normalizeEmail } = require('../utils/normalizeEmail');
const mongoose = require('mongoose');

const emailArg = process.argv[2];

if (!emailArg) {
  console.error('Usage: node scripts/check-user.js <email>');
  process.exit(1);
}

(async () => {
  try {
    await connectDB();
    const normalized = normalizeEmail(emailArg);
    console.log('\n── User lookup ──');
    console.log('Input email:     ', emailArg);
    console.log('Normalized email:', normalized);
    console.log('Database:        ', mongoose.connection.name);
    console.log('Host:            ', mongoose.connection.host);

    const user = await findUserByEmail(emailArg);

    if (!user) {
      console.log('User found:       false');
      console.log('\nNo user with this email in the database.');
      console.log('Register at /register or sign in with Google if you used OAuth.');
      process.exit(0);
    }

    console.log('User found:       true');
    console.log('User ID:         ', user._id.toString());
    console.log('Name:            ', user.name);
    console.log('Stored email:    ', user.email);
    console.log('Auth provider:   ', user.authProvider);
    console.log('Has password:    ', Boolean(user.password) || '(hidden — use login to test)');
    console.log('Google ID:       ', user.googleId || '(none)');

    const full = await findUserByEmail(emailArg, { withPassword: true });
    console.log('Password set:    ', Boolean(full?.password));
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
})();
