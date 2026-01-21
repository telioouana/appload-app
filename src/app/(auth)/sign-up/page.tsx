import { Step } from "@/modules/auth/pages/sign-up/schema/validation";
import { SignUpView } from "@/modules/auth/pages/sign-up/views/sign-up-view";

type Props = {
    searchParams: Promise<{
        callback?: string
        step?: Step
    }>
}

export default async function Page({ searchParams }: Props) {
    const { callback, step } = await searchParams
    
    return <SignUpView
        callback={callback}
        step={step ?? "account-type"}
    />
}