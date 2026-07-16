import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as bookingService from '../services/booking.service';
import { successResponse } from '../utils/apiResponse';

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const { eventId, quantity } = req.body;
  const booking = await bookingService.createBooking(eventId, quantity, req.user!.id);
  res.status(201).json(successResponse('Booking created successfully', booking));
});

export const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await bookingService.getMyBookings(req.user!.id);
  res.status(200).json(successResponse('My bookings fetched successfully', bookings));
});

export const getEventBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await bookingService.getEventBookings(req.params.id as string, req.user!.id);
  res.status(200).json(successResponse('Event bookings fetched successfully', bookings));
});

export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingService.cancelBooking(req.params.id as string, req.user!.id);
  res.status(200).json(successResponse('Booking cancelled successfully', booking));
});
