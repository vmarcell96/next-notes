import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getNoteWithTagsById(noteId: number) {
    const note = await db.query.notes.findFirst({
        where: eq(notes.id, noteId),
        with: {
            noteTags: {
                columns: {
                    noteId: false,
                    tagId: false,
                },
                with: {
                    tag: {
                        columns: {
                            label: true,
                        },
                    },
                },
            },
        },
    });

    return note;
}
