import { z } from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { redirect } from "next/navigation"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { IconLogin, IconAlertOctagon } from "@tabler/icons-react"

import { authClient } from "@/backend/auth/auth-client"

import { Button, } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { EmailInput } from "@/components/customs/email"
import { PhoneInput } from "@/components/customs/phone"
import { CheckboxInput } from "@/components/customs/checkbox"
import { PasswordInput } from "@/components/customs/password"
import { FieldGroup, FieldTitle } from "@/components/ui/field"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { countryCodes } from "@/lib/country-codes"

interface Props {
    callbackURL: string,
    isPending: boolean,
    setPending: (isPending: boolean) => void
}

export function SignInForm({
    callbackURL,
    isPending,
    setPending
}: Props) {
    const [tab, setTab] = useState<"email" | "phone">("email")
    const [status, setStatus] = useState<string | undefined>(undefined)

    const t = useTranslations("Auth.sign-in")

    const SignInFormSchema = z.object({
        country: z.string(),
        email: z.email({
            error: (issue) =>
                issue.input == undefined || issue.input == ""
                    ? t("form.tabs.email.field.error.empty")
                    : t("form.tabs.email.field.error.invalid")
        }),
        phoneNumber: z.string({ error: t("form.tabs.phone-number.field.error") }).nonempty({ error: t("form.tabs.phone-number.field.error") }),
        password: z.string({ error: t("form.password.error") }).nonempty({ error: t("form.password.error") }),
        rememberMe: z.boolean(),
    })

    type SignInFormType = z.infer<typeof SignInFormSchema>

    const form = useForm<SignInFormType>({
        resolver: zodResolver(SignInFormSchema),
        defaultValues: {
            country: "Mozambique",
            rememberMe: false
        }
    })

    function updateCountry(country: string) {
        form.setValue("country", country)
    }

    async function onSubmit(values: SignInFormType) {
        form.clearErrors()
        setStatus(undefined)

        let result

        if (tab === "email") {
            const output = await form.trigger(["email", "password"], { shouldFocus: true })
            if (!output) return

            result = await authClient.signIn.email({
                callbackURL,
                email: values.email,
                password: values.password,
                rememberMe: values.rememberMe,
            }, {
                onRequest: () => setPending(true),
            })
        } else {
            const output = await form.trigger(["country", "phoneNumber", "password"], { shouldFocus: true })
            if (!output) return

            values.phoneNumber = `${countryCodes.find(({ country }) => country === form.getValues().country)?.code}${values.phoneNumber}`

            result = await authClient.signIn.phoneNumber(values, {
                onRequest: () => setPending(true),
            })
        }

        if (result.error) {
            const { error } = result
            if (error.message) setStatus(error.message)
            else if (error.status === 403) setStatus("FORBIDEN_ACCESS")
            else if (error.status === 404) setStatus("INVALID_CREDENTIALS")
            else setStatus("OTHER")
            setPending(false)
            return
        }

        redirect(callbackURL)
    }

    return (
        <form className="flex flex-col gap-y-4">
            <FieldGroup>
                <Tabs defaultValue={tab} className="w-full">
                    <FieldTitle>{t("form.tabs.title")}</FieldTitle>
                    <TabsList className="w-full">
                        <TabsTrigger value="email" onClick={() => setTab("email")}>{t("form.tabs.email.title")}</TabsTrigger>
                        <TabsTrigger value="phone" onClick={() => setTab("phone")}>{t("form.tabs.phone-number.title")}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="email" className="w-full">
                        <EmailInput
                            control={form.control}
                            name="email"
                            isPending={isPending}
                            placeholder={t("form.tabs.email.field.placeholder")}
                        />
                    </TabsContent>

                    <TabsContent value="phone" className="w-full">
                        <PhoneInput
                            control={form.control}
                            name="phoneNumber"
                            // eslint-disable-next-line react-hooks/incompatible-library
                            country={form.watch().country}
                            setCountry={updateCountry}
                            isPending={isPending}
                        />
                    </TabsContent>
                </Tabs>

                <PasswordInput
                    control={form.control}
                    name="password"
                    isPending={isPending}
                    label={t("form.password.label")}
                    placeholder={t("form.password.placeholder")}
                />

                <CheckboxInput
                    control={form.control}
                    name="rememberMe"
                    isPending={isPending}
                    label={t("form.remember-me")}
                />
            </FieldGroup>

            {!!status && (
                <Alert className="border-none" variant="destructive">
                    <AlertDescription className="flex items-center gap-2 font-medium">
                        <IconAlertOctagon className="size-4" />
                        {t(`form.errors.${status}`)}
                    </AlertDescription>
                </Alert>
            )}

            <Button
                type="button"
                className="w-full"
                disabled={isPending}
                onClick={() => onSubmit(form.getValues())}
            >
                {isPending
                    ? <Spinner />
                    : (
                        <div className="flex justify-center items-center">
                            <span>{t("form.button")}</span>
                            <IconLogin className="ml-1 size-3" />
                        </div>
                    )
                }
            </Button>
        </form>
    )
}