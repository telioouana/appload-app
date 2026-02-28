import React, { PropsWithChildren } from 'react'

export default function MapLayout({ children, map }: PropsWithChildren<{
    map: React.ReactNode
}>) {
    return (
        <div className="flex flex-col w-full h-full max-w-6xl mx-auto px-1 gap-6">
            {children}
            {map}
        </div>
    )
}
