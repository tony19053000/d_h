import { NextRequest, NextResponse } from 'next/server';
import { checkAvailability } from '@/lib/availability';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';

  const availability = await checkAvailability(id, checkIn, checkOut);
  return NextResponse.json(availability);
}
