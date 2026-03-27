import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

import { apiAuthPrefix, apiFeedbackPrefix, authRoutes, publicRoutes } from "@/routes"

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const { nextUrl } = request

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isApiFeedbackRoute = nextUrl.pathname.startsWith(apiFeedbackPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    if (isApiAuthRoute || isApiFeedbackRoute) return NextResponse.next()

    if (isPublicRoute) {
        return NextResponse.redirect(new URL(
            "/sign-in",
            nextUrl
        ))
    }

    if (!isAuthRoute && !sessionCookie) {
        let callbackUrl = nextUrl.pathname
        if (nextUrl.search) {
            callbackUrl += nextUrl.search
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl)

        return NextResponse.redirect(new URL(
            `/sign-in?callbackUrl=${encodedCallbackUrl}`,
            nextUrl
        ));
    }

    if (isAuthRoute && sessionCookie) {
        const redirectUrl = new URL("/u/redirect", nextUrl);
        const callback =
            nextUrl.searchParams.get("callback") ??
            nextUrl.searchParams.get("callbackUrl");

        if (callback) {
            redirectUrl.searchParams.set("callback", callback);
        }

        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
}