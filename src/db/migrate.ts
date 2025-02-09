import { db } from "./index";
import { migrate } from "drizzle-orm/neon-http/migrator";

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: "src/db/migrations",
    });
    console.log("Migration completed");
  } catch (error) {
    //its a dev tool thats why sentry is not utilized
    console.error("Error during migration", error);
    process.exit(1);
  }
};

main();
