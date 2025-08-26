import mongoose from 'mongoose';

const fitbitTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fitbitUserId: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  tokenType: {
    type: String,
    default: 'Bearer'
  },
  expiresAt: {
    type: Date,
    required: true
  },
  scopes: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
fitbitTokenSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if token is expired
fitbitTokenSchema.methods.isExpired = function() {
  return new Date() >= this.expiresAt;
};

// Method to check if token expires soon (within 5 minutes)
fitbitTokenSchema.methods.expiresSoon = function() {
  const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
  return this.expiresAt <= fiveMinutesFromNow;
};

const FitbitToken = mongoose.model('FitbitToken', fitbitTokenSchema);

export default FitbitToken;
