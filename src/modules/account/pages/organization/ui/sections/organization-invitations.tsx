import { z } from "zod"
import { ColumnDef } from "@tanstack/react-table"
import { IconDots } from "@tabler/icons-react"
import { useFormatter, useTranslations } from "next-intl"

import { Organization } from "@/backend/auth/types"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/table/data-table"
import { AvatarGenerator } from "@/components/customs/avatar"
import { DataTableColumnHeader } from "@/components/table/column-header"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { InvitationsTableSchema } from "@/modules/account/pages/organization/ui/schema/validation"
import { InviteMemberDialog } from "@/modules/account/pages/organization/ui/dialog/invite-member-dialog"

type Props = {
    organization: Organization
}

export function OrganizationInvitations({ organization }: Props) {
    const t = useTranslations("Account.organization.landing.invitations")
    const f = useFormatter()

    const columns: ColumnDef<z.infer<typeof InvitationsTableSchema>>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => <div className="text-start"><DataTableColumnHeader column={column} title={t("header.name")} /></div>,
            cell: ({ row }) => (
                <div className="flex gap-4 items-center text-start">
                    {<AvatarGenerator seed={row.original.name} className="size-8" />}
                    {row.original.name}
                </div>
            )
        },
        {
            accessorKey: "email",
            header: ({ column }) => <div className="text-start"><DataTableColumnHeader column={column} title={t("header.email")} /></div>,
            cell: ({ row }) => (
                <div className="text-start">
                    {row.original.email}
                </div>
            )
        },
        {
            accessorKey: "role",
            header: () => <div className="text-center w-24">{t("header.role.title")}</div>,
            cell: ({ row }) => (
                <div className="text-center w-24">
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
            accessorKey: "status",
            header: () => <div className="text-center w-16">{t("header.status.title")}</div>,
            cell: ({ row }) => (
                <div className="text-center w-16">
                    {row.original.status == "pending"
                        ? (<Badge variant="default">{t("header.status.pending")}</Badge>)
                        : row.original.status == "canceled"
                            ? (<Badge variant="secondary">{t("header.status.canceled")}</Badge>)
                            : (<Badge variant="destructive">{t("header.status.rejected")}</Badge>)
                    }
                </div>
            )
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => <div className=""><DataTableColumnHeader column={column} title={t("header.created-at")} /></div>,
            cell: ({ row }) => (
                <div className="text-end">
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
        <DataTable columns={columns} data={organization.invitations.filter(invite => invite.status !== "accepted")}>
            <InviteMemberDialog />
        </DataTable>
    )
}