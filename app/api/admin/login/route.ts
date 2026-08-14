import { NextResponse } from "next/server";
import { COOKIE, creerSession, motDePasseValide } from "@/lib/auth";

export async function POST(req: Request) {
  const { motDePasse } = await req.json().catch(() => ({ motDePasse: "" }));

  if (!motDePasseValide(String(motDePasse ?? ""))) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await creerSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 h
  });
  return res;
}
