"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { IconCreditCard, IconBuildingFactory, IconHome, IconDeviceDesktopAnalytics, IconUser } from "@tabler/icons-react"

import { Skeleton } from "@/components/ui/skeleton"
import { buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { AvatarGenerator } from "@/components/customs/avatar"

import { cn } from "@/lib/utils"
import { authClient } from "@/backend/auth/auth-client"

export function AccountSidebar() {
    const { data, isPending } = authClient.useSession()

    const t = useTranslations("Account.sidebar")
    const pathname = usePathname()

    const links = [
        {
            path: "/account",
            label: t("account"),
            Icon: IconHome
        },
        {
            path: "/profile",
            label: t("profile"),
            Icon: IconUser
        },
        {
            path: "/company",
            label: t("company"),
            Icon: IconBuildingFactory
        },
        {
            path: "/sessions",
            label: t("sessions"),
            Icon: IconDeviceDesktopAnalytics
        },
        {
            path: "/payment-options",
            label: t("payment-options"),
            Icon: IconCreditCard
        },

    ]

    function renderLinks() {
        return links.map(({ path, label, Icon }) => (
            <Link
                key={path}
                href={path == "/company" ? `${path}?tab=members` : path}
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "flex gap-4 w-full justify-start font-normal text-base items-center",
                    pathname.startsWith(path) && "bg-accent text-accent-foreground dark:bg-accent/50 border-b border-primary"
                )}
            >
                <Icon />
                {label}
            </Link>
        ))
    }

    if (isPending || !data?.user) {
        return (
            <div className="flex flex-col gap-8 ml-10">
                <div className="flex items-center justify-between gap-4 mb-0.5 py-10 pt-10.5">
                    <Skeleton className="size-16 rounded-full" />

                    <div className="flex flex-col gap-1.5 text-left overflow-hidden flex-1 min-w-0 w-full">
                        <Skeleton className="h-4.5 w-28" />
                        <Skeleton className="h-4 w-45" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>

                <div className="flex flex-col gap-3 -ml-4">{renderLinks()}</div>
            </div>
        )
    }

    const { name, image, email, phoneNumber } = data.user

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
        <div className="flex flex-col gap-8 ml-10">
            <div className="flex items-center justify-between gap-4 py-10">
                {avatar("size-16 items-center justify-center")}

                <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                    <p className="text-base w-full font-semibold">{name}</p>
                    <p className="text-sm w-full text-foreground/50">{email}</p>
                    <p className="text-sm w-full font-medium text-foreground/60">{phoneNumber}</p>
                </div>
            </div>

            <div className="flex flex-col gap-3 -ml-4">{renderLinks()}</div>
        </div>
    )
}
