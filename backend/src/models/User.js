const userSchema = new mongoose.Schema({
  // ... your existing fields ...
  twoFAEnabled: {
    type: Boolean,
    default: false
  },
  twoFASecret: {
    type: String,
    select: false // Don't include in queries by default
  }
}, {
  timestamps: true
});

// Add method to compare password (if not already there)
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
