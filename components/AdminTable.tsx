"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Reservation } from "@/db/schema";

const LABEL: Record<Reservation["statut"], string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  annulee: "Annulée",
};

type Filtre = Reservation["statut"] | "toutes";

export function AdminTable({ initiales }: { initiales: Reservation[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initiales);
  const [filtre, setFiltre] = useState<Filtre>("toutes");
  const [busy, setBusy] = useState<number | null>(null);

  const visibles = useMemo(
    () => (filtre === "toutes" ? rows : rows.filter((r) => r.statut === filtre)),
    [rows, filtre]
  );

  async function changer(id: number, statut: Reservation["statut"]) {
    setBusy(id);
    const res = await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    setBusy(null);
    if (res.ok) setRows((prev) => prev.map((r) => (r.id === id ? { ...r, statut } : r)));
    else router.refresh();
  }

  return (
    <>
      <div className="filters" style={{ justifyContent: "flex-start" }}>
        {(["toutes", "en_attente", "confirmee", "annulee"] as Filtre[]).map((f) => (
          <button
            key={f}
            type="button"
            className={`filter-btn ${filtre === f ? "active" : ""}`}
            onClick={() => setFiltre(f)}
          >
            {f === "toutes" ? "Toutes" : LABEL[f]}
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <p className="empty-state">Aucune réservation.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date · Heure</th>
                <th>Client</th>
                <th>Contact</th>
                <th>Pers.</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.date}</strong> · {r.heure}</td>
                  <td>
                    {r.prenom} {r.nom}
                    {r.message ? <div style={{ color: "var(--muted)", fontSize: "0.82rem" }}>{r.message}</div> : null}
                  </td>
                  <td>
                    <a href={`tel:${r.telephone}`}>{r.telephone}</a>
                    <div style={{ color: "var(--muted)", fontSize: "0.82rem" }}>{r.email}</div>
                  </td>
                  <td>{r.personnes}</td>
                  <td><span className={`badge ${r.statut}`}>{LABEL[r.statut]}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button type="button" className="btn-mini" disabled={busy === r.id || r.statut === "confirmee"} onClick={() => changer(r.id, "confirmee")}>
                        Confirmer
                      </button>
                      <button type="button" className="btn-mini" disabled={busy === r.id || r.statut === "annulee"} onClick={() => changer(r.id, "annulee")}>
                        Annuler
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
