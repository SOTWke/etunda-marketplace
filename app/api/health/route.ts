import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Check backend API health
    const apiHealth = await fetch("http://localhost:3001/health", {
      cache: "no-store",
    }).catch(() => ({ ok: false }));

    if (apiHealth.ok) {
      return NextResponse.json({ status: "ok", api: "healthy" }, { status: 200 });
    } else {
      return NextResponse.json(
        { status: "degraded", api: "unhealthy" },
        { status: 503 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: String(error) },
      { status: 500 }
    );
  }
}
