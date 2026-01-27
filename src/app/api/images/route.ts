import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const orientation = searchParams.get('orientation') || 'landscape';
    const category = searchParams.get('category') || 'travel';
    const fallback = searchParams.get('fallback') === 'true';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Try Unsplash first
    try {
      const unsplashResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/images/unsplash?` +
        new URLSearchParams({
          query,
          orientation,
          category,
        }),
        { next: { revalidate: 3600 } }
      );

      if (unsplashResponse.ok) {
        const data = await unsplashResponse.json();
        if (data.imageUrl) {
          return NextResponse.json({
            ...data,
            source: 'unsplash'
          });
        }
      }
    } catch (error) {
      console.warn('Unsplash failed, trying fallback:', error);
    }

    // Fallback to Pexels if enabled
    if (fallback) {
      try {
        const pexelsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/images/pexels?` +
          new URLSearchParams({
            query,
            orientation,
          }),
          { next: { revalidate: 3600 } }
        );

        if (pexelsResponse.ok) {
          const data = await pexelsResponse.json();
          if (data.imageUrl) {
            return NextResponse.json({
              ...data,
              source: 'pexels'
            });
          }
        }
      } catch (error) {
        console.warn('Pexels fallback failed:', error);
      }
    }

    return NextResponse.json(
      { error: 'No images found', imageUrl: null },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error in unified image API route:', error);
    return NextResponse.json(
      { error: 'Internal server error', imageUrl: null },
      { status: 500 }
    );
  }
}
