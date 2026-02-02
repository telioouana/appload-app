import { Card } from "@/components/ui/card";

import { Invitation } from "@/modules/account/pages/invites/types/invitation-type";
import { InvitesHeader } from "@/modules/account/pages/invites/section/invites-header";
import { InvitesFooter } from "@/modules/account/pages/invites/section/invites-footer";
import { InvitesContent } from "@/modules/account/pages/invites/section/invites-content";

type Props = {
    invitation: Invitation
}

export function InvitesView({ invitation }: Props) {
    return (
        <div className="h-full w-full items-center justify-center flex flex-col container-snap">
            <Card className="w-full max-w-lg">
                <InvitesHeader invitation={invitation} />
                <InvitesContent invitation={invitation} />
                <InvitesFooter invitation={invitation} />
            </Card>
        </div>
    )
}
