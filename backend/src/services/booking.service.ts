import { Booking } from '../models/booking.model';
import { Event } from '../models/event.model';
import { ApiError } from '../utils/apiError';

export const createBooking = async (eventId: string, quantity: number, userId: string) => {
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');
  if (event.status !== 'published') throw new ApiError(400, 'Cannot book an unpublished event');

  // Check capacity
  const activeBookings = await Booking.aggregate([
    { $match: { event: event._id, status: 'confirmed' } },
    { $group: { _id: null, totalQuantity: { $sum: '$quantity' } } }
  ]);
  
  const currentBooked = activeBookings[0]?.totalQuantity || 0;
  if (currentBooked + quantity > event.capacity) {
    throw new ApiError(400, 'Not enough capacity available');
  }

  // Double booking check is handled by MongoDB unique index
  try {
    const booking = await Booking.create({
      event: eventId,
      user: userId,
      quantity,
    });
    return booking;
  } catch (err: any) {
    if (err.code === 11000) {
      throw new ApiError(400, 'You already have an active booking for this event');
    }
    throw err;
  }
};

export const getMyBookings = async (userId: string) => {
  const bookings = await Booking.find({ user: userId })
    .populate('event', 'title startDate location coverImage status')
    .sort({ bookedAt: -1 });
  return bookings;
};

export const getEventBookings = async (eventId: string, userId: string) => {
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');
  if (event.createdBy.toString() !== userId) {
    throw new ApiError(403, 'Not authorized to view bookings for this event');
  }

  const bookings = await Booking.find({ event: eventId })
    .populate('user', 'name email')
    .sort({ bookedAt: -1 });
  return bookings;
};

export const cancelBooking = async (bookingId: string, userId: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.user.toString() !== userId) {
    throw new ApiError(403, 'Not authorized to cancel this booking');
  }
  if (booking.status === 'cancelled') {
    throw new ApiError(400, 'Booking is already cancelled');
  }

  booking.status = 'cancelled';
  await booking.save();
  return booking;
};
