import { CompanyTab } from "@/modules/account/pages/organization/ui/types";
import { CompanyView } from "@/modules/account/pages/organization/ui/views/company-view";

type Props = {
    searchParams: Promise<{
        tab?: CompanyTab
    }>
}

export default async function Page({ searchParams }: Props) {
    const { tab } = await searchParams
    return <CompanyView tab={tab ?? "members"}/>
}