import { Role } from '../types';

export interface JwtPayload {
  id: string;
  role: Role;
}
