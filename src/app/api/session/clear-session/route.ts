import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
    const sessionCookies = await cookies();
    sessionCookies.delete("better-auth.dont_remember");
    sessionCookies.delete("better-auth.session_token");

    // Once cookies are gone, send them to sign-in
    redirect("/sign-in");
}