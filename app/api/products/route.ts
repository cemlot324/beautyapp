import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Product from '@/app/models/Product';

export async function GET() {
  try {
    await connectToDatabase();
    console.log('Connected to database');
    
    const products = await Product.find({})
      .sort({ createdAt: -1 });
    
    console.log('Products found:', products.length);
    if (products.length > 0) {
      console.log('Sample product:', products[0]);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 