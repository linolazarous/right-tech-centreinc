const { sequelize } = require('../services/database');
const User = require('../models/User');

const createAdminUser = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@righttechcentre.com',
      password: 'admin123', // You'll change this later
      role: 'admin',
      firstName: 'System',
      lastName: 'Administrator',
      isVerified: true
    });

    console.log('Admin user created successfully:');
    console.log('Email: admin@righttechcentre.com');
    console.log('Password: admin123');
    console.log('Please change the password immediately after login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
