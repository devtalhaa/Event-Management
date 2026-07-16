import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { Role } from '../types';

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'User role is not authorized to access this route'));
    }
    next();
  };
};
