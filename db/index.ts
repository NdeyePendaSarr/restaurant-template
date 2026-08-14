import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type DB = ReturnType<typeof drizzle<typeof schema>>;
let _db: DB | null = null;

/**
 * Client Drizzle sur le driver HTTP Neon (idéal en serverless).
 * Initialisation paresseuse : on ne lit DATABASE_URL qu'à la première requête,
 * pas à l'import — sinon `next build` échouerait faute de variable d'env.
 */
export function getDb(): DB {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL manquant. Copie .env.example en .env et renseigne l'URL Neon."
    );
  }
  _db = drizzle(neon(url), { schema });
  return _db;
}
