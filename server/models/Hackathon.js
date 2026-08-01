const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    theme: {
      type: String,
      required: [true, 'Theme is required'],
    },
    mode: {
      type: String,
      enum: ['Online', 'Offline', 'Hybrid'],
      required: true,
    },
    venue: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required'],
    },
    bannerImage: {
      type: String,
      default: '',
    },
    prizePool: {
      type: String,
      default: '',
    },
    maxTeamSize: {
      type: Number,
      default: 4,
      min: 1,
    },
    rules: {
      type: String,
      default: '',
    },
    judgingCriteria: [
      {
        name: String,
        maxScore: { type: Number, default: 10 },
      },
    ],
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    judges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: {
      type: String,
      enum: ['Draft', 'Registration Open', 'Registration Closed', 'Ongoing', 'Completed'],
      default: 'Draft',
    },
    registrationOpen: {
      type: Boolean,
      default: false,
    },
    winnersAnnounced: {
      type: Boolean,
      default: false,
    },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Text search index
hackathonSchema.index({ title: 'text', description: 'text', theme: 'text' });

module.exports = mongoose.model('Hackathon', hackathonSchema);
