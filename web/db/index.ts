import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL environment variable");
}

// Use prepare: false for Supabase connection pooler (transaction mode)
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
