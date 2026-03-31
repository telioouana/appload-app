import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

import { auth } from "@/backend/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export default async function Page({ searchParams }: { searchParams: Promise<{ callback: string }> }) {
    const { callback } = await searchParams;
    const sessionCookies = await cookies();

    const session = await auth.api.getSession({
        headers: await headers()
    });

    // FIX: Instead of sessionCookies.delete(), redirect to the API handler
    if (!session) {
        const dont_remember = sessionCookies.get("better-auth.dont_remember");
        const session_token = sessionCookies.get("better-auth.session_token");

        if (dont_remember || session_token) {
            redirect("/api/session/clear-session"); // Go here to handle the deletion
        }
        redirect("/sign-in");
    }

    const { user: { type, emailVerified }, session: { activeOrganizationId } } = session;

    if (type === "shipper" || type === "carrier") {
        const prefix = type.charAt(0); // 's' or 'c'

        if (!emailVerified) {
            redirect(`/u/${prefix}/account/profile`);
        }

        if (!activeOrganizationId) {
            redirect(`/u/${prefix}/account/organization`);
        }

        const callbarkURL = callback ? decodeURIComponent(callback) : null;

        if (callbarkURL && callbarkURL.startsWith(`/${prefix}`)) {
            redirect(callbarkURL);
        }
        redirect(`/${prefix}${DEFAULT_LOGIN_REDIRECT}`);
    }

    redirect("/unauthorized");
}