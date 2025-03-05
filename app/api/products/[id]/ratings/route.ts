import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Rating from '@/app/models/Rating';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  
  try {
    await connectToDatabase();
    const ratings = await Rating.find({ productId })
      .sort({ createdAt: -1 });
    
    return NextResponse.json(ratings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  
  try {
    const { rating, review, userName } = await request.json();
    
    if (!userName) {
      return NextResponse.json(
        { error: 'Please provide your name' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    const newRating = await Rating.create({
      productId,
      rating,
      review,
      userName,
    });

    return NextResponse.json(newRating);
  } catch (error) {
    console.error('Rating creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create rating' },
      { status: 500 }
    );
  }
} 