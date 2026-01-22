import { z } from "zod"
import { IconDots } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { useFormatter, useTranslations } from "next-intl"

import { Organization } from "@/backend/auth/types"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/table/data-table"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { AvatarGenerator } from "@/components/customs/avatar"
import { DataTableColumnHeader } from "@/components/table/column-header"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { MembersTableSchema } from "@/modules/account/pages/organization/ui/schema/validation"
import { InviteMemberDialog } from "@/modules/account/pages/organization/ui/dialog/invite-member-dialog"

type Props = {
    organization: Organization
}

export function OrganizationMembers({ organization }: Props) {
    const t = useTranslations("Account.organization.landing.members")
    const f = useFormatter()

    function avatar(name: string, image?: string, className?: string) {
        if (image) {
            return (
                <Avatar className={className}>
                    <AvatarImage src={image} alt="avatar" />
                </Avatar>
            )
        }
        return <AvatarGenerator seed={name} className={className} />
    }

    const columns: ColumnDef<z.infer<typeof MembersTableSchema>>[] = [
        {
            accessorKey: "user.name",
            header: ({ column }) => <div className="text-start"><DataTableColumnHeader column={column} title={t("header.name")} /></div>,
            cell: ({ row }) => (
                <div className="flex gap-4 items-center text-start">
                    {avatar(row.original.user.name, row.original.user.image, "size-8")}
                    {row.original.user.name}
                </div>
            )
        },
        {
            accessorKey: "user.email",
            header: ({ column }) => <div className="text-start"><DataTableColumnHeader column={column} title={t("header.email")} /></div>,
            cell: ({ row }) => (
                <div className="text-start">
                    {row.original.user.email}
                </div>
            )
        },
        {
            accessorKey: "role",
            header: () => <div className="text-center w-16">{t("header.role.title")}</div>,
            cell: ({ row }) => (
                <div className="text-center w-16">
                    {row.original.role == "owner"
                        ? (<Badge variant="default">{t("header.role.owner")}</Badge>)
                        : row.original.role == "admin"
                            ? (<Badge variant="secondary">{t("header.role.admin")}</Badge>)
                            : row.original.role == "member"
                                ? (<Badge variant="outline">{t("header.role.member")}</Badge>)
                                : (<Badge variant="outline">{t("header.role.driver")}</Badge>)
                    }
                </div>
            ),
            enableGlobalFilter: false,
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => <div className="w-30"><DataTableColumnHeader column={column} title={t("header.created-at")} /></div>,
            cell: ({ row }) => (
                <div className="text-end w-30">
                    {f.dateTime(row.original.createdAt, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                </div>
            ),
            enableGlobalFilter: false,
        },
        {
            id: "actions",
            header: () => <div className="text-center w-10">{t("header.actions.title")}</div>,
            cell: () => (
                <div className="text-center w-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon-sm" variant="ghost" >
                                <IconDots />
                            </Button>
                        </DropdownMenuTrigger>
                    </DropdownMenu>
                </div >
            )
        }
    ]


    return (
        <DataTable columns={columns} data={organization.members}>
            <InviteMemberDialog />
        </DataTable>
    )
}