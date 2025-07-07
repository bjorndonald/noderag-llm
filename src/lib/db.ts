import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

const databaseUrl = process.env.NODE_ENV === "development" ? process.env.DATABASE_URL! : process.env.DATABASE_URL! + ";sslmode=verify-ca;sslrootcert=ca.pem"

const sql = postgres(databaseUrl);

export const counters = pgTable("counters", {
    slug: varchar("slug", { length: 255 }).notNull().primaryKey(),
    views: integer("views").notNull().default(0),
    likes: integer("likes").notNull().default(0),
    loves: integer("loves").notNull().default(0),
    awards: integer("awards").notNull().default(0),
    bookmarks: integer("bookmarks").notNull().default(0),
})
export const db = drizzle(sql, { schema: { ...counters } });