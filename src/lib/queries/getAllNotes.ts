import { db } from "@/db";
import { notes } from "@/db/schema";

export async function getAllNotes() {
  //returns an array
  const allNotes = await db.select().from(notes);

  return allNotes[0];
}
