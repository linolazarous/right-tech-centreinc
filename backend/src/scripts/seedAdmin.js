import mongoose from 'mongoose';
import User from '../models/User.js';
import 'dotenv/config';

const seedAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || process.env.DATABASE_URL);
    console.log('Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@righttechcentre.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const adminUser = new User({
      email: 'admin@righttechcentre.com',
      password: process.env.ADMIN_PASSWORD || 'admin123', // Use env variable
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@righttechcentre.com');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedAdmin();
