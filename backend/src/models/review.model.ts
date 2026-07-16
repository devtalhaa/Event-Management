import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 1000 },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ event: 1, user: 1 }, { unique: true });

// Optional: statics for average rating could go here or in service. We will handle aggregate in service/controller.

export const Review = mongoose.model('Review', reviewSchema);
