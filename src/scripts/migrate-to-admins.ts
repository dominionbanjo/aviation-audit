// import * as dotenv from "dotenv";
// import path from "path";
// dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// async function main() {
//   console.log("Migrating all users to ADMIN...");
//   try {
//     const { db } = await import("../lib/db");
//     const { users } = await import("../lib/db/schema");

//     const result = await db.update(users).set({ role: "ADMIN" }).returning();
//     console.log(`Successfully migrated ${result.length} users to ADMIN:`);
//     console.log(result.map(u => ({ id: u.id, email: u.email, role: u.role })));
//     process.exit(0);
//   } catch (err) {
//     console.error("Migration query failed:", err);
//     process.exit(1);
//   }
// }

// main().catch((err) => {
//   console.error("Migration script error:", err);
//   process.exit(1);
// });
