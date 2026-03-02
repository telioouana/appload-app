import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { IconArrowRight, TablerIcon } from "@tabler/icons-react";

type Props = {
    Icon: TablerIcon,
    value: number,
    unit: string,
    href: string,
    label: string
}

export default function ActivityCard({ Icon, value, unit, href, label }: Props) {
    return (
        <Card className="hover:shadow-lg py-3.5 group">
            <CardContent className="flex flex-col gap-2 items-center justify-center">
                <div className="rounded-lg bg-primary/15 size-12 items-center justify-center flex group-hover:bg-primary/25">
                    <Icon className="size-8 text-primary" stroke={1.1}/>
                </div>

                <div className="flex flex-col gap-2 justify-center items-center">
                    <p className="text-2xl">{value}</p>
                    <p className="text-muted-foreground">{unit}</p>
                </div>

                <Link href={href} className="flex gap-2 items-center text-primary hover:cursor-pointer hover:underline-offset-4 hover:underline">
                    <span>{label}</span>
                    <IconArrowRight className="size-3" />
                </Link>
            </CardContent>
        </Card>
    )
}
