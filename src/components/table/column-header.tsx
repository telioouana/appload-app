import { Column } from "@tanstack/react-table"
import { IconChevronDown, IconChevronUp, IconSelector, } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
}

export function DataTableColumnHeader<TData, TValue>({
    title,
    column,
}: DataTableColumnHeaderProps<TData, TValue>) {
    return (
        <div
            className={cn("w-full inline-flex items-center justify-between gap-4 whitespace-nowrap rounded-md text-sm font-medium transition-all cursor-pointer [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5 shrink-0 [&_svg]:shrink-0 outline-none")}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
                <IconChevronDown />
            ) : column.getIsSorted() === "asc" ? (
                <IconChevronUp />
            ) : (
                <IconSelector />
            )}
        </div>
    )
}
