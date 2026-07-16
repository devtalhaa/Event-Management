import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as reviewService from '../services/review.service';
import { successResponse } from '../utils/apiResponse';

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { eventId, rating, comment } = req.body;
  const review = await reviewService.createReview(eventId, rating, comment, req.user!.id);
  res.status(201).json(successResponse('Review created successfully', review));
});

export const getEventReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await reviewService.getEventReviews(req.params.eventId as string);
  res.status(200).json(successResponse('Reviews fetched successfully', reviews));
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.updateReview(req.params.id as string, req.body, req.user!.id);
  res.status(200).json(successResponse('Review updated successfully', review));
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  await reviewService.deleteReview(req.params.id as string, req.user!.id, req.user!.role);
  res.status(200).json(successResponse('Review deleted successfully'));
});
