import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    console.log("=== Mock Music Creation Vote List API Called ===");

    // Get monthNumber from query parameters (optional)
    const { searchParams } = new URL(request.url);
    const monthNumber = searchParams.get("monthNumber");

    console.log("Mock API request details:", {
      monthNumber: monthNumber || "none",
      url: request.url,
    });

    // Mock data for testing voting functionality
    const mockMusics = [
      {
        id: 1,
        title: "Dream Music Superstar",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        scope: 150, // vote count
        status: 1,
        singer: "Nobody Artist #1",
        createTm: Date.now() - 86400000, // 1 day ago
        user: {
          id: 1,
          nickname: "MusicCreator1",
          avator: "/music/covers/artist1.jpg",
        },
      },
      {
        id: 2,
        title: "Melody of Dreams",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        scope: 89,
        status: 1,
        singer: "Nobody Artist #2",
        createTm: Date.now() - 172800000, // 2 days ago
        user: {
          id: 2,
          nickname: "DreamMelody",
          avator: "/music/covers/artist2.jpg",
        },
      },
      {
        id: 3,
        title: "Rhythm of the Night",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        scope: 203,
        status: 1,
        singer: "Nobody Artist #3",
        createTm: Date.now() - 259200000, // 3 days ago
        user: {
          id: 3,
          nickname: "NightRhythm",
          avator: "/music/covers/artist3.jpg",
        },
      },
      {
        id: 4,
        title: "Harmony in Motion",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        scope: 67,
        status: 1,
        singer: "Nobody Artist #4",
        createTm: Date.now() - 345600000, // 4 days ago
        user: {
          id: 4,
          nickname: "HarmonyMotion",
          avator: "/music/covers/artist4.jpg",
        },
      },
      {
        id: 5,
        title: "Echoes of Tomorrow",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        scope: 134,
        status: 1,
        singer: "Nobody Artist #5",
        createTm: Date.now() - 432000000, // 5 days ago
        user: {
          id: 5,
          nickname: "TomorrowEchoes",
          avator: "/music/covers/artist5.jpg",
        },
      },
      {
        id: 6,
        title: "Symphony of Stars",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        scope: 178,
        status: 1,
        singer: "Nobody Artist #6",
        createTm: Date.now() - 518400000, // 6 days ago
        user: {
          id: 6,
          nickname: "StarSymphony",
          avator: "/music/covers/artist6.jpg",
        },
      },
      {
        id: 7,
        title: "Crescendo of Hope",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        scope: 95,
        status: 1,
        singer: "Nobody Artist #7",
        createTm: Date.now() - 604800000, // 7 days ago
        user: {
          id: 7,
          nickname: "HopeCrescendo",
          avator: "/music/covers/artist7.jpg",
        },
      },
      {
        id: 8,
        title: "Ballad of the Brave",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        scope: 112,
        status: 1,
        singer: "Nobody Artist #8",
        createTm: Date.now() - 691200000, // 8 days ago
        user: {
          id: 8,
          nickname: "BraveBallad",
          avator: "/music/covers/artist8.jpg",
        },
      },
    ];

    console.log("Returning mock data:", {
      dataLength: mockMusics.length,
      firstItem: mockMusics[0],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Mock music creation vote list fetched successfully",
        data: mockMusics,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Mock music creation vote list fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch mock music creation vote list" },
      { status: 500 },
    );
  }
}
