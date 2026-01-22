import { desc, eq } from "drizzle-orm";
import { nextCookies } from "better-auth/next-js"
import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, organization, phoneNumber } from "better-auth/plugins";

import { db } from "@/backend/db";
import { sms } from "@/backend/twilio";
import { member as memberShema } from "@/backend/db/schema";
import { sendInviteEmail, sendVerificationEmail } from "@/backend/resend";
import { admin as orgAdmin, oac, owner, member } from "@/backend/auth/permissions/org.permissions";
import { admin as userAdmin, manager, uac, user } from "@/backend/auth/permissions/user.permissions";

const BETTER_AUTH_SITE_URL = process.env.BETTER_AUTH_URL!

export const auth = betterAuth({
    appName: "Appload App",
    baseURL: BETTER_AUTH_SITE_URL,
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    databaseHooks: {
        session: {
            create: {
                before: async (session) => {
                    const membership = await db
                        .query
                        .member
                        .findFirst({
                            where: eq(memberShema.userId, session.userId),
                            orderBy: desc(memberShema.createdAt),
                            columns: { organizationId: true }
                        })

                    return {
                        data: {
                            ...session,
                            activeOrganizationId: membership?.organizationId,
                        }
                    }
                }
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
    },
    emailVerification: {
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendVerificationEmail({
                email: user.email,
                name: user.name,
                url
            })
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5 // 5 Minutes
        }
    },
    user: {
        changeEmail: {
            enabled: true,
            sendChangeEmailConfirmation: async ({ user, newEmail, url, token }) => {
                // TODO: Integrate your email service provider here
                console.log(`Send verification email to change ${user.email} to ${newEmail} with url: ${url} and token: ${token}`);
            }
        },
        additionalFields: {
            type: {
                required: true,
                type: ["appload", "shipper", "carrier", "driver"]
            },
            gender: {
                required: false,
                type: ["male", "female", "other"]
            },
            status: {
                required: true,
                type: ["active", "closed"],
                defaultValue: "active"
            },
        }
    },
    plugins: [
        phoneNumber({
            sendOTP: async ({ phoneNumber }) => {
                const { status } = await sms.verifications.create({
                    channel: "sms",
                    to: phoneNumber,
                })

                if (status !== "pending") {
                    let message: string
                    let statusCode: APIError["status"]

                    if (status === "max_attempts_reached") {
                        message = "MAX_REQUEST_OTP_REACHED"
                        statusCode = "TOO_MANY_REQUESTS"
                    } else if (status === "canceled") {
                        message = "REQUEST_OTP_CANCELED"
                        statusCode = "GONE"
                    } else if (status === "failed") {
                        message = "REQUEST_OTP_FAILED"
                        statusCode = "BAD_REQUEST"
                    } else {
                        message = "OTHER"
                        statusCode = "INTERNAL_SERVER_ERROR"
                    }
                    throw new APIError(statusCode, { message })
                }
            },
            verifyOTP: async ({ phoneNumber, code }) => {
                const { status } = await sms.verificationChecks.create({
                    to: phoneNumber,
                    code: code,
                })

                if (status !== "approved") {
                    let message: string
                    let statusCode: APIError["status"]

                    if (status === "max_attempts_reached") {
                        message = "MAX_VERIFY_OTP_REACHED"
                        statusCode = "TOO_MANY_REQUESTS"
                    } else if (status === "canceled") {
                        message = "VERIFY_OTP_CANCELED"
                        statusCode = "GONE"
                    } else if (status === "expired") {
                        message = "VERIFY_OTP_EXPIRED"
                        statusCode = "REQUEST_TIMEOUT"
                    } else if (status === "deleted") {
                        message = "VERIFY_OTP_DELETED"
                        statusCode = "NOT_FOUND"
                    } else if (status === "pending") {
                        message = "VERIFY_OTP_INVALID"
                        statusCode = "UNAUTHORIZED"
                    } else if (status === "failed") {
                        message = "VERIFY_OTP_FAILED"
                        statusCode = "BAD_REQUEST"
                    } else {
                        message = "OTHER"
                        statusCode = "INTERNAL_SERVER_ERROR"
                    }
                    throw new APIError(statusCode, { message })
                }

                return true
            }
        }),
        admin({
            ac: uac,
            roles: {
                admin: userAdmin,
                manager,
                user
            }
        }),
        organization({
            organizationLimit: 1,
            ac: oac,
            roles: {
                owner,
                admin: orgAdmin,
                member
            },
            schema: {
                organization: {
                    additionalFields: {
                        subscriptionPlan: {
                            type: ["free", "pro"],
                            required: true,
                            defaultValue: "free"
                        },
                        nuit: {
                            type: "number",
                            required: true,
                            unique: true,
                        },
                        type: {
                            required: true,
                            type: ["shipper", "carrier"]
                        },
                        status: {
                            required: true,
                            type: ["pending", "active", "closed"],
                            defaultValue: "pending"
                        },
                        email: {
                            type: "string",
                            required: true,
                        },
                        phoneNumber: {
                            type: "string",
                            required: true,
                        },
                        billingAddress: {
                            type: "string",
                            required: true,
                        },
                        physicalAddress: {
                            type: "string",
                            required: true,
                        }
                    }
                },
                invitation: {
                    additionalFields: {
                        name: {
                            type: "string",
                            required: true,
                        }
                    }
                }
            },
            sendInvitationEmail: async ({ email, inviter, invitation, organization }) => {
                await sendInviteEmail({
                    email: email,
                    inviter: inviter.user.name,
                    invitationId: invitation.id,
                    organization: organization.name,
                })
            }
        }),
        nextCookies(),
    ]
});