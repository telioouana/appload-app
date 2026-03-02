type Props = {
    value: number | string,
    unit: string,
    label: string,
    currency?: string
}

export function KPIsDataCard({ value, unit, label, currency }: Props) {
    return (
        <div className="bg-muted/80 flex flex-col gap-px py-3 px-4 rounded-lg">
            <div className="text-muted-foreground text-[13px]">{label}</div>
            <div className="flex gap-2 text-2xl leading-tight">
                <span>{value}</span>
                <span>{currency}</span>
            </div>
            <div className="text-muted-foreground text-[13px]">{unit}</div>
        </div>
    )
}
