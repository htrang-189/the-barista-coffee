import { NextResponse } from 'next/server';
import categories from '@/lib/api/mocks/categories.json';

export async function GET() {
  // Add delay to simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Add ETag header for cache validation
  const eTag = `"${Buffer.from(JSON.stringify(categories)).toString('base64').slice(0, 16)}"`;

  return NextResponse.json(categories, {
    headers: {
      'Cache-Control': 'public, max-age=86400', // 24 hours
      'ETag': eTag,
      'Content-Type': 'application/json',
    },
  });
}
