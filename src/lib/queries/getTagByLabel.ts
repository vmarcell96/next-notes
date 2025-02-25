import { db } from "@/db";
import { tags } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getTagByLabel(label: string) {
  //returns an array
  const labelInDb = await db.select().from(tags).where(eq(tags.label, label)).limit(1);

  if (labelInDb.length == 0) {
    return null;
  }

  return labelInDb[0];
}
