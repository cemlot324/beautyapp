import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import User from '@/app/models/User';

interface MongoError extends Error {
  name: string;
  message: string;
  stack?: string;
}

export async function GET() {
  try {
    await connectToDatabase();
    console.log('MongoDB connected successfully');
    
    // Use Mongoose model instead of direct MongoDB access
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select('-password'); // Exclude password field
    
    console.log('Users found:', users.length);
    if (users.length > 0) {
      console.log('First user:', users[0]);
    }

    return NextResponse.json(users);
  } catch (err) {
    const mongoError = err as MongoError;
    console.error('MongoDB Error:', {
      name: mongoError.name || 'Unknown Error',
      message: mongoError.message || 'An error occurred',
      stack: mongoError.stack || ''
    });
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 