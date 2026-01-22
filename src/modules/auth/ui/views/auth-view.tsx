import Image from "next/image"
import { useTranslations } from "next-intl"

import { Card, CardContent, CardDescription } from "@/components/ui/card"

interface Props {
    children: React.ReactNode
}

export function AuthView({ children }: Props) {
    const t = useTranslations("Auth")

    return (
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0 border-none shadow-none rounded-none md:rounded-xl md:border md:bg-card text-card-foreground md:shadow-xl">
                <CardContent className="grid p-0 md:grid-cols-2">
                    {children}

                    <div className="bg-radial from-sidebar-primary to-primary relative hidden md:flex flex-col gap-y-2 items-center justify-center">
                        <Image src="/logos/appload.svg" alt="logo" className="size-28" width={1} height={1} preload />
                        <CardDescription className="text-sm font-medium text-white">{t("tagline")}</CardDescription>
                    </div>
                </CardContent>
            </Card>

            <div className="text-muted-foreground font-medium *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                {t("legal.label")} <a href="#">{t("legal.terms")}</a> {t("legal.and")} <a href="#">{t("legal.privacy")}</a>
            </div>
        </div>
    )
}
