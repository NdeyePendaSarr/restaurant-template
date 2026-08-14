CREATE TYPE "public"."statut" AS ENUM('en_attente', 'confirmee', 'annulee');--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" serial PRIMARY KEY NOT NULL,
	"prenom" varchar(80) NOT NULL,
	"nom" varchar(80) NOT NULL,
	"email" varchar(160) NOT NULL,
	"telephone" varchar(20) NOT NULL,
	"date" date NOT NULL,
	"heure" varchar(5) NOT NULL,
	"personnes" integer NOT NULL,
	"message" text,
	"statut" "statut" DEFAULT 'en_attente' NOT NULL,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL
);
