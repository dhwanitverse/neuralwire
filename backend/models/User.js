const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
      // Required only for local auth — Google users have no password
      validate: {
        validator: function (v) {
          if (this.authProvider === 'google') return true;
          return v && v.length >= 6;
        },
        message: 'Password is required for email/password accounts',
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // ── Google OAuth fields ──────────────────────────────────────────────
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    // ── Password-reset fields ────────────────────────────────────────────
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// Hash password whenever it is set or changed (register, reset, manual update)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
