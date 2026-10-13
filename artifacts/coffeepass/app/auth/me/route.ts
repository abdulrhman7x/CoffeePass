import { GET as handleGetCurrentUser } from "../../api/auth/me/route";

export const runtime = "nodejs";

export async function GET() {
  return handleGetCurrentUser();
}
