import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Order from '@/app/models/Order';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all orders and populate with user data
    const orders = await Order.find({})
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

// Add ability to update order status
export async function PUT(request: Request) {
  try {
    const { orderId, status } = await request.json();
    await connectToDatabase();

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error('Failed to update order:', err);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
} 