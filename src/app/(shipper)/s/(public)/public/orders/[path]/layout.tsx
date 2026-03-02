import { PropsWithChildren } from "react";

export default function PrivateOrdersLayout({
    children,
    actions,
    orders,
    resume,
}: PropsWithChildren<{
    actions: React.ReactNode,
    orders: React.ReactNode,
    resume: React.ReactNode,
}>) {
    return (
        <div className="flex flex-col w-full gap-6 max-w-6xl mx-auto">
            {children}
            {resume}
            {actions}
            {orders}
        </div>
    )
}
