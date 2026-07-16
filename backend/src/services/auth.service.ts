import { User } from '../models/user.model';
import { ApiError } from '../utils/apiError';
import { hashPassword, comparePassword } from '../utils/hash';
import { signAccessToken, signRefreshToken } from '../jwt';

export const registerUser = async (data: any) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new ApiError(400, 'User already exists');
  }

  const hashedPassword = await hashPassword(data.password);
  
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role || 'siteuser',
  });

  const payload = { id: user._id.toString(), role: user.role as 'user' | 'siteuser' };
  
  return {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

export const loginUser = async (data: any) => {
  const user = await User.findOne({ email: data.email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await comparePassword(data.password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const payload = { id: user._id.toString(), role: user.role as 'user' | 'siteuser' };

  return {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

export const refreshAuthToken = async (token: string, decoded: any) => {
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, 'User not found');
  }
  
  const payload = { id: user._id.toString(), role: user.role as 'user' | 'siteuser' };
  return signAccessToken(payload);
};
