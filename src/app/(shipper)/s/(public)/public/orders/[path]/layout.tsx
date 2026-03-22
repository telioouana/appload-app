import { PropsWithChildren, ReactNode } from "react";

export default function PrivateOrdersLayout({
    children,
    actions,
    orders,
    resume,
}: PropsWithChildren<{
    actions: ReactNode,
    orders: ReactNode,
    resume: ReactNode,
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
