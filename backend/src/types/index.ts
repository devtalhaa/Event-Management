export type Role = 'user' | 'siteuser';
export type PropertyType = 'text' | 'number' | 'boolean' | 'date' | 'select';
export type EventStatus = 'draft' | 'published';
export type BookingStatus = 'confirmed' | 'cancelled';

export interface EventProperty {
  key: string;
  label: string;
  type: PropertyType;
  value: string | number | boolean;
  options?: string[];
}
