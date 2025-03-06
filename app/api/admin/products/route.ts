import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Product from '@/app/models/Product';

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.time('productCreation');
    const productData = await request.json();
    
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connected');

    console.log('Creating product...');
    const product = await Product.create(productData);
    console.log('Product created');
    
    console.timeEnd('productCreation');
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 }
    );
  }
} 