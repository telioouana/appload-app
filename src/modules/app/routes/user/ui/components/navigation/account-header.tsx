"use client"

import Link from "next/link"
import { useTranslations } from "next-intl";
import { IconArrowLeft } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AccountHeader({ user }: { user: "s" | "c" }) {
    const t = useTranslations("User.account.header")
    const pathname = usePathname()
    const router = useRouter()

    const pages = [
        {
            path: `/u/${user}/account/profile`,
            label: t("pages.profile"),
        },
        {
            path: `/u/${user}/account/organization`,
            label: t("pages.organization"),
        },
        {
            path: `/u/${user}/account/security-and-privacy`,
            label: t("pages.security-and-privacy"),
        }
    ]

    return (
        <header className="bg-sidebar sticky top-0 z-50 items-center border border-sidebar-border shadow-sm">
            <div className="flex flex-col h-(--header-height) max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-4">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/u/redirect")}
                    >
                        <IconArrowLeft />
                        {t("buttons.back")}
                    </Button>

                    <div className="flex flex-col gap-1">
                        <h3 className="text-base font-bold">{t("title")}</h3>
                        <p className="text-sm text-muted-foreground">{t("description")}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex gap-2 overflow-x-auto">
                    {pages.map(({ path, label }) => (
                        <Link
                            key={path}
                            href={path}
                            className={cn(
                                "px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors border-transparent text-muted-foreground hover:text-foreground",
                                pathname.startsWith(path) && "border-primary text-primary dark:text-primary/80"
                            )}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    )
}
