import { useTranslations } from "next-intl";

import { SiteMap } from "@/modules/account/ui/button/site-map";
import { UserButton } from "@/modules/account/ui/button/user-button";

export function AccountNavbar() {
    const t = useTranslations("Account.navbar")
    return (
        <header className="bg-sidebar sticky top-0 z-50 flex items-center m-4 rounded-full shadow-md backdrop-blur-md">
            <div className="flex h-(--header-height) w-full items-center gap-2 py-2 px-4 justify-between">
                <div className="justify-start pb-1">
                    <SiteMap />
                </div>

                <div className="justify-center">
                    <h1 className="font-semibold text-lg">{t("title")}</h1>
                </div>

                <div className="justify-end pt-1">
                    <UserButton />
                </div>
            </div>
        </header>
    )
}
