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
        <div className="flex flex-col gap-6 w-full h-full">
            {children}
            {resume}
            {actions}
            {orders}
        </div>
    )
}
