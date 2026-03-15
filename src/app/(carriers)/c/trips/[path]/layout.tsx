import { PropsWithChildren } from "react";

export default function PrivateOrdersLayout({
    children,
    actions,
    trips,
    resume,
}: PropsWithChildren<{
    actions: React.ReactNode,
    trips: React.ReactNode,
    resume: React.ReactNode,
}>) {
    return (
        <div className="flex flex-col gap-6 w-full h-full">
            {children}
            {resume}
            {actions}
            {trips}
        </div>
    )
}
