import { PropsWithChildren, ReactNode } from "react";

export default function Layout({
    children,
    actions,
    transporters,
    resume
}: PropsWithChildren<{
    actions: ReactNode
    transporters: ReactNode
    resume: ReactNode
}>) {
  return (
    <div className="flex flex-col gap-6 w-full h-full">
            {children}
            {resume}
            {actions}
            {transporters}
        </div>
  )
}
