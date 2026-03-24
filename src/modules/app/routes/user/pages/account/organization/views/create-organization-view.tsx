"use client"

import { useTranslations } from "next-intl"
import { IconBuildingFactory } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

import { TYPE } from "../schemas/organization"
import { useCreateOrganization } from "../hooks/use-create-organization"
import { CreateOrganizationDialog } from "../components/dialog/create-organization-dialog"

interface Props {
    type: typeof TYPE[number]
}

export function CreateOrganizationView({ type }: Props) {
    const t = useTranslations("User.account.organization.create.state")
    const { onOpenChange } = useCreateOrganization()

    return (
        <div className="h-full w-full items-center justify-center flex">
            <CreateOrganizationDialog type={type} />
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon" className="size-36 rounded-full">
                        <IconBuildingFactory className="size-24" />
                    </EmptyMedia>
                    <EmptyTitle>{t("title")}</EmptyTitle>
                    <EmptyDescription>{t("description")}</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button onClick={onOpenChange}>{t("button")}</Button>
                </EmptyContent>
            </Empty>
        </div >
    )
}
