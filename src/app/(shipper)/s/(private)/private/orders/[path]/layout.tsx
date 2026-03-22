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
        <div className="flex flex-col gap-6 w-full h-full">
            {children}
            {resume}
            {actions}
            {orders}
        </div>
    )
}
