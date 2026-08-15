import type { Metadata } from "next";
import { site } from "@/content/site";
import { ReservationForm } from "@/components/ReservationForm";
import { RestaurantMap } from "@/components/RestaurantMap";

export const metadata: Metadata = {
  title: "Réserver une table",
  description: `Réservez votre table chez ${site.nom} en ligne. Confirmation rapide par téléphone ou WhatsApp.`,
};

export default function ReservationPage() {
  return (
    <>
      <div className="page-top container reveal">
        <p className="eyebrow">Réservation</p>
        <h1>Réserver une table</h1>
        <p>Remplissez le formulaire. Nous confirmons en général sous quelques heures.</p>
      </div>

      <section className="section" style={{ paddingTop: "0.5rem" }}>
        <div className="container">
          <ReservationForm />

          <div className="contact-aside reveal" style={{ transitionDelay: "0.15s" }}>
            <div className="contact-pill">
              <p className="label">Téléphone</p>
              <a href={`tel:${site.telephone.replace(/\s/g, "")}`}>{site.telephone}</a>
            </div>
            <div className="contact-pill">
              <p className="label">Adresse</p>
              <span className="value">{site.adresse}</span>
            </div>
          </div>

          <div className="map-wrap reveal" style={{ transitionDelay: "0.25s" }}>
            <RestaurantMap />
          </div>
        </div>
      </section>
    </>
  );
}
