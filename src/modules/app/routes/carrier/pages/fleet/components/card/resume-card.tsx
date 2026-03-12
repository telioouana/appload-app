import { Card, CardContent } from "@/components/ui/card";

interface Props {
    label: string
    value: string | number
}
export function ResumeCard({ label, value }: Props) {
    return (
        <Card className="p-0">
            <CardContent className="p-4 flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-semibold text-xl">{value}</p>
            </CardContent>
        </Card>
    )
}
