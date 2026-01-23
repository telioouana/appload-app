import { View } from "@/modules/account/pages/create-organization/ui/schema/validation";
import { CreateOrganizationView } from "@/modules/account/pages/create-organization/ui/views/create-organization-view";

type Props = {
    searchParams: Promise<{
        view?: View
    }>
}

export default async function Page({ searchParams }: Props) {
    const { view } = await searchParams
    return <CreateOrganizationView view={view ?? "organization-info"}/>
}
