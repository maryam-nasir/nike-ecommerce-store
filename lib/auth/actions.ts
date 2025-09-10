"use server";

import { cookies, headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { guests } from "@/lib/db/schema";
import { eq, and, lt } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const COOKIE_OPTIONS = {
  httpOnly: true as const,
  secure: true as const,
  sameSite: "strict" as const,
  path: "/" as const,
  maxAge: 60 * 60 * 24 * 7,
};

const signupSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, {
      message: "Password must contain at least one letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .trim(),
});

export async function signUp(formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const data = signupSchema.parse(rawData);

  const response = await auth.api.signUpEmail({
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
    },
  });

  await migrateGuestToUser();
  return { ok: true, userId: response.user?.id };
}

const signinSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z.string().min(1, { message: "Password is required." }),
});

export async function signIn(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const data = signinSchema.parse(rawData);

  const response = await auth.api.signInEmail({
    body: {
      email: data.email,
      password: data.password,
    },
  });

  await migrateGuestToUser();
  return { ok: true, userId: response.user?.id };
}

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user ?? null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function signOut() {
  await auth.api.signOut({ headers: {} });
  return { ok: true };
}

export async function createGuestSession() {
  const cookieStore = await cookies();
  const existingSessionToken = cookieStore.get("guest_session");

  if (existingSessionToken?.value) {
    return { ok: true, sessionToken: existingSessionToken.value };
  }

  const sessionToken = uuidv4();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + COOKIE_OPTIONS.maxAge * 1000); // 7 days

  await db.insert(guests).values({
    sessionToken,
    expiresAt,
  });

  cookieStore.set("guest_session", sessionToken, COOKIE_OPTIONS);
  return { ok: true, sessionToken };
}

export async function guestSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("guest_session")?.value;

  if (!sessionToken) {
    return { sessionToken: null };
  }

  const now = new Date();
  await db
    .delete(guests)
    .where(
      and(eq(guests.sessionToken, sessionToken), lt(guests.expiresAt, now))
    );

  return { sessionToken };
}

export async function mergeGuestCartWithUserCart() {
  await migrateGuestToUser();
  return { ok: true };
}

async function migrateGuestToUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("guest_session")?.value;
  if (!token) {
    return;
  }

  await db.delete(guests).where(eq(guests.sessionToken, token));
  cookieStore.delete("guest_session");
}
