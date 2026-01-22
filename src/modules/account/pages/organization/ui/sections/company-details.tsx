"use client"

import Link from "next/link";
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"

import { Organization } from "@/backend/auth/types";

import { Badge } from "@/components/ui/badge";
import { FieldGroup } from "@/components/ui/field";
import { TextInput } from "@/components/customs/text";
import { EmailInput } from "@/components/customs/email";
import { PhoneInput } from "@/components/customs/phone";
import { NumberInput } from "@/components/customs/number";
import { TextAreaInput } from "@/components/customs/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { countryCodes } from "@/lib/country-codes"
import { OrganizationForm, OrganizationFormSchema } from "@/modules/account/pages/organization/ui/schema/validation";

type Props = {
    organization: Organization
}
export function CompanyDetails({ organization }: Props) {
    const t = useTranslations("Account.organization.landing.details")

    const length = countryCodes.find(({ code }) => organization.phoneNumber.startsWith(code))?.code.length ?? 4
    const country = countryCodes.find(({ code }) => organization.phoneNumber.startsWith(code))?.country ?? "Mozambique"
    const { control } = useForm<OrganizationForm>({
        resolver: zodResolver(OrganizationFormSchema),
        defaultValues: {
            type: organization.type,
            country: country,
            name: organization.name,
            nuit: organization.nuit,
            email: organization.email,
            phoneNumber: organization.phoneNumber.substring(length),
            billingAddress: organization.billingAddress,
            physicalAddress: organization.physicalAddress,
        }
    })

    return (
        <Card>
            <CardHeader className="inline-flex justify-between items-center">
                <CardTitle>{t("title")}</CardTitle>

                {organization.status == "active"
                    ? (<Badge variant="success">{t("status.active")}</Badge>)
                    : organization.status == "pending"
                        ? (<Badge variant="default">{t("status.pending")}</Badge>)
                        : (<Badge variant="destructive">{t("status.closed")}</Badge>)
                }
            </CardHeader>
            <CardContent>
                <FieldGroup>
                    <TextInput
                        control={control}
                        name="name"
                        label={t("name")}
                        isPending={true}
                    />

                    <div className="flex gap-4 items-center justify-between">
                        <NumberInput
                            control={control}
                            name="nuit"
                            label={t("nuit")}
                            isPending={true}
                        />

                        <EmailInput
                            control={control}
                            name="email"
                            label={t("email")}
                            isPending={true}
                        />

                        <PhoneInput
                            control={control}
                            name="phoneNumber"
                            label={t("phone-number")}
                            country={country}
                            setCountry={() => { }}
                            isPending={true}
                        />
                    </div>

                    <div className="flex gap-4 items-center justify-between">
                        <div className="w-full">
                            <TextAreaInput
                                control={control}
                                name="billingAddress"
                                label={t("billing-address")}
                                isPending={true}
                            />
                        </div>

                        <div className="w-full">
                            <TextAreaInput
                                control={control}
                                name="physicalAddress"
                                label={t("physical-address")}
                                isPending={true}
                            />
                        </div>
                    </div>
                </FieldGroup>
            </CardContent>
            <CardFooter className="inline-flex gap-x-8 items-center text-sm border-t">
                <Link href="/company/details?editMode=true" className="text-primary hover:text-primary/90 cursor-pointer hover:underline hover:underline-offset-4">
                    {t("links.edit-company")}
                </Link>
            </CardFooter>
        </Card>
    )
}
