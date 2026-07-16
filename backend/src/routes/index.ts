import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import eventRoutes from './event.routes';
import bookingRoutes from './booking.routes';
import reviewRoutes from './review.routes';
import * as bookingController from '../controllers/booking.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);

// Specific nested route for GET /events/:id/bookings as per prompt
router.get('/events/:id/bookings', authMiddleware, authorize('user'), bookingController.getEventBookings);

export default router;
