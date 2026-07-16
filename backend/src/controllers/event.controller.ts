import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as eventService from '../services/event.service';
import { successResponse } from '../utils/apiResponse';
import { getPaginationOptions } from '../utils/pagination';

export const getAllEvents = asyncHandler(async (req: Request, res: Response) => {
  const { skip, limit, page } = getPaginationOptions(req.query);
  const result = await eventService.getEvents(req.query, skip, limit);
  res.status(200).json(successResponse('Events fetched successfully', {
    ...result,
    page,
    limit,
  }));
});

export const getEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.getEventById(req.params.id as string);
  res.status(200).json(successResponse('Event fetched successfully', event));
});

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.createEvent(req.body, req.user!.id);
  res.status(201).json(successResponse('Event created successfully', event));
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.updateEvent(req.params.id as string, req.body, req.user!.id);
  res.status(200).json(successResponse('Event updated successfully', event));
});

export const updateEventStatus = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.updateEventStatus(req.params.id as string, req.body.status, req.user!.id);
  res.status(200).json(successResponse('Event status updated successfully', event));
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  await eventService.deleteEvent(req.params.id as string, req.user!.id);
  res.status(200).json(successResponse('Event deleted successfully'));
});

export const getMyAdminEvents = asyncHandler(async (req: Request, res: Response) => {
  const { skip, limit, page } = getPaginationOptions(req.query);
  const result = await eventService.getAdminEvents(req.user!.id, skip, limit);
  res.status(200).json(successResponse('Admin events fetched successfully', {
    ...result,
    page,
    limit,
  }));
});
