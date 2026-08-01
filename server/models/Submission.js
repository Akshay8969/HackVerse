const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hackathon',
      required: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectName: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    problemStatement: {
      type: String,
      required: [true, 'Problem statement is required'],
    },
    solution: {
      type: String,
      required: [true, 'Solution description is required'],
    },
    description: {
      type: String,
      default: '',
    },
    githubRepo: {
      type: String,
      default: '',
    },
    liveDemoUrl: {
      type: String,
      default: '',
    },
    techStack: [{ type: String }],
    screenshots: [{ type: String }],
    presentationPdf: {
      type: String,
      default: '',
    },
    demoVideoLink: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// One submission per team per hackathon
submissionSchema.index({ team: 1, hackathon: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
