import { useTranslations } from "next-intl";
import { Table } from "@tanstack/react-table"
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, } from "@tabler/icons-react"

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"

type DataTablePaginationProps<TData> = {
    table: Table<TData>
}

export function DataTablePagination<TData>({
    table
}: DataTablePaginationProps<TData>) {
    const t = useTranslations("Table.pagination")
    
    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="flex items-center space-x-2">
                <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                        table.setPageSize(Number(value))
                    }}
                >
                    <SelectTrigger className="h-8">
                        <SelectValue placeholder={table.getState().pagination.pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[8, 16, 32, 72].map((pageSize) => (
                            <SelectItem key={pageSize} value={String(pageSize)}>
                                {t("rows", {rows: pageSize})}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-6 justify-between">
                <div className="flex items-center justify-center text-sm font-medium">
                    {t("pages", { current: table.getState().pagination.pageIndex + 1, total: table.getPageCount()})}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">{t("buttons.first")}</span>
                        <IconChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">{t("buttons.previous")}</span>
                        <IconChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">{t("buttons.next")}</span>
                        <IconChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">{t("buttons.last")}</span>
                        <IconChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
