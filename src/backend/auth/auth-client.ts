import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields, inferOrgAdditionalFields, organizationClient, phoneNumberClient } from "better-auth/client/plugins";

import { auth } from "@/backend/auth";
import { admin as userAdmin, manager, uac, user } from "@/backend/auth/permissions/user.permissions"
import { admin as orgAdmin, oac, owner, member } from "@/backend/auth/permissions/org.permissions";

export const authClient = createAuthClient({
    plugins: [
        adminClient({
            ac: uac,
            roles: {
                admin: userAdmin,
                manager,
                user
            }
        }),
        phoneNumberClient(),
        organizationClient({
            organizationLimit: 1,
            ac: oac,
            roles: {
                owner,
                admin: orgAdmin,
                member
            },
            schema: inferOrgAdditionalFields<typeof auth>(),
        }),
        inferAdditionalFields<typeof auth>(),
    ],
})