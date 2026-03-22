export type Session = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined | undefined;
    userAgent?: string | null | undefined | undefined;
    city: string;
    country: string;
}

export type User = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    type: "appload" | "shipper" | "carrier" | "driver";
    status: "active" | "closed";
    gender?: "male" | "female" | "other" | null | undefined;
    phoneNumber?: string | null | undefined;
    phoneNumberVerified?: boolean | null | undefined;
    banned: boolean | null | undefined;
    role?: string | null | undefined;
    banReason?: string | null | undefined;
    banExpires?: Date | null | undefined;
    twoFactorEnabled: boolean | null | undefined;
}

export type TwoFactorData = {
    totpURI: string
    backupCodes: string[]
}

export type TFA = "default" | "verification" | "backup-codes"