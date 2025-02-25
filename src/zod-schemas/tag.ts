import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tags } from "@/db/schema";

export const insertTagSchema = createInsertSchema(tags, {
    label: (schema) => schema.min(1, "Label is required"),
});

export const selectTagSchema = createSelectSchema(tags);

export type insertTagSchemaType = typeof insertTagSchema._type;

export type selectTagSchemaType = typeof selectTagSchema._type;
