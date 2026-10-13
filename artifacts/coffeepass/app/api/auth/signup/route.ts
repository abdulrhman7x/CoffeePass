import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import {
  authFieldErrors,
  parseAuthBody,
  validateSignup,
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

  const parsed = validateSignup(parsedBody.body);
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
    const existingUser = await User.exists({ email: parsed.data.email });
    if (existingUser) {
      return Response.json(
        { error: "EMAIL_EXISTS" },
        { status: 409, headers: jsonHeaders },
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
    });

    const safeUser: SafeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };

    await setSessionCookie(user.id);
    return Response.json(
      { user: safeUser },
      { status: 201, headers: jsonHeaders },
    );
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return Response.json(
        { error: "EMAIL_EXISTS" },
        { status: 409, headers: jsonHeaders },
      );
    }
    return Response.json(
      { error: "SERVICE_UNAVAILABLE" },
      { status: 503, headers: jsonHeaders },
    );
  }
}
