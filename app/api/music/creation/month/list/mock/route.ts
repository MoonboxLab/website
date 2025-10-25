import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    console.log("=== Mock Music Creation Month List API Called ===");

    // Mock data for testing - return some recent months
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11

    // Generate event IDs for the last 6 months
    const mockEventIds = [];
    for (let i = 0; i < 6; i++) {
      const month = currentMonth - i;
      const year = month <= 0 ? currentYear - 1 : currentYear;
      const adjustedMonth = month <= 0 ? month + 12 : month;
      const eventId = year * 12 + adjustedMonth;
      mockEventIds.push(eventId);
    }

    console.log("Returning mock event IDs:", mockEventIds);

    return NextResponse.json(
      {
        success: true,
        message: "Mock music creation month list fetched successfully",
        data: mockEventIds,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Mock music creation month list fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch mock music creation month list" },
      { status: 500 },
    );
  }
}
