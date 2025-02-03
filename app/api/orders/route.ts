import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Order from '@/app/models/Order';
import User from '@/app/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    const user = await User.findOne({ /* add your user identification logic */ });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const orders = await Order.find({ userId: user._id })
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    const user = await User.findOne({ /* add your user identification logic */ });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const order = await Order.create({
      ...body,
      userId: user._id,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error('Failed to create order:', err);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 