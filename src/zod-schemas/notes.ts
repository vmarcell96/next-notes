import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { notes } from "@/db/schema";
import { z } from "zod";

//Insert
export const insertNoteSchema = createInsertSchema(notes, {
    text: (schema) => schema.min(1, "Note content is required"),
});

export const insertNoteWithTagsSchema = insertNoteSchema.extend({
    tagLabels: z.array(z.string()).optional(),
});

export type insertNoteWithTagsSchemaType =
    typeof insertNoteWithTagsSchema._type;

export type insertNoteSchemaType = typeof insertNoteSchema._type;

//Select

export const selectNoteSchema = createSelectSchema(notes);

export const selectNoteWithTagsSchema = selectNoteSchema.extend({
    tagLabels: z.array(z.string()).optional(),
});

export type selectNoteSchemaType = typeof selectNoteSchema._type;

export type selectNoteWithTagsSchemaType =
    typeof selectNoteWithTagsSchema._type;
