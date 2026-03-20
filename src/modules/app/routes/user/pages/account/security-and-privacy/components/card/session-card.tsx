"use client"

import { UAParser } from "ua-parser-js"
import { useFormatter, useTranslations } from "next-intl"
import { IconDeviceDesktop, IconDeviceMobile, IconGlobe } from "@tabler/icons-react"


import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { Session } from "../../types/types"

import { cn } from "@/lib/utils"

interface Props {
    session: Session
    isCurrent?: boolean
}

export function SessionCard({ session, isCurrent = false }: Props) {
    const t = useTranslations("User.account.security-and-privacy.sessions.card")
    const f = useFormatter()

    const agent = session.userAgent ? UAParser(session.userAgent) : null

    function device() {
        if (agent === null) return t("unknown")
        if (agent.browser.name === null && agent.os.name === null) return t("unknown")

        if (agent.browser.name === null) return agent.os.name
        if (agent.os.name === null) return agent.browser.name

        return t("device", { browser: agent.browser.name!, os: agent.os.name! })
    }

    return (
        <Card
            className={cn(
                "p-0 bg-gray-50 dark:bg-gray-700/50 rounded-lg",
                isCurrent && "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
            )}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div
                            className={cn(
                                "size-10 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 flex items-center justify-center shrink-0",
                                isCurrent && "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            )}
                        >
                            {agent?.device.type === "mobile" ? (
                                <IconDeviceMobile className="size-5" />
                            ) : (
                                <IconDeviceDesktop className="size-5" />
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{device()}</p>
                                {isCurrent && <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded">Current</span>}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                <IconGlobe className="size-3 inline mr-1" />
                                {session.city}, {session.country}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{f.relativeTime(session.updatedAt, new Date())}</p>
                        </div>
                    </div>

                    {!isCurrent && (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                        >
                            Sign Out
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
