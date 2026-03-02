type Props = {
    value: number | string,
    unit: string,
    label: string
}

export function ResumeCard({ value, unit, label }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <div className="text-muted-foreground">{label}</div>
            <div className="text-2xl text-primary">
                {value}
            </div>
            <div className="text-muted-foreground">{unit}</div>
        </div>
    )
}
