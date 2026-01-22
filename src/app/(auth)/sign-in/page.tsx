import { SignInView } from "@/modules/auth/pages/sign-in/views/sign-in-view";

interface Props {
    searchParams: Promise<{
        callbackUrl?: string
    }>
}

export default async function Page({ searchParams }: Props) {
    const { callbackUrl } = await searchParams
    
    return <SignInView callback={callbackUrl}/>
}
