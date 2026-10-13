import { POST as handleLogout } from "../../api/auth/logout/route";

export const runtime = "nodejs";

export async function POST() {
  return handleLogout();
}
