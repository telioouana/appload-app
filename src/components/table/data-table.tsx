"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { IconSearch } from "@tabler/icons-react";
import { ColumnDef, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from "@tanstack/react-table"

import { DataTablePagination } from "@/components/table/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    children?: React.ReactNode
    pagination?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    children,
    pagination 
}: DataTableProps<TData, TValue>) {
    const t = useTranslations("Table")

    const [globalFilter, setGlobalFilter] = useState<string>("")
    const [sorting, setSorting] = useState<SortingState>([])

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            globalFilter,
        },
        manualPagination: pagination,
    })

    useEffect(() => {
        table.setPageSize(8)
    }, [table]);

    return (
        <div>
            <div className="flex items-center py-4 justify-between">
                <InputGroup className="max-w-xs">
                    <InputGroupInput
                        placeholder={t("filter")}
                        value={globalFilter}
                        onChange={(event: { target: { value: string; }; }) =>
                            setGlobalFilter(event.target.value)
                        }
                    />

                    <InputGroupAddon>
                        <InputGroupText><IconSearch /></InputGroupText>
                    </InputGroupAddon>
                </InputGroup>

                {children}
            </div>

            <Table>
                <TableHeader className="w-full" >
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="w-full" >
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-12 text-center">
                                {t("empty")}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {!pagination && (<DataTablePagination table={table} />)}
        </div>
    )
}