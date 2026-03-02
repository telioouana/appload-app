import { TRIP_PATH } from "@/modules/app/routes/carrier/types/types";

export default async function Page({ params }: { params: Promise<{ path: TRIP_PATH }> }) {
    const { path } = await params
    
    return (
        <div>{path}</div>
    )
}
