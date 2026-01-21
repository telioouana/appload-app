import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, userAc, adminAc } from "better-auth/plugins/admin/access";

export const uac = createAccessControl({
    ...defaultStatements,
    organizations: ["create", "read", "update", "delete", "list", "block"]
})
export const user = uac.newRole({
    ...userAc.statements,
    organizations: ["create", "update", "read"]
})
export const manager = uac.newRole({
    ...userAc.statements,
    user: [...userAc.statements.user, "ban", "list", "update", "get"],
    organizations: ["create", "read", "update", "list", "block"]
})
export const admin = uac.newRole({
    ...adminAc.statements,
    organizations: ["create", "read", "update", "delete", "list", "block"]
})