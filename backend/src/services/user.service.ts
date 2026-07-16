import { User } from '../models/user.model';
import { ApiError } from '../utils/apiError';

export const getUserById = async (id: string) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};
