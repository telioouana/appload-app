import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form"
import { IconChevronRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FieldContent, FieldDescription, FieldGroup, FieldTitle } from "@/components/ui/field"

import { SignUpForm, Step } from "@/modules/auth/pages/sign-up/schema/validation"

interface Props {
    changeStep: (step: Step) => void
}

export function AccountType({ changeStep }: Props) {
    const t = useTranslations("Auth.sign-up.form")
    const { setValue, trigger, watch } = useFormContext<SignUpForm>()

    async function handleNext() {
        const output = await trigger(["step1.type"], { shouldFocus: true })
        if (!output) return

        changeStep("personal-details")
    }

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault()
                handleNext()
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    })

    return (
        <FieldGroup>
            <FieldContent>
                <FieldTitle className="w-full justify-center text-md font-semibold">{t("step1.title")}</FieldTitle>
                <FieldDescription>{t("step1.description")}</FieldDescription>
            </FieldContent>
            <Tabs defaultValue={watch().step1.type} className="w-full">
                <FieldTitle>{t("step1.tabs.title")}</FieldTitle>
                <TabsList className="w-full">
                    <TabsTrigger value="shipper" onClick={() => setValue("step1.type", "shipper")}>{t("step1.tabs.shipper.title")}</TabsTrigger>
                    <TabsTrigger value="carrier" onClick={() => setValue("step1.type", "carrier")}>{t("step1.tabs.carrier.title")}</TabsTrigger>
                </TabsList>

                <TabsContent value="shipper" className="w-full">
                    <FieldDescription className="text-justify text-xs">{t("step1.tabs.shipper.description")}</FieldDescription>
                </TabsContent>

                <TabsContent value="carrier" className="w-full">
                    <FieldDescription className="text-justify text-xs">{t("step1.tabs.carrier.description")}</FieldDescription>
                </TabsContent>
            </Tabs>

            <Button
                type="button"
                onClick={handleNext}
            >
                {t("step1.button")}
                <IconChevronRight />
            </Button>
        </FieldGroup>
    )
}