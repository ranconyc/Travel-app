import { NextRequest, NextResponse } from 'next/server';

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  description: string;
  user: {
    name: string;
    username: string;
  };
}

interface UnsplashResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const orientation = searchParams.get('orientation') || 'landscape';
    const category = searchParams.get('category') || '';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
    
    if (!ACCESS_KEY) {
      console.error('Unsplash API key not configured');
      return NextResponse.json(
        { error: 'Image service not configured' },
        { status: 500 }
      );
    }

    // Build search query with category for better results
    const searchQuery = category ? `${query} ${category}` : query;

    const response = await fetch(
      `https://api.unsplash.com/search/photos?` +
      new URLSearchParams({
        query: searchQuery,
        per_page: '1',
        orientation,
        content_filter: 'high',
        order_by: 'relevant',
      }),
      {
        headers: {
          'Authorization': `Client-ID ${ACCESS_KEY}`,
          'Accept-Version': 'v1',
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      console.error('Unsplash API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: 500 }
      );
    }

    const data: UnsplashResponse = await response.json();
    
    if (data.results.length === 0) {
      return NextResponse.json(
        { error: 'No images found', imageUrl: null },
        { status: 404 }
      );
    }

    const photo = data.results[0];
    console.log(`Found Unsplash image for "${searchQuery}": ${photo.description}`);

    return NextResponse.json({
      imageUrl: photo.urls.regular,
      description: photo.description,
      photographer: photo.user.name,
      photographerUrl: `https://unsplash.com/@${photo.user.username}`,
      attribution: `Photo by ${photo.user.name} on Unsplash`
    });

  } catch (error) {
    console.error('Error in Unsplash API route:', error);
    return NextResponse.json(
      { error: 'Internal server error', imageUrl: null },
      { status: 500 }
    );
  }
}
