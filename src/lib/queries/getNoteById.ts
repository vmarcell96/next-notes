import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getNoteById(noteId: number) {
  //returns an array
  const note = await db.select().from(notes).where(eq(notes.id, noteId));

  return note[0];
}
