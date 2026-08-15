import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { reservations } from "@/db/schema";
import { reservationSchema } from "@/lib/validation";
import { estAdmin } from "@/lib/auth";
import { notifierDemandeRecue } from "@/lib/email";

/** Public : enregistre une demande de réservation. */
export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const parsed = reservationSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Champs invalides.", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { message, ...reste } = parsed.data;
  // Renvoie la ligne complète : on a besoin de l'email et des détails pour
  // l'accusé de réception.
  const [creee] = await getDb()
    .insert(reservations)
    .values({ ...reste, message: message || null })
    .returning();

  // Email au client confirmant la bonne réception de sa demande. Non
  // bloquant : un échec d'envoi ne compromet pas l'enregistrement.
  await notifierDemandeRecue(creee);

  return NextResponse.json({ ok: true, id: creee.id }, { status: 201 });
}

/** Admin : liste les réservations, les plus récentes d'abord. */
export async function GET() {
  if (!(await estAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const lignes = await getDb()
    .select()
    .from(reservations)
    .orderBy(desc(reservations.creeLe));
  return NextResponse.json({ reservations: lignes });
}