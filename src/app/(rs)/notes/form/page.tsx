import { BackButton } from "@/components/BackButton";
import * as Sentry from "@sentry/nextjs";
import { getNoteById } from "@/lib/queries/getNoteById";
import NoteForm from "./NoteForm";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { noteId } = await searchParams;

  if (!noteId) {
    return { title: "New Note" };
  }
  return { title: `Edit Note #${noteId}` };
}

export default async function NoteFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const { noteId } = await searchParams;

    if (noteId) {
      // Edit note form
      const note = await getNoteById(parseInt(noteId));

      if (!note) {
        return (
          <>
            <h2 className="text-2xl mb-2">Note ID #{noteId} not found</h2>
            <BackButton title="Go Back" variant="default" />
          </>
        );
      }
      console.log(note);
      return <NoteForm note={note} />;
    } else {
      // New note form
      return <NoteForm />;
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
      throw error;
    }
  }
}
