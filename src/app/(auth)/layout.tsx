import { LocaleSwitcher } from "@/components/locale/locale-switcher"
import { ThemeToggle } from "@/modules/app/ui/components/button/theme-toggle"

import { AuthLayout } from "@/modules/auth/ui/layout/auth-layout"

interface Props {
    children: React.ReactNode
}

export default function Layout({ children }: Props) {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="absolute top-4 right-4">
                <div className="flex gap-2">
                    <ThemeToggle />
                    <LocaleSwitcher />
                </div>
            </div>
            <div className="w-full max-w-sm md:max-w-3xl">
                <AuthLayout>
                    {children}
                </AuthLayout>
            </div>
        </div>
    )
}