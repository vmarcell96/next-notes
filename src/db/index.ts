// import { drizzle } from "drizzle-orm/neon-http";
// import { neon } from "@neondatabase/serverless";
// import { config } from "dotenv";

// config({ path: ".env.local" });

// const sql = neon(process.env.DATABASE_URL!);

// // const db = drizzle(sql, { logger: true });
// const db = drizzle(sql);

// export { db };

import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "./schema";

config({ path: ".env.local" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// pool.on("error", (err) => console.error(err));

// const db = drizzle(sql, { logger: true });
export const db = drizzle({ client: pool, schema: schema });
