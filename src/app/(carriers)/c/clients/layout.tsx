import { PropsWithChildren } from "react";

export default function Layout({
    children,
    actions,
    clients,
    resume
}: PropsWithChildren<{
    actions: React.ReactNode
    clients: React.ReactNode
    resume: React.ReactNode
}>) {
  return (
    <div className="flex flex-col gap-6 w-full h-full">
            {children}
            {resume}
            {actions}
            {clients}
        </div>
  )
}
