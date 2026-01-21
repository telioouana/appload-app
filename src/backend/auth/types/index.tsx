import { Account as UserAccount, User as UserData } from "better-auth";
import { Organization as UserOrganization } from "better-auth/plugins";

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

export type Company = UserOrganization & {
    nuit: number;
    type: "shipper" | "carrier";
    status: "active" | "closed" | "pending";
    email: string;
    phoneNumber: string;
    billingAddress: string;
    physicalAddress: string;
    subscriptionPlan: "free" | "pro"
    subscriber?: string | null;
}

export type Organization = Company & {
    members: {
        id: string;
        organizationId: string;
        role: "admin" | "member" | "owner";
        createdAt: Date;
        userId: string;
        user: {
            id: string;
            email: string;
            name: string;
            image?: string | undefined;
        };
    }[]
    invitations: {
        id: string;
        organizationId: string;
        email: string;
        name: string;
        role: string;
        status: "pending" | "accepted" | "rejected" | "canceled";
        inviterId: string;
        expiresAt: Date;
        createdAt: Date;
        teamId?: string | null | undefined;
    }[]
}