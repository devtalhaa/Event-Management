import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createBookingSchema, cancelBookingSchema } from '../validators/booking.validator';

const router = Router();

router.use(authMiddleware);

// Site user routes
router.post('/', authorize('siteuser'), validate(createBookingSchema), bookingController.createBooking);
router.get('/my', authorize('siteuser'), bookingController.getMyBookings);
router.patch('/:id/cancel', authorize('siteuser'), validate(cancelBookingSchema), bookingController.cancelBooking);

// Admin routes for a specific event's bookings
// The route path starts with /api/bookings, but event owner needs to view bookings for their event.
// Instead of /api/events/:id/bookings here, we handle it if mounted on /api/events or just expose it.
// Wait, prompt said GET /events/:id/bookings is for 'user' only.
// Let's keep it here but route it via /events or direct. We will mount this in the main aggregator.
router.get('/event/:id', authorize('user'), bookingController.getEventBookings);

export default router;
