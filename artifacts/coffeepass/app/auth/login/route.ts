import { POST as handleLogin } from "../../api/auth/login/route";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleLogin(request);
}
