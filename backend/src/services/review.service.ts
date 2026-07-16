import { Review } from '../models/review.model';
import { Event } from '../models/event.model';
import { ApiError } from '../utils/apiError';

export const createReview = async (eventId: string, rating: number, comment: string, userId: string) => {
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');

  try {
    const review = await Review.create({ event: eventId, user: userId, rating, comment });
    return review;
  } catch (err: any) {
    if (err.code === 11000) {
      throw new ApiError(400, 'You have already reviewed this event');
    }
    throw err;
  }
};

export const getEventReviews = async (eventId: string) => {
  const reviews = await Review.find({ event: eventId }).populate('user', 'name').sort({ createdAt: -1 });
  return reviews;
};

export const updateReview = async (reviewId: string, data: any, userId: string) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, 'Review not found');
  if (review.user.toString() !== userId) {
    throw new ApiError(403, 'Not authorized to edit this review');
  }

  if (data.rating) review.rating = data.rating;
  if (data.comment) review.comment = data.comment;
  await review.save();
  return review;
};

export const deleteReview = async (reviewId: string, userId: string, userRole: string) => {
  const review = await Review.findById(reviewId).populate('event');
  if (!review) throw new ApiError(404, 'Review not found');

  // Author can delete, or event owner can delete
  let authorized = false;
  if (review.user.toString() === userId) {
    authorized = true;
  } else if (userRole === 'user') {
    const event = review.event as any;
    if (event.createdBy.toString() === userId) {
      authorized = true;
    }
  }

  if (!authorized) {
    throw new ApiError(403, 'Not authorized to delete this review');
  }

  await review.deleteOne();
  return null;
};
