import { Router } from 'express';
import * as eventController from '../controllers/event.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createEventSchema, updateEventSchema, updateEventStatusSchema } from '../validators/event.validator';

const router = Router();

// Public routes (or auth depending on requirements, user said "public/auth", will allow public to view published)
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);

// Admin / User routes
router.use(authMiddleware);
router.get('/admin/mine', authorize('user'), eventController.getMyAdminEvents);
router.post('/', authorize('user'), validate(createEventSchema), eventController.createEvent);
router.put('/:id', authorize('user'), validate(updateEventSchema), eventController.updateEvent);
router.patch('/:id/status', authorize('user'), validate(updateEventStatusSchema), eventController.updateEventStatus);
router.delete('/:id', authorize('user'), eventController.deleteEvent);

export default router;
