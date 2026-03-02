import { Card, CardContent } from "@/components/ui/card";
import { TablerIcon } from "@tabler/icons-react";

type Props = {
    Icon: TablerIcon,
    value: number | string,
    unit: string,
}

export default function ActivityCard({ Icon, value, unit}: Props) {
    return (
        <Card className="hover:shadow-lg py-3.5 group">
            <CardContent className="flex flex-col gap-4 items-start justify-start">
                <div className="rounded-lg bg-primary/15 size-12 items-center justify-center flex group-hover:bg-primary/25">
                    <Icon className="size-8 text-primary" stroke={1.1}/>
                </div>

                <div className="flex flex-col gap-1 justify-start items-start">
                    <p className="text-2xl font-semibold leading-tight">{value}</p>
                    <p className="text-muted-foreground">{unit}</p>
                </div>
            </CardContent>
        </Card>
    )
}
