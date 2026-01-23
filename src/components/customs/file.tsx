"use client"

import { toast } from "sonner";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { IconTrash, IconUpload, IconCircleX } from "@tabler/icons-react";

import { Base } from "@/components/customs/base";
import { Spinner } from "@/components/ui/spinner";
import { ControlFunc } from "@/components/customs/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

import { useEdgeStore } from "@/lib/edgestore";

export const FileInput: ControlFunc<{
    inputRef: React.RefObject<HTMLInputElement | null>
    path: string
    owner: string
    index: number
    length: number
    remove: (path: string, index: number) => void
}> = ({
    inputRef,
    path,
    index,
    owner,
    length,
    remove,
    ...props
}) => {
        const [isSubmitting, setSubmitting] = useState<boolean>(false)

        const isDisabled = isSubmitting || props.isPending
        const t = useTranslations("Tooltips")
        const { edgestore } = useEdgeStore()

        return (
            <Base {...props}>
                {(field) => {

                    async function discard(url?: string) {
                        if (!url) return
                        setSubmitting(true)
                        try {
                            await edgestore.apploadFiles.delete({ url })
                            field.onChange(undefined)
                        } catch (error) {
                            toast("Error deleting the file, please try again")
                            console.log(error)
                        } finally {
                            setSubmitting(false)
                        }
                    }
                    return (
                        <InputGroup>
                            <InputGroupAddon align="inline-start">
                                {field.value ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <InputGroupButton
                                                type="button"
                                                variant="destructive"
                                                disabled={isDisabled}
                                                onClick={() => discard(field.value)}
                                            >
                                                Delete {isSubmitting ? <Spinner /> : <IconTrash className="text-destructive" />}
                                            </InputGroupButton>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {t("delete-file")}
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <InputGroupButton
                                                type="button"
                                                variant="default"
                                                disabled={isDisabled}
                                                onClick={() => inputRef.current?.click()}
                                            >
                                                Upload{isSubmitting ? <Spinner /> : <IconUpload />}
                                            </InputGroupButton>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {t("upload-file")}
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </InputGroupAddon>

                            <InputGroupInput
                                ref={inputRef}
                                onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return
                                    setSubmitting(true)
                                    try {
                                        const { url } = await edgestore.apploadFiles.upload({
                                            file,
                                            options: {
                                                temporary: true,
                                                ...(field.value ? { replaceTargetUrl: field.value } : {}),
                                            },
                                            input: {
                                                owner: owner.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                                                path,
                                            },
                                        })

                                        if (!url) {
                                            toast("Error uploading the file, please try again")
                                            return
                                        }
                                        field.onChange(url)
                                    } catch (error) {
                                        toast("Error uploading the file, please try again")
                                        console.log(error)
                                    } finally {
                                        setSubmitting(false)
                                        if (inputRef.current) {
                                            inputRef.current.value = ""
                                        }
                                    }
                                }}
                                type="file"
                                accept=".pdf"
                                className="hidden"
                            />

                            <InputGroupInput
                                {...field}
                                readOnly
                                type="text"
                                value={field.value ?? ""}
                                disabled={props.isPending}
                                placeholder={props.placeholder}
                            />

                            {index < length && length > 1 && (
                                <InputGroupAddon align="inline-end">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <InputGroupButton
                                                type="button"
                                                variant="destructive"
                                                disabled={isDisabled}
                                                onClick={async () => {
                                                    remove?.(path, index)
                                                }}
                                            >
                                                Remove <IconCircleX />
                                            </InputGroupButton>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {t("remove-page-file")}
                                        </TooltipContent>
                                    </Tooltip>
                                </InputGroupAddon>
                            )}
                        </InputGroup>
                    )
                }}
            </Base>
        )
    }