import { Event } from '../models/event.model';
import { ApiError } from '../utils/apiError';

export const getEvents = async (query: any, skip: number, limit: number) => {
  const filter: any = { status: 'published' };
  if (query.category) filter.category = query.category;
  if (query.search) filter.$text = { $search: query.search as string };

  const [events, total] = await Promise.all([
    Event.find(filter).skip(skip).limit(limit).populate('createdBy', 'name email').sort({ startDate: 1 }),
    Event.countDocuments(filter),
  ]);

  return { events, total };
};

export const getEventById = async (id: string) => {
  const event = await Event.findById(id).populate('createdBy', 'name email').populate('reviews');
  if (!event) throw new ApiError(404, 'Event not found');

  // Compute average rating
  const eventObj = event.toObject() as any;
  if (eventObj.reviews && eventObj.reviews.length > 0) {
    const sum = eventObj.reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
    eventObj.averageRating = sum / eventObj.reviews.length;
    eventObj.reviewCount = eventObj.reviews.length;
  } else {
    eventObj.averageRating = 0;
    eventObj.reviewCount = 0;
  }
  // Exclude reviews array from basic detail fetch unless needed, but requirement said: "all fixed fields, all custom properties... review list with avg rating"
  return eventObj;
};

export const createEvent = async (data: any, userId: string) => {
  const event = await Event.create({ ...data, createdBy: userId });
  return event;
};

export const updateEvent = async (id: string, data: any, userId: string) => {
  const event = await Event.findById(id);
  if (!event) throw new ApiError(404, 'Event not found');
  
  if (event.createdBy.toString() !== userId) {
    throw new ApiError(403, 'Not authorized to update this event');
  }

  const updated = await Event.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  return updated;
};

export const updateEventStatus = async (id: string, status: string, userId: string) => {
  return updateEvent(id, { status }, userId);
};

export const deleteEvent = async (id: string, userId: string) => {
  const event = await Event.findById(id);
  if (!event) throw new ApiError(404, 'Event not found');
  
  if (event.createdBy.toString() !== userId) {
    throw new ApiError(403, 'Not authorized to delete this event');
  }

  await event.deleteOne();
  return null;
};

export const getAdminEvents = async (userId: string, skip: number, limit: number) => {
  const filter = { createdBy: userId };
  const [events, total] = await Promise.all([
    Event.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Event.countDocuments(filter),
  ]);
  return { events, total };
};
