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
    const productData = await request.json();
    
    // Clean up empty strings to undefined for optional fields
    const cleanedData = {
      ...productData,
      ingredients: productData.ingredients || undefined,
      volume: productData.volume || undefined,
      howToUse: productData.howToUse || undefined,
      benefits: productData.benefits || undefined,
      skinType: productData.skinType?.length ? productData.skinType : undefined,
    };

    await connectToDatabase();

    const product = await Product.create(cleanedData);
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    // Log the full error for debugging
    console.log('Full error:', JSON.stringify(error, null, 2));
    
    return NextResponse.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 }
    );
  }
} 