import { PropsWithChildren, ReactNode } from "react";

export default function Layout({
    children,
    data,
    form,
}: PropsWithChildren<{
    data: ReactNode
    form: ReactNode
}>) {
    return (
        <div className="w-full h-full max-w-3xl mx-auto space-y-6">
            {children}
            {form}
            {data}
        </div>
    )
}
