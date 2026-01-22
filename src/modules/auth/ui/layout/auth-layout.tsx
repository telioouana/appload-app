import { AuthView } from "@/modules/auth/ui/views/auth-view"

interface Props {
    children: React.ReactNode
}

export function AuthLayout({ children }: Props) {
    return (
        <AuthView>
            {children}
        </AuthView>
    )
}