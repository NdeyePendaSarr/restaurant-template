import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { reservations } from "@/db/schema";
import { AdminTable } from "@/components/AdminTable";
import { LogoutButton } from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const lignes = await getDb().select().from(reservations).orderBy(desc(reservations.creeLe));
  const enAttente = lignes.filter((r) => r.statut === "en_attente").length;

  return (
    <section className="section" style={{ paddingTop: "calc(var(--header-h) + 2rem)" }}>
      <div className="container">
        <div className="admin-head">
          <div>
            <p className="eyebrow">Espace équipe</p>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", marginTop: "0.4rem" }}>Réservations</h1>
            <p style={{ color: "var(--muted)" }}>{lignes.length} au total · {enAttente} en attente de confirmation</p>
          </div>
          <LogoutButton />
        </div>
        <AdminTable initiales={lignes} />
      </div>
    </section>
  );
}
