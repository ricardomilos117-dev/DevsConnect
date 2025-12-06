const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  company: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  requirements: [{
    type: String,
    trim: true
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    required: true,
    trim: true
  },
  remote: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true
  },
  level: {
    type: String,
    enum: ['junior', 'mid', 'senior', 'lead'],
    required: true
  },
  salary: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'BRL'
    }
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applications: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'accepted', 'rejected'],
      default: 'pending'
    },
    coverLetter: {
      type: String,
      maxlength: 1000
    }
  }],
  active: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias
    }
  }
}, {
  timestamps: true
});

// Índices para melhor performance
jobSchema.index({ active: 1, expiresAt: 1 });
jobSchema.index({ technologies: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ type: 1, level: 1 });

// Método para verificar se usuário já se candidatou
jobSchema.methods.hasUserApplied = function(userId) {
  return this.applications.some(app => app.user.toString() === userId.toString());
};

// Método para contar candidaturas
jobSchema.methods.getApplicationsCount = function() {
  return this.applications.length;
};

module.exports = mongoose.model('Job', jobSchema);