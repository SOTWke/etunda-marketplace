import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return NextResponse.json(
        {
          status: "ok",
          api: "not-configured",
          mode: "frontend-only",
          message: "No backend URL configured; Vercel frontend is running in demo mode.",
        },
        { status: 200 }
      );
    }

    const target = new URL("/health", apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`);
    const apiHealth = await fetch(target.toString(), {
      cache: "no-store",
      headers: {
        "x-health-check": "vercel",
      },
    }).catch(() => null);

    if (apiHealth?.ok) {
      return NextResponse.json({ status: "ok", api: "healthy", mode: "integrated" }, { status: 200 });
    }

    return NextResponse.json(
      { status: "degraded", api: "unhealthy", mode: "integrated" },
      { status: 503 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
