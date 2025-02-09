import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  text,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  text: text("text"),
  creatorId: varchar("creator_id").notNull().default("anonym"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    // automatically called on update
    .$onUpdate(() => new Date()),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  label: varchar("label"),
  creatorId: varchar("creator_id").notNull().default("anonym"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    // automatically called on update
    .$onUpdate(() => new Date()),
});

// Join table for many to many relationship
export const noteOnTags = pgTable(
  "note_tags",
  {
    noteId: integer("note_id")
      .notNull()
      .references(() => notes.id),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id),
  },
  (t) => [primaryKey({ columns: [t.noteId, t.tagId] })]
);

export const noteRelations = relations(notes, ({ many }) => ({
  tags: many(noteOnTags),
}));

export const tagRelations = relations(tags, ({ many }) => ({
  notes: many(noteOnTags),
}));

export const noteOnTagsRelations = relations(noteOnTags, ({ one }) => ({
  note: one(notes, {
    fields: [noteOnTags.noteId],
    references: [notes.id],
  }),

  tag: one(tags, {
    fields: [noteOnTags.tagId],
    references: [tags.id],
  }),
}));
