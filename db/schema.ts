import {
  pgTable,
  serial,
  varchar,
  date,
  integer,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

/** Cycle de vie d'une réservation. */
export const statutEnum = pgEnum("statut", [
  "en_attente",
  "confirmee",
  "annulee",
]);

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  prenom: varchar("prenom", { length: 80 }).notNull(),
  nom: varchar("nom", { length: 80 }).notNull(),
  email: varchar("email", { length: 160 }).notNull(),
  telephone: varchar("telephone", { length: 20 }).notNull(),
  date: date("date").notNull(),
  heure: varchar("heure", { length: 5 }).notNull(), // "HH:MM"
  personnes: integer("personnes").notNull(),
  message: text("message"),
  statut: statutEnum("statut").notNull().default("en_attente"),
  creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
});

export type Reservation = typeof reservations.$inferSelect;
export type NouvelleReservation = typeof reservations.$inferInsert;
