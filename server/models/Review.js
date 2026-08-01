const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
    },
    judge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hackathon',
      required: true,
    },
    scores: {
      innovation: { type: Number, min: 0, max: 10, default: 0 },
      technicalComplexity: { type: Number, min: 0, max: 10, default: 0 },
      userInterface: { type: Number, min: 0, max: 10, default: 0 },
      functionality: { type: Number, min: 0, max: 10, default: 0 },
      scalability: { type: Number, min: 0, max: 10, default: 0 },
      documentation: { type: Number, min: 0, max: 10, default: 0 },
      presentation: { type: Number, min: 0, max: 10, default: 0 },
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    comments: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// One review per judge per submission
reviewSchema.index({ submission: 1, judge: 1 }, { unique: true });

// Auto-calculate totalScore before saving
reviewSchema.pre('save', function (next) {
  const s = this.scores;
  this.totalScore =
    s.innovation +
    s.technicalComplexity +
    s.userInterface +
    s.functionality +
    s.scalability +
    s.documentation +
    s.presentation;
  next();
});

module.exports = mongoose.model('Review', reviewSchema);
