import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const COOKIE = "teranga_admin";
const ALG = "HS256";

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error("AUTH_SECRET manquant ou trop court (16+ caractères).");
  }
  return new TextEncoder().encode(s);
}

/** Vérifie le mot de passe admin (comparaison à longueur constante). */
export function motDePasseValide(saisi: string): boolean {
  const attendu = process.env.ADMIN_PASSWORD ?? "";
  if (attendu.length === 0 || saisi.length !== attendu.length) return false;
  let diff = 0;
  for (let i = 0; i < attendu.length; i++) {
    diff |= saisi.charCodeAt(i) ^ attendu.charCodeAt(i);
  }
  return diff === 0;
}

/** Émet un jeton de session signé (valable 8 h). */
export async function creerSession(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret());
}

/** Vérifie un jeton ; renvoie true s'il est valide et non expiré. */
export async function sessionValide(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: [ALG] });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** Lit le cookie de session côté serveur et confirme l'accès admin. */
export async function estAdmin(): Promise<boolean> {
  const jar = await cookies();
  return sessionValide(jar.get(COOKIE)?.value);
}
