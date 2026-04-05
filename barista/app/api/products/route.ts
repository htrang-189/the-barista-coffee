import { NextResponse, NextRequest } from 'next/server';
import products from '@/lib/api/mocks/products.json';

export async function GET(request: NextRequest) {
  // Add delay to simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Get categoryId query parameter if provided
  const categoryId = request.nextUrl.searchParams.get('categoryId');

  // Filter products by category if provided
  const filteredProducts = categoryId
    ? products.filter((p) => p.categoryId === categoryId)
    : products;

  // Add ETag header for cache validation
  const eTag = `"${Buffer.from(JSON.stringify(filteredProducts)).toString('base64').slice(0, 16)}"`;

  return NextResponse.json(filteredProducts, {
    headers: {
      'Cache-Control': 'public, max-age=3600', // 1 hour
      'ETag': eTag,
      'Content-Type': 'application/json',
    },
  });
}
