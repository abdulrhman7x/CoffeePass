import "server-only";

import { z } from "zod";

const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "NAME_TOO_SHORT")
      .max(80, "NAME_TOO_LONG"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(254, "EMAIL_INVALID")
      .email("EMAIL_INVALID"),
    password: z
      .string()
      .min(8, "PASSWORD_TOO_SHORT")
      .refine(
        (value) => new TextEncoder().encode(value).length <= 72,
        "PASSWORD_TOO_LONG",
      ),
  })
  .strict();

const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(254, "EMAIL_INVALID")
      .email("EMAIL_INVALID"),
    password: z
      .string()
      .min(1, "PASSWORD_REQUIRED")
      .refine(
        (value) => new TextEncoder().encode(value).length <= 72,
        "PASSWORD_TOO_LONG",
      ),
  })
  .strict();

export async function parseAuthBody(request: Request) {
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).length > 4_096) {
      return { ok: false as const, status: 413 as const };
    }

    const body: unknown = JSON.parse(rawBody);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return { ok: false as const, status: 400 as const };
    }
    return { ok: true as const, body };
  } catch {
    return { ok: false as const, status: 400 as const };
  }
}

export function validateSignup(input: unknown) {
  return signupSchema.safeParse(input);
}

export function validateLogin(input: unknown) {
  return loginSchema.safeParse(input);
}

export function authFieldErrors(
  issues: { path: PropertyKey[]; message: string }[],
) {
  const fields: Record<string, string> = {};
  for (const issue of issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in fields)) {
      fields[field] = issue.message;
    }
  }
  return fields;
}
