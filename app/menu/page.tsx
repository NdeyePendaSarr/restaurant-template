import type { Metadata } from "next";
import Link from "next/link";
import { menu } from "@/content/menu";
import { MenuGrid } from "@/components/MenuGrid";

export const metadata: Metadata = {
  title: "La carte",
  description:
    "Entrées, plats signature sénégalais, grillades du soir, desserts et jus frais. Découvrez la carte de Teranga Table.",
};

export default function MenuPage() {
  return (
    <>
      <div className="page-top container reveal">
        <p className="eyebrow">Menu</p>
        <h1>Notre carte</h1>
        <p>Produits locaux, recettes de famille, exécution soignée. Prix en francs CFA.</p>
      </div>
      <section className="section" style={{ paddingTop: "1.5rem" }}>
        <div className="container">
          <MenuGrid plats={menu} />
          <p style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link href="/reservation" className="btn btn-primary">Réserver une table</Link>
          </p>
        </div>
      </section>
    </>
  );
}
