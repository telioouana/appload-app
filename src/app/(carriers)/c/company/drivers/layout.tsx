import React, { PropsWithChildren } from 'react'

export default function Layout({
    children,
    actions,
    resume,
    drivers
}: PropsWithChildren<{
    actions: React.ReactNode,
    resume: React.ReactNode,
    drivers: React.ReactNode
}>) {
  return (
    <div className="flex flex-col gap-6 w-full h-full">
        {children}
        {resume}
        {actions}
        {drivers}
    </div>
  )
}
