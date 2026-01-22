"use client"

import { useRouter } from "next/navigation";

import { authClient } from "@/backend/auth/auth-client";

import { Loader } from "@/components/customs/loader";

import { AccountInfo } from "@/modules/account/pages/profile/ui/section/account-info";
import { ProfileHeader } from "@/modules/account/pages/profile/ui/section/profile-header";
import { PictureAndName } from "@/modules/account/pages/profile/ui/section/picture-and-name";

export function ProfileView() {
    const router = useRouter()

    const { data, isPending } = authClient.useSession()

    if (isPending) {
        return (
            <div className="h-full w-full items-center justify-center flex flex-col">
                <Loader />
            </div>
        )
    }

    if (!data || !data.user ) { 
        router.push("/sign-in") 
        return
    }

    const { user } = data

    return (
        <div className="flex flex-col gap-y-6 w-full">
            <ProfileHeader />
            <PictureAndName user={user} />
            <AccountInfo user={user} />
        </div>
    )
}
