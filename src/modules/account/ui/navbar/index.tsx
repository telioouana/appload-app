import { useTranslations } from "next-intl";

import { SiteMap } from "@/modules/account/ui/button/site-map";
import { UserButton } from "@/modules/account/ui/button/user-button";

export function AccountNavbar() {
    const t = useTranslations("Account.navbar")
    return (
        <nav className="m-4 p-2 rounded-sm bg-transparent shadow-md h-14 flex items-center backdrop-blur-md z-50">
            <div className="w-full max-w-540 mx-auto items-center justify-between flex">
                <div className="justify-start">
                    <SiteMap />
                </div>

                <div className="justify-center">
                    <h1 className="font-semibold text-lg">{t("title")}</h1>
                </div>

                <div className="justify-end">
                    <UserButton />
                </div>
            </div>
        </nav>
    )
}
