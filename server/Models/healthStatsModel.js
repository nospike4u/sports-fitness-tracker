import mongoose from 'mongoose';

const healthStatSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      index: true  // Add index for faster queries by user
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    heartRate: {
      restingRate: { type: Number },
      maxRate: { type: Number },
      minRate: { type: Number },
      averageRate: { type: Number }
    },
    sleep: {
      duration: { type: Number },  // in minutes
      quality: { type: Number, min: 1, max: 10 },
      deepSleepMinutes: { type: Number },
      remSleepMinutes: { type: Number }
    },
    activity: {
      steps: { type: Number },
      caloriesBurned: { type: Number },
      activeMinutes: { type: Number }
    },
    weight: { type: Number },  // in kg or lb
    bodyFat: { type: Number },  // percentage
    bloodPressure: {
      systolic: { type: Number },
      diastolic: { type: Number }
    },
    notes: { type: String }
  },
  {
    timestamps: true
  }
);

// Create compound index for efficient querying by user and date range
healthStatSchema.index({ user: 1, date: 1 });

const HealthStat = mongoose.model('healthStats', healthStatSchema);

export default HealthStat;