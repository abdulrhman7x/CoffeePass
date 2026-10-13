import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  await clearSessionCookie();
  return Response.json(
    { success: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
