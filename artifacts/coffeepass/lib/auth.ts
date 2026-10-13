import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { SignJWT, jwtVerify } from "jose";
import { User } from "@/models/User";
import { connectDB } from "./db";

const SESSION_COOKIE = "coffeepass_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const JWT_ALGORITHM = "HS256";

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

function signingKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET is missing or too short.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(userId: string) {
  return new SignJWT({})
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(signingKey());
}

async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, signingKey(), {
      algorithms: [JWT_ALGORITHM],
    });
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(userId: string) {
  const token = await createSessionToken(userId);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    priority: "high",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export const getAuthenticatedUser = cache(
  async (): Promise<SafeUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const userId = await verifySessionToken(token);
  if (!userId) return null;

  await connectDB();
  const user = await User.findById(userId).select("name email createdAt").exec();
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
  },
);
