import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../jwt';
import { ApiError } from '../utils/apiError';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies.accessToken;

    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized, no token');
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, 'Not authorized, token failed'));
  }
};
