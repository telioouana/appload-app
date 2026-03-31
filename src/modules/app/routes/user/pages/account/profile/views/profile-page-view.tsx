"use client"

import { authClient } from "@/backend/auth/auth-client"

import { PictureCard } from "../components/card/picture-card"
import { UserInformation } from "../components/card/user-information"

export function ProfilePageView() {
    const { data, isPending } = authClient.useSession()

    return (
        <div className="space-y-6 px-1">
            <PictureCard isPending={isPending} user={data?.user} />
            <UserInformation isPending={isPending} user={data?.user} />
        </div>
    )
}
