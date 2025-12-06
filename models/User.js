const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  skills: [{
    type: String,
    trim: true
  }],
  github: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiresAt: {
    type: Date,
    default: null
  },
  jobApplicationsCount: {
    type: Number,
    default: 0
  },
  lastJobApplicationReset: {
    type: Date,
    default: Date.now
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para verificar se pode se candidatar a vagas
userSchema.methods.canApplyToJob = function() {
  if (this.isPremium && this.premiumExpiresAt > new Date()) {
    return true; // Premium pode se candidatar ilimitadamente
  }
  
  // Usuários gratuitos: 5 candidaturas por mês
  const now = new Date();
  const lastReset = new Date(this.lastJobApplicationReset);
  const monthsDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 + 
                     (now.getMonth() - lastReset.getMonth());
  
  if (monthsDiff >= 1) {
    // Reset do contador mensal
    this.jobApplicationsCount = 0;
    this.lastJobApplicationReset = now;
  }
  
  return this.jobApplicationsCount < 5;
};

module.exports = mongoose.model('User', userSchema);