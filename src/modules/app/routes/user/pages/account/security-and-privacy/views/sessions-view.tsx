"use client"

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { authClient } from "@/backend/auth/auth-client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Session } from "../types/types";
import { SessionCard } from "../components/card/session-card"

interface Props {
    sessions: Session[]
    session: Session
}

export function SessionsView({ session, sessions }: Props) {
    const t = useTranslations("User.account.security-and-privacy.sessions")
    const router = useRouter()

    function revokeOtherSessions() {
        return authClient.revokeOtherSessions(undefined, {
            onSuccess: () => {
                router.refresh()
            },
        })
    }

    return (
        <Card className="p-0">
            <CardContent className="p-4 md:p-6 rounded-xl md:rounded-2xl">
                <CardHeader className="p-0">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="font-bold text-lg ">{t("header.title")}</h2>
                            <p className="text-sm text-muted-foreground mt-1">{t("header.description")}</p>
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={revokeOtherSessions}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                        >
                            {t("header.button")}
                        </Button>
                    </div>
                </CardHeader>

                <div className="space-y-3">
                    <SessionCard session={session} isCurrent />

                    {sessions
                        .filter((data) => data.token !== session.token)
                        .toSorted((a, b) =>
                            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                        )
                        .map((session) => (
                            <SessionCard key={session.token} session={session} />
                        ))
                    }
                </div>
            </CardContent>
        </Card>
    )
}
