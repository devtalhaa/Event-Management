import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as userService from '../services/user.service';
import { successResponse } from '../utils/apiResponse';

export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.user!.id);
  res.status(200).json(successResponse('User profile fetched successfully', user));
});
