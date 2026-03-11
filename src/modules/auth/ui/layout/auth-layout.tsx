import { AuthView } from "@/modules/auth/ui/views/auth-view"
import { PublicThemeProvider } from "@/theme/theme-provider"

interface Props {
    children: React.ReactNode
}

export function AuthLayout({ children }: Props) {
    return (
        <PublicThemeProvider>
            <AuthView>
                {children}
            </AuthView>
        </PublicThemeProvider>
    )
}