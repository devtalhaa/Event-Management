import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    quantity: { type: Number, default: 1, min: 1 },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
    bookedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Prevent double booking of the same event by the same user if active
bookingSchema.index({ event: 1, user: 1 }, { unique: true, partialFilterExpression: { status: 'confirmed' } });

export const Booking = mongoose.model('Booking', bookingSchema);
