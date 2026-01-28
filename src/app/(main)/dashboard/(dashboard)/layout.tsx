export default function Layout({
    children,
    activity,
    resume,
}: {
    children: React.ReactNode
    activity: React.ReactNode
    resume: React.ReactNode
}) {
    return (
        <div className="flex flex-col gap-8 p-4">
            <div>{children}</div>
            <div>{activity}</div>
            <div>{resume}</div>
        </div>
    )
}
