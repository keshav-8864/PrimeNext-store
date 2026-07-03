// This file connects our Node.js application to the PostgreSQL database using Drizzle ORM.

// Our application needs to:
// 1. Read data from the database.
// 2. Insert new data.
// 3. Update existing data.
// 4. Delete data.


// Instead of creating a new database connection in every file, we create it once here and export it.

//------------------------------------------------------------------------------------




// Load variables from the .env file into process.env
import "dotenv/config";

//  Drizzle is an ORM (Object Relational Mapper).
//  
//  * ORM allows us to work with the database using JavaScript/TypeScript
//  * instead of writing raw SQL.
//  *
//  * Example:
//  *
//  * SQL:
//  * SELECT * FROM users;
//  *
//  * Drizzle:
//  * await db.select().from(users);
//  
//  
import { drizzle } from "drizzle-orm/node-postgres";

// Import the official PostgreSQL driver for Node.js.
// Drizzle uses this driver to actually communicate with PostgreSQL.
import pg from "pg";

// Import all table definitions from schema.ts.

import * as schema from "./schema";

// Create a connection pool.
//
// Instead of opening a new database connection for every request,
// PostgreSQL keeps multiple reusable connections ready.

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the Drizzle database instance.
//
// pool   -> tells Drizzle HOW to connect to PostgreSQL.
// schema -> tells Drizzle WHAT tables exist in the database.
//
// After this, we can write queries like:
//
// await db.select().from(schema.users);

export const db = drizzle(pool, { schema });