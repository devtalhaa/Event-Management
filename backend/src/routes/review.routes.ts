import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createReviewSchema, updateReviewSchema } from '../validators/review.validator';

const router = Router();

// Public
router.get('/event/:eventId', reviewController.getEventReviews);

// Auth
router.use(authMiddleware);
router.post('/', authorize('siteuser'), validate(createReviewSchema), reviewController.createReview);
router.put('/:id', authorize('siteuser'), validate(updateReviewSchema), reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview); // Role check handled in service

export default router;
