import { Address } from "@/backend/db/types";
import { InvitationStatus } from "better-auth/plugins";
import { Account as UserAccount, User as UserData } from "better-auth";

export type User = UserData & {
    banned: boolean | null | undefined;
    role?: string | null | undefined;
    banReason?: string | null | undefined;
    banExpires?: Date | null | undefined;
    phoneNumber?: string | null | undefined;
    phoneNumberVerified?: boolean | null | undefined;
    type: "appload" | "shipper" | "carrier" | "driver";
    gender?: "male" | "female" | "other" | null | undefined;
}

export type Account = UserAccount

export type Organization = {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    logo?: string | null | undefined | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: any;
    nuit: string;
    type: "shipper" | "carrier";
    status: "active" | "closed" | "pending";
    email: string;
    phoneNumber: string;
    billingAddress: Address | null;
    physicalAddress: Address | null;
    subscriptionPlan: "free" | "pro"
    subscriber?: string | null;
}

export type Member = {
    id: string;
    organizationId: string;
    role: "member" | "admin" | "owner";
    createdAt: Date;
    userId: string;
    user: {
        id: string;
        email: string;
        name: string;
        image?: string | undefined;
    };
}

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
}
export type FullOrganization = {
    members: Member[];
    invitations: Invitation[];
} & Organization

