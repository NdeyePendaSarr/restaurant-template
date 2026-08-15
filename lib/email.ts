import type { Reservation } from "@/db/schema";
import { site } from "@/content/site";

const KEY = process.env.BREVO_API_KEY;
// Adresse expéditeur VÉRIFIÉE dans Brevo (Senders). Le nom affiché par défaut
// reprend le nom du restaurant.
const FROM_EMAIL = process.env.EMAIL_FROM;
const FROM_NAME = process.env.EMAIL_FROM_NAME ?? site.nom;

/** "2026-08-20" → "20 août 2026". */
function jolieDate(iso: string): string {
  const mois = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ];
  const [a, m, j] = iso.split("-").map(Number);
  return `${j} ${mois[m - 1]} ${a}`;
}

function gabarit(r: Reservation, confirmee: boolean): string {
  const or = "#a86518";
  const charcoal = "#17211c";
  const titre = confirmee ? "Votre table est confirmée ✅" : "Réservation annulée";
  const intro = confirmee
    ? `Bonne nouvelle ${r.prenom} — nous vous attendons !`
    : `Bonjour ${r.prenom}, votre réservation n'a malheureusement pas pu être retenue.`;
  const clore = confirmee
    ? "Au plaisir de vous recevoir. En cas d'empêchement, prévenez-nous."
    : "Pour trouver un autre créneau, répondez à cet email ou écrivez-nous sur WhatsApp.";

  return `<!doctype html><html lang="fr"><body style="margin:0;background:#faf5ec;font-family:Arial,Helvetica,sans-serif;color:${charcoal}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf5ec;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #efe4d2">
        <tr><td style="background:${charcoal};padding:24px 28px">
          <span style="color:#fff;font-size:20px;font-weight:700">${site.nom.split(" ")[0]} <span style="color:${or}">${site.nom.split(" ").slice(1).join(" ")}</span></span>
        </td></tr>
        <tr><td style="padding:28px">
          <h1 style="margin:0 0 12px;font-size:22px;color:${charcoal}">${titre}</h1>
          <p style="margin:0 0 20px;line-height:1.6">${intro}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf5ec;border-radius:12px;padding:16px;margin-bottom:20px">
            <tr><td style="padding:6px 12px;color:#8a7d6f;font-size:13px">Date</td><td style="padding:6px 12px;font-weight:700;text-align:right">${jolieDate(r.date)}</td></tr>
            <tr><td style="padding:6px 12px;color:#8a7d6f;font-size:13px">Heure</td><td style="padding:6px 12px;font-weight:700;text-align:right">${r.heure}</td></tr>
            <tr><td style="padding:6px 12px;color:#8a7d6f;font-size:13px">Personnes</td><td style="padding:6px 12px;font-weight:700;text-align:right">${r.personnes}</td></tr>
          </table>
          <p style="margin:0 0 8px;line-height:1.6">${clore}</p>
          <p style="margin:20px 0 0;font-size:13px;color:#8a7d6f">${site.nom} · ${site.adresseDetail}<br>${site.telephone}</p>
        </td></tr>
      </table>
      <p style="max-width:520px;margin:16px auto 0;font-size:12px;color:#8a7d6f">Cet email vous est envoyé suite à votre demande de réservation chez ${site.nom}.</p>
    </td></tr>
  </table></body></html>`;
}

/**
 * Notifie le client par email (Brevo) d'un changement de statut. Ne lève
 * jamais : un échec d'envoi ne doit pas faire échouer l'action admin (on
 * logge). N'envoie que pour "confirmee" / "annulee".
 */
export async function notifierClient(r: Reservation): Promise<void> {
  if (r.statut !== "confirmee" && r.statut !== "annulee") return;
  if (!KEY || !FROM_EMAIL) {
    console.warn("[email] BREVO_API_KEY ou EMAIL_FROM absent — email non envoyé.");
    return;
  }

  const confirmee = r.statut === "confirmee";
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: FROM_NAME, email: FROM_EMAIL },
        to: [{ email: r.email, name: `${r.prenom} ${r.nom}` }],
        subject: confirmee
          ? `Réservation confirmée — ${site.nom}`
          : `Réservation annulée — ${site.nom}`,
        htmlContent: gabarit(r, confirmee),
      }),
    });
    if (!res.ok) {
      console.error("[email] Brevo a répondu", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[email] envoi échoué :", err);
  }
}
