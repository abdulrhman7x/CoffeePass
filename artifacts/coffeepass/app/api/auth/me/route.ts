import { getAuthenticatedUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return Response.json(
        { error: "UNAUTHENTICATED" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    return Response.json(
      { user },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "SERVICE_UNAVAILABLE" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
