"use client"

import { useTranslations } from "next-intl"
import { IconCamera } from "@tabler/icons-react"

import { User } from "@/backend/auth/types"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarGenerator } from "@/components/customs/avatar";

interface Props {
    isPending: boolean
    user: User | undefined
}

export function PictureCard({ isPending, user }: Props) {
    const t = useTranslations("User.account.profile.picture-card")
    
    if (isPending || !user) {
        return (
            <Card className="p-0 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
                <CardContent className="p-4 md:p-6">
                    <Skeleton className="h-7 w-35 mb-4" />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="relative">
                            <Skeleton className="size-24 rounded-full" />

                            <div className="absolute bottom-0 right-0 size-8 bg-primary rounded-full flex items-center justify-center transition-colors">
                                <IconCamera className="size-4 text-white" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <Skeleton className="h-5 mb-1 w-full max-w-40"/>
                            <Skeleton className="h-4 mb-3 w-full max-w-50"/>
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-30"/>
                                <Skeleton className="h-8 w-20"/>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const { name, image } = user

    function avatar(className?: string) {
        if (image) {
            return (
                <Avatar className={className}>
                    <AvatarImage src={image} alt="avatar" />
                </Avatar>
            )
        }
        return <AvatarGenerator seed={name} className={className} />
    }

    return (
        <Card className="p-0 rounded-xl md:rounded-2xl border-[0.5px] border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 md:p-6">
                <h2 className="font-bold text-lg mb-4">{t("title")}</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative">
                        {avatar("size-24 text-2xl")}

                        <div className="absolute bottom-0 right-0 size-8 bg-primary rounded-full flex items-center justify-center transition-colors">
                            <IconCamera className="size-4 text-white" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <p className="text-sm text-foreground mb-1">{t("instruction")}</p>
                        <p className="text-xs text-muted-foreground mb-3">{t("description")}</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">{t("buttons.upload")}</Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30">
                                {t("buttons.remove")}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
