import { PropsWithChildren } from "react";

export default function KPIsLayout({ children, tendencies }: PropsWithChildren<{
    tendencies: React.ReactNode,
}>) {
    return (
        <div className="flex flex-col w-full h-full max-w-6xl mx-auto py-6 px-1 gap-6">
            {children}
            {tendencies}
        </div>
    )
}
