"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import {
    insertNoteWithTagsSchema,
    insertNoteWithTagsSchemaType,
    selectNoteSchemaType,
} from "@/zod-schemas/notes";

import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";

import { useAction } from "next-safe-action/hooks";
import { saveNoteAction } from "@/app/actions/saveNoteAction";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse";
import CustomTagInput from "@/components/inputs/TagInput";

type Props = {
    note?: selectNoteSchemaType;
    tagLabels?: string[];
};

export default function NoteForm({ note, tagLabels }: Props) {
    const { toast } = useToast();

    const form = useForm<insertNoteWithTagsSchemaType>({
        mode: "onBlur",
        resolver: zodResolver(insertNoteWithTagsSchema),
        defaultValues: {
            id: note?.id ?? 0,
            text: note?.text ?? "",
            tagLabels: tagLabels ?? [],
        },
    });

    const {
        execute: executeSave,
        result: saveResult,
        isPending: isSaving,
        reset: resetSaveAction,
    } = useAction(saveNoteAction, {
        onSuccess({ data }) {
            if (data?.message) {
                toast({
                    variant: "default",
                    title: "Success! 👌",
                    // message returned from the server action
                    description: data?.message,
                });
            }
        },
        onError() {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Save failed",
            });
        },
    });

    async function submitForm(data: insertNoteWithTagsSchemaType) {
        console.log(data);

        // for validation error testing
        // executeSave({ ...data, firstName: "", phone: "" });

        executeSave(data);
    }

    return (
        <div className="flex flex-col gap-1 sm:px-8">
            <DisplayServerActionResponse result={saveResult} />
            <div>
                <h2 className="text-2xl font-bold">
                    {note?.id ? "Edit" : "New"} Note{" "}
                    {note?.id ? `#${note.id}` : "Form"}
                </h2>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submitForm)}
                    className="flex flex-col md:flex-row gap-4 md:gap-8"
                >
                    <div className="flex flex-col gap-4 w-full max-w-xs">
                        <Controller
                            name="tagLabels"
                            control={form.control}
                            render={({ field }) => (
                                <CustomTagInput
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />

                        <TextAreaWithLabel<insertNoteWithTagsSchemaType>
                            fieldTitle="Notes"
                            nameInSchema="text"
                            className="h-40"
                        />

                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                className="w-3/4"
                                variant="default"
                                title="Save"
                                // disabled during the server action
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <LoaderCircle className="animate-spin" />{" "}
                                        Saving
                                    </>
                                ) : (
                                    "Save"
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="destructive"
                                title="Reset"
                                onClick={() => {
                                    form.reset({
                                        id: note?.id ?? 0,
                                        text: note?.text ?? "",
                                        tagLabels: tagLabels ?? [],
                                    });
                                    resetSaveAction();
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
