import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../models/user.model';
import { Event } from '../models/event.model';
import { hashPassword } from '../utils/hash';

const seedDatabase = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('Connected to DB for seeding...');

    await User.deleteMany();
    await Event.deleteMany();

    const hashedAdminPassword = await hashPassword('Password123!');
    const hashedUserPassword = await hashPassword('Password123!');

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@demo.com',
      password: hashedAdminPassword,
      role: 'user',
    });

    const siteUser = await User.create({
      name: 'Site User',
      email: 'siteuser@demo.com',
      password: hashedUserPassword,
      role: 'siteuser',
    });

    console.log('Users seeded');

    const sampleEvents = [
      {
        title: 'Tech Conference 2026',
        description: 'The biggest tech conference of the year.',
        category: 'Technology',
        location: 'San Francisco, CA',
        startDate: new Date('2026-09-10T09:00:00Z'),
        endDate: new Date('2026-09-12T17:00:00Z'),
        capacity: 1000,
        price: 299,
        status: 'published',
        createdBy: admin._id,
        properties: [
          { key: 'dress_code', label: 'Dress Code', type: 'select', value: 'Smart Casual', options: ['Casual', 'Smart Casual', 'Formal'] },
          { key: 'has_wifi', label: 'Wi-Fi Available', type: 'boolean', value: true },
        ],
      },
      {
        title: 'Local Music Festival',
        description: 'A weekend of great music and food.',
        category: 'Music',
        location: 'Austin, TX',
        startDate: new Date('2026-10-05T12:00:00Z'),
        endDate: new Date('2026-10-07T23:00:00Z'),
        capacity: 5000,
        price: 150,
        status: 'published',
        createdBy: admin._id,
        properties: [
          { key: 'age_limit', label: 'Age Limit', type: 'number', value: 18 },
          { key: 'camping', label: 'Camping Available', type: 'boolean', value: true },
        ],
      },
      {
        title: 'Art Exhibition',
        description: 'Modern art from local artists.',
        category: 'Art',
        location: 'New York, NY',
        startDate: new Date('2026-11-01T10:00:00Z'),
        endDate: new Date('2026-11-30T18:00:00Z'),
        capacity: 200,
        price: 20,
        status: 'published',
        createdBy: admin._id,
        properties: [
          { key: 'photography', label: 'Photography Allowed', type: 'boolean', value: false },
        ],
      },
      {
        title: 'Startup Pitch Night',
        description: 'Watch startups pitch to investors.',
        category: 'Business',
        location: 'Seattle, WA',
        startDate: new Date('2026-08-15T18:00:00Z'),
        endDate: new Date('2026-08-15T21:00:00Z'),
        capacity: 150,
        price: 0,
        status: 'published',
        createdBy: admin._id,
        properties: [
          { key: 'networking', label: 'Networking Session', type: 'boolean', value: true },
          { key: 'pitch_deadline', label: 'Pitch Submission Deadline', type: 'date', value: new Date('2026-08-01T23:59:59Z').toISOString() },
        ],
      },
      {
        title: 'Marathon 2026',
        description: 'Annual city marathon.',
        category: 'Sports',
        location: 'Chicago, IL',
        startDate: new Date('2026-10-10T07:00:00Z'),
        endDate: new Date('2026-10-10T14:00:00Z'),
        capacity: 10000,
        price: 50,
        status: 'draft',
        createdBy: admin._id,
        properties: [
          { key: 'tshirt_included', label: 'T-Shirt Included', type: 'boolean', value: true },
          { key: 'distance_km', label: 'Distance (km)', type: 'number', value: 42.2 },
        ],
      },
    ];

    await Event.insertMany(sampleEvents);
    console.log('Events seeded');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDatabase();
