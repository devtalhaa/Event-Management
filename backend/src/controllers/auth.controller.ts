import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as authService from '../services/auth.service';
import * as userService from '../services/user.service';
import { successResponse } from '../utils/apiResponse';
import { verifyRefreshToken } from '../jwt';
import { ApiError } from '../utils/apiError';

const setCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000, // 15 mins
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  setCookies(res, result.accessToken, result.refreshToken);
  res.status(201).json(successResponse('User registered successfully', { user: result.user, accessToken: result.accessToken }));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  setCookies(res, result.accessToken, result.refreshToken);
  res.status(200).json(successResponse('Logged in successfully', { user: result.user, accessToken: result.accessToken }));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json(successResponse('Logged out successfully'));
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new ApiError(401, 'No refresh token provided');

  const decoded = verifyRefreshToken(token);
  const newAccessToken = await authService.refreshAuthToken(token, decoded);
  
  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json(successResponse('Token refreshed successfully', { accessToken: newAccessToken }));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.user!.id);
  res.status(200).json(successResponse('Current user fetched successfully', user));
});
