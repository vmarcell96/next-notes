"use server";

import { eq } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { notes } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import {
    insertNoteSchema,
    type insertNoteSchemaType,
} from "@/zod-schemas/notes";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// no try catch is needed
// errors are automatically handled by the action client
export const saveNoteAction = actionClient
    .metadata({ actionName: "saveNoteAction" })
    // revalidating the data
    .schema(insertNoteSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(
        async ({
            parsedInput: Note,
        }: {
            parsedInput: insertNoteSchemaType;
        }) => {
            const { isAuthenticated } = getKindeServerSession();
            const isAuth = await isAuthenticated();

            // redirect throws an error by nature, next-safe-action disregards it , sentry doesn't
            if (!isAuth) redirect("/login");

            // throw Error("test error");

            // db errors are not logged in detail
            // const query = sql.raw("SELECT * FROM unknown");
            // const data = await db.execute(query);

            // new Note
            if (Note.id === 0) {
                const result = await db
                    .insert(notes)
                    .values({
                        text: Note.text,
                    })
                    .returning({ insertedId: notes.id });

                return {
                    message: `Note ID #${result[0].insertedId} created successfully`,
                };
            }

            // existing Note
            const result = await db
                .update(notes)
                .set({
                    text: Note.text,
                })
                .where(eq(notes.id, Note.id!))
                .returning({ updatedId: notes.id });

            return {
                message: `Note ID #${result[0].updatedId} updated successfully`,
            };
        }
    );
