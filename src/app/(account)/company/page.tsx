import { CompanyTab } from "@/modules/account/pages/organization/ui/types";
import { OrganizationView } from "@/modules/account/pages/organization/ui/views/organization-view";

type Props = {
    searchParams: Promise<{
        tab?: CompanyTab
    }>
}

export default async function Page({ searchParams }: Props) {
    const { tab } = await searchParams
    return <OrganizationView tab={tab ?? "members"}/>
}