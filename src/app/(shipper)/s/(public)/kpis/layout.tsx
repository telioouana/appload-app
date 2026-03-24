import { PropsWithChildren, ReactNode } from "react";

export default function KPIsLayout({ children, tendencies }: PropsWithChildren<{
    tendencies: ReactNode,
}>) {
    return (
        <div className="w-full h-full space-y-6">
            {children}
            {tendencies}
        </div>
    )
}
