import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    console.log('Connected to database');
    
    const users = await User.find({})
      .select('-password') // Exclude password from the response
      .sort({ createdAt: -1 });
    
    console.log('Users found:', users.length);
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 