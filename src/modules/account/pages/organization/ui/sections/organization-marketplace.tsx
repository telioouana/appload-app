import { z } from "zod"
import { useTranslations } from "next-intl"
import { IconDots } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/table/data-table"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { AvatarGenerator } from "@/components/customs/avatar"
import { DataTableColumnHeader } from "@/components/table/column-header"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// import { listSubscribers } from "@/modules/user/pages/company/server/procedures"
import { SubscribersTableSchema } from "@/modules/account/pages/organization/ui/schema/validation"

export function OrganizationMarketplace() {
    // const [subscribers, setSubscribers] = useState<Company[]>()
    const t = useTranslations("Account.organization.landing.marketplace")

    // useEffect(() => {
    //     async function fetchSubscribers() {
    //         const data = await listSubscribers()
    //         setSubscribers(data.subscribers)
    //     }

    //     fetchSubscribers()
    // }, [organizationId])

    function avatar(name: string, image?: string | null, className?: string) {
        if (image) {
            return (
                <Avatar className={className}>
                    <AvatarImage src={image} alt="avatar" />
                </Avatar>
            )
        }
        return <AvatarGenerator seed={name} className={className} />
    }

    const columns: ColumnDef<z.infer<typeof SubscribersTableSchema>>[] = [
        {
            accessorKey: "user.name",
            header: ({ column }) => <div className="text-start"><DataTableColumnHeader column={column} title={t("header.name")} /></div>,
            cell: ({ row }) => (
                <div className="flex gap-4 items-center text-start">
                    {avatar(row.original.name, row.original.logo, "size-8")}
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
            accessorKey: "status",
            header: () => <div className="text-center w-16">{t("header.status.title")}</div>,
            cell: ({ row }) => (
                <div className="text-center w-16">
                    {row.original.status == "active"
                        ? (<Badge variant="success">{t("status.active")}</Badge>)
                        : row.original.status == "pending"
                            ? (<Badge variant="default">{t("status.pending")}</Badge>)
                            : (<Badge variant="destructive">{t("status.closed")}</Badge>)
                    }
                </div>
            )
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
        <DataTable columns={columns} data={[]} />
    )
}