import { InvitationStatus } from "better-auth/plugins";

export type Invitation = {
    id: string;
    organizationId: string;
    email: string;
    role: "member" | "admin" | "owner";
    status: InvitationStatus;
    inviterId: string;
    expiresAt: Date;
    createdAt: Date;
    name: string;
} & {
    organizationName: string;
    organizationSlug: string;
    inviterEmail: string;
}