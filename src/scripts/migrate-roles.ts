import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { sql } from "drizzle-orm";

async function main() {
  console.log("Migrating user roles to new 3-role system...");
  try {
    const { db } = await import("../lib/db");

    // Step 1: Add OTP to the existing enum so we can write it
    console.log("Adding OTP to enum...");
    await db.execute(sql`ALTER TYPE user_role ADD VALUE 'OTP'`);
    console.log("OTP added to enum.");

    // Step 2: Migrate MANAGER and LEAD_AUDITOR to AUDITOR
    const { rowCount: auditorCount } = await db.execute(
      sql`UPDATE users SET role = 'AUDITOR' WHERE role IN ('MANAGER', 'LEAD_AUDITOR')`
    );
    console.log(`Migrated ${auditorCount ?? 0} MANAGER/LEAD_AUDITOR users to AUDITOR`);

    // Step 3: Migrate USER to OTP
    const { rowCount: otpCount } = await db.execute(
      sql`UPDATE users SET role = 'OTP' WHERE role = 'USER'`
    );
    console.log(`Migrated ${otpCount ?? 0} USER users to OTP`);

    console.log("Role migration complete.");
    console.log("Next: Run 'npx drizzle-kit push' to finalize the new enum schema.");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Migration script error:", err);
  process.exit(1);
});
