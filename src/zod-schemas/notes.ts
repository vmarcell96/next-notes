import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { notes } from "@/db/schema";

export const insertNoteSchema = createInsertSchema(notes, {
  text: (schema) => schema.min(1, "Note content is required"),
});

export const selectNoteSchema = createSelectSchema(notes);

export type insertNoteSchemaType = typeof insertNoteSchema._type;

export type selectNoteSchemaType = typeof selectNoteSchema._type;
