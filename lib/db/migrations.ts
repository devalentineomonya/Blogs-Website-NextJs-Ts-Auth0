import { migrate } from "drizzle-orm/neon-http/migrator"
import { db } from "./index"

// This script can be run with `npm run migrate`
async function runMigrations() {
  console.log("Running migrations...")

  await migrate(db, { migrationsFolder: "drizzle" })

  console.log("Migrations completed!")
  process.exit(0)
}

runMigrations().catch((err) => {
  console.error("Migration failed!", err)
  process.exit(1)
})

