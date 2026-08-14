import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { reservations } from "@/db/schema";
import { estAdmin } from "@/lib/auth";

const patchSchema = z.object({
  statut: z.enum(["en_attente", "confirmee", "annulee"]),
});

/** Admin : met à jour le statut d'une réservation. */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await estAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const num = Number(id);
  if (!Number.isInteger(num) || num < 1) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 422 });
  }

  const [maj] = await getDb()
    .update(reservations)
    .set({ statut: parsed.data.statut })
    .where(eq(reservations.id, num))
    .returning({ id: reservations.id });

  if (!maj) {
    return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
