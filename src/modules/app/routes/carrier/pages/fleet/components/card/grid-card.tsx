import { FleetValues } from "../../../../types/types"

interface Props {
    values: FleetValues
}

export function GridCard({ values }: Props) {
    return (
        <div>{JSON.stringify(values)}</div>
    )
}
