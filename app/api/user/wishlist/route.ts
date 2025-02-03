import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import User from '@/app/models/User';

// Add interface for wishlist item
interface WishlistItem {
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
}

export async function GET() {
  try {
    await connectToDatabase();
    const user = await User.findOne({ /* add your user identification logic */ });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.wishlist || []);
  } catch (err) { // Rename error to err since we're using it
    console.error('Failed to fetch wishlist:', err);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, title, price, imageUrl } = body;

    await connectToDatabase();
    const user = await User.findOne({ /* add your user identification logic */ });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Initialize wishlist if it doesn't exist
    if (!user.wishlist) {
      user.wishlist = [];
    }

    // Check if product already exists in wishlist
    const existingItem = user.wishlist.find((item: WishlistItem) => item.productId === productId);
    if (!existingItem) {
      user.wishlist.push({ productId, title, price, imageUrl });
      await user.save();
    }

    return NextResponse.json(user.wishlist);
  } catch (err) {
    console.error('Failed to update wishlist:', err);
    return NextResponse.json(
      { error: 'Failed to update wishlist' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findOne({ /* add your user identification logic */ });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.wishlist = user.wishlist.filter((item: WishlistItem) => item.productId !== productId);
    await user.save();

    return NextResponse.json(user.wishlist);
  } catch (err) {
    console.error('Failed to remove from wishlist:', err);
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
} 