import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import {
  authFieldErrors,
  parseAuthBody,
  validateLogin,
} from "@/lib/auth-input";
import { setSessionCookie, type SafeUser } from "@/lib/auth";
import { User } from "@/models/User";

export const runtime = "nodejs";

const jsonHeaders = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  const parsedBody = await parseAuthBody(request);
  if (!parsedBody.ok) {
    return Response.json(
      { error: parsedBody.status === 413 ? "BODY_TOO_LARGE" : "INVALID_INPUT" },
      { status: parsedBody.status, headers: jsonHeaders },
    );
  }

  const parsed = validateLogin(parsedBody.body);
  if (!parsed.success) {
    return Response.json(
      {
        error: "INVALID_INPUT",
        fields: authFieldErrors(parsed.error.issues),
      },
      { status: 400, headers: jsonHeaders },
    );
  }

  try {
    await connectDB();
    const user = await User.findOne({ email: parsed.data.email })
      .select("+passwordHash")
      .exec();

    if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
      return Response.json(
        { error: "INVALID_CREDENTIALS" },
        { status: 401, headers: jsonHeaders },
      );
    }

    const safeUser: SafeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };

    await setSessionCookie(user.id);
    return Response.json({ user: safeUser }, { headers: jsonHeaders });
  } catch {
    return Response.json(
      { error: "SERVICE_UNAVAILABLE" },
      { status: 503, headers: jsonHeaders },
    );
  }
}
