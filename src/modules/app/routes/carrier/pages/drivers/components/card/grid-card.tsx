"use client"

import { DriverValues } from "../../../../types/types";

interface Props {
    values: DriverValues
}

export function GridCard({ values }: Props) {
    return (
        <div>{values.driver.legacyId}</div>
    )
}
