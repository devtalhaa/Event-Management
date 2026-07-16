import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: ['text', 'number', 'boolean', 'date', 'select'], required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    options: { type: [String], default: undefined },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 1 },
    price: { type: Number, default: 0 },
    coverImage: { type: String },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    properties: [propertySchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

eventSchema.index({ title: 'text', description: 'text' });

eventSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'event',
  justOne: false,
});

export const Event = mongoose.model('Event', eventSchema);
