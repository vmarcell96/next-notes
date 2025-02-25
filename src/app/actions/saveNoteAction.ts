"use server";

import { eq } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { noteOnTags, notes, tags } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import { insertNoteWithTagsSchema } from "@/zod-schemas/notes";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// no try catch is needed
// errors are automatically handled by the action client
export const saveNoteAction = actionClient
    .metadata({ actionName: "saveNoteAction" })
    // revalidating the data
    .schema(insertNoteWithTagsSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async (obj) => {
        const noteWithTags = obj.parsedInput;
        const tagLabels = noteWithTags.tagLabels;

        const { isAuthenticated, getUser } = getKindeServerSession();
        const isAuth = await isAuthenticated();
        const user = await getUser();

        // redirect throws an error by nature, next-safe-action disregards it , sentry doesn't
        if (!isAuth) redirect("/login");

        // db errors are not logged in detail
        // const query = sql.raw("SELECT * FROM unknown");
        // const data = await db.execute(query);

        return await db.transaction(async (transaction) => {
            // New Note
            if (noteWithTags.id === 0) {
                const newNoteInsertResult = await transaction
                    .insert(notes)
                    .values({
                        text: noteWithTags.text,
                        creatorId: user.id,
                    })
                    .returning({ insertedNoteId: notes.id });

                if (tagLabels && tagLabels.length > 0) {
                    // Insert or retrieve existing tags
                    const tagIds = await Promise.all(
                        tagLabels.map(async (label) => {
                            const existingTag = await transaction
                                .select()
                                .from(tags)
                                .where(eq(tags.label, label));

                            if (existingTag.length > 0)
                                return existingTag[0]?.id;

                            const newTag = await transaction
                                .insert(tags)
                                .values({
                                    label: label,
                                    creatorId: user.id,
                                })
                                .returning();
                            return newTag[0].id;
                        })
                    );

                    // Insert into the junction table
                    // No need to delete previous junction entries because the note is newly created
                    await transaction.insert(noteOnTags).values(
                        tagIds.map((tagId) => ({
                            noteId: newNoteInsertResult[0].insertedNoteId,
                            tagId,
                        }))
                    );
                }

                return {
                    message: `Note ID #${newNoteInsertResult[0].insertedNoteId} created successfully`,
                };
            }

            // Edit Note
            await transaction
                .update(notes)
                .set({
                    text: noteWithTags.text,
                })
                .where(eq(notes.id, noteWithTags.id!));

            //handle tags

            if (tagLabels && tagLabels.length > 0) {
                // Insert or retrieve existing tags
                const tagIds = await Promise.all(
                    tagLabels.map(async (label) => {
                        const existingTag = await transaction
                            .select()
                            .from(tags)
                            .where(eq(tags.label, label));

                        if (existingTag.length > 0) return existingTag[0]?.id;

                        const newTag = await transaction
                            .insert(tags)
                            .values({
                                label: label,
                                creatorId: user.id,
                            })
                            .returning();
                        return newTag[0].id;
                    })
                );

                // Delete entries connected to current note from junction table
                await transaction
                    .delete(noteOnTags)
                    .where(eq(noteOnTags.noteId, noteWithTags.id!));

                // Insert into the junction table
                await transaction.insert(noteOnTags).values(
                    tagIds.map((tagId) => ({
                        noteId: noteWithTags.id!,
                        tagId,
                    }))
                );
            }

            return {
                message: `Note ID #${noteWithTags.id!} updated successfully`,
            };
        });
    });
