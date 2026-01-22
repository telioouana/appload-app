"use client"

import Link from "next/link"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconLogout, IconSettings, IconUserCog } from "@tabler/icons-react"

import { authClient } from "@/backend/auth/auth-client"

import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { AvatarGenerator } from "@/components/customs/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

export function UserButton() {
    const [isLoading, setLoading] = useState<boolean>(false)

    const t = useTranslations("Account.navbar.user")
    const router = useRouter()

    const { data, isPending } = authClient.useSession()

    if (isPending || !data?.user) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="size-9 rounded-full" />
            </div>
        )
    }

    const { name, image, email, phoneNumber, type } = data.user

    async function handleSignOut() {
        await authClient.signOut({
            fetchOptions: {
                onRequest: () => { setLoading(true) },
                onSuccess: () => {
                    setLoading(false)
                    router.replace("/sign-in")
                },
                onError: () => {
                    toast.error(t("errors.sign-out"))
                    setLoading(false)
                },
            }
        })
    }

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
        <Popover>
            <PopoverTrigger>
                {avatar("size-9 items-center justify-center")}
            </PopoverTrigger>
            <PopoverContent align="end" className="border-none mt-4 -mr-2 p-0 w-96">
                <Card className="border-none w-full">
                    <CardHeader className="flex items-start justify-between gap-4">
                        <div className="flex items-center justify-between gap-4">
                            {avatar("size-15 items-center justify-center")}

                            <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                                <p className="text-sm w-full font-semibold">{name}</p>
                                <p className="text-xs w-full text-foreground/50">{email}</p>
                                <p className="text-xs w-full font-medium text-foreground/60">{phoneNumber}</p>
                            </div>
                        </div>

                        <div><Badge className="text-xs">{t(`type.${type}`)}</Badge></div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4 w-full">
                        <Link href="/account" className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start")}><IconUserCog />{t("buttons.account")}</Link>
                        <Button variant="outline" className="w-full justify-start" disabled={isLoading}><IconSettings />{t("buttons.preferences")}</Button>
                    </CardContent>
                    <CardFooter>
                        <Button variant="destructive" className="w-full justify-start" onClick={handleSignOut} disabled={isLoading}>{isLoading ? <Spinner /> : <IconLogout />}{t("buttons.sign-out")}</Button>
                    </CardFooter>
                </Card>
            </PopoverContent>
        </Popover>
    )
}
