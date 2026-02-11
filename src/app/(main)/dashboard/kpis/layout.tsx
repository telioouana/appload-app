export default function Layout({
    children,
    actions,
    insights,
    tendencies,
}: {
    children: React.ReactNode
    actions: React.ReactNode
    insights: React.ReactNode
    tendencies: React.ReactNode
}) {
    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 overflow-y-scroll container-snap">
            {tendencies}
            {insights}
            {actions}
            {children}
        </div>
    )
}
