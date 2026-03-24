import { PropsWithChildren, ReactNode } from "react"

export default function MapLayout({ children, map }: PropsWithChildren<{
    map: ReactNode
}>) {
    return (
        <div className="w-full h-full space-y-6">
            {children}
            {map}
        </div>
    )
}
