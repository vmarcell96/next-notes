import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getNotesByCreatorId(creatorId: number) {
  //returns an array
  const notesByCreatorId = await db
    .select()
    .from(notes)
    .where(eq(notes.creatorId, creatorId.toString()));

  return notesByCreatorId[0];
}
