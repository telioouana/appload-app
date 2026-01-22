import Link from "next/link"
import { useTranslations } from "next-intl"
import { IconGridDots, IconDashboard } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Item, ItemContent, ItemGroup, ItemHeader, ItemTitle } from "@/components/ui/item"

export function SiteMap() {
    const t = useTranslations("Account.navbar.site-map")
    const links = [
        {
            href: "/dashboard",
            title: t("dashboard"),
            Icon: IconDashboard
        }

    ]

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="icon" variant="ghost" aria-label={t("title")}>
                    <IconGridDots className="size-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="border-none mt-4 -ml-2 p-0 w-full max-w-120">
                <Card className="border-none w-full">
                    <CardHeader>
                        <CardTitle>{t("title")}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex items-center gap-4 w-full">
                        <ItemGroup className="grid grid-cols-3 gap-8">
                            {links.map(({ href, title, Icon }) => (
                                <Item asChild key={href} className="hover:shadow-md">
                                    <Link href={href} >
                                        <ItemHeader className="justify-center">
                                            <Icon className="size-12" />
                                        </ItemHeader>
                                        <ItemContent className="w-full flex items-center text-center">
                                            <ItemTitle>{title}</ItemTitle>
                                        </ItemContent>
                                    </Link>
                                </Item>
                            ))}
                        </ItemGroup>
                    </CardContent>
                </Card>
            </PopoverContent>
        </Popover>
    )
}
