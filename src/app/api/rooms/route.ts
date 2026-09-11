import { NextRequest, NextResponse } from 'next/server';
import { searchRooms } from '@/lib/rooms';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const guestsParam = searchParams.get('guests');
  const maxPriceParam = searchParams.get('maxPrice');
  const amenitiesParam = searchParams.get('amenities');
  const hotelId = searchParams.get('hotelId') || undefined;
  const location = searchParams.get('location') || undefined;

  const guests = guestsParam ? parseInt(guestsParam, 10) : undefined;
  const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;
  const amenities = amenitiesParam ? amenitiesParam.split(',').filter(Boolean) : undefined;

  const rooms = await searchRooms({ guests, maxPrice, amenities, hotelId, location });
  return NextResponse.json(rooms);
}
