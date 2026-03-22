import { FullOrganization } from "@/backend/auth/types";
import { DetailsSection } from "../components/sections/details-section";

interface Props {
    organization: FullOrganization
}

export function OrganizationManagementView({ organization }: Props) {
    const company = {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        createdAt: organization.createdAt,
        logo: organization.logo,
        metadata: organization.metadata,
        nuit: organization.nuit,
        type: organization.type,
        status: organization.status,
        email: organization.email,
        phoneNumber: organization.phoneNumber,
        billingAddress: organization.billingAddress,
        physicalAddress: organization.physicalAddress,
        subscriptionPlan: organization.subscriptionPlan,
        subscriber: organization.subscriber,
    }

    return (
        <div className="space-y-3">
            <DetailsSection company={company} />
        </div>
    )
}
