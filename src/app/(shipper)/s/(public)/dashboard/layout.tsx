import { PropsWithChildren, ReactNode } from "react"

export default function Layout({
    children,
    activity,
    resume,
}: PropsWithChildren<{
    activity: ReactNode
    resume: ReactNode
}>) {
    return (
        <div className="w-full h-full space-y-6">
            <div>{children}</div>
            <div>{activity}</div>
            <div>{resume}</div>
        </div>
    )
}
