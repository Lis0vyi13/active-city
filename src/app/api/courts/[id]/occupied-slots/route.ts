import { NextResponse } from "next/server";

import { getOccupiedTimeSlotsForCourt } from "@/entities/booking/api/court-occupancy";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id: courtId } = await params;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const slots = await getOccupiedTimeSlotsForCourt(courtId, date);

  return NextResponse.json({ slots });
}
