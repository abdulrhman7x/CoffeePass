import { POST as handleSignup } from "../../api/auth/signup/route";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleSignup(request);
}
