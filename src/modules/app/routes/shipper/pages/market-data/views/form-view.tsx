"use client"

import { z } from "zod"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IconArrowLeft, IconExclamationCircle, IconSearch, IconTrendingUp } from "@tabler/icons-react"

import { useTRPC } from "@/backend/trpc/client"
import { CATEGORIES, WEIGHT_UNIT } from "@/backend/db/types"

import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { SelectItem } from "@/components/ui/select"
import { SelectInput } from "@/components/customs/select"
import { WeightInput } from "@/components/customs/weight"
import { LocationInput } from "@/components/customs/location"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Schema } from "../../../schemas/market-data"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

export function FormView() {
    const [isSuccess, setSuccess] = useState<boolean>(false)

    const t = useTranslations("Shipper.market-data")
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    const MarketDataSchema = useMemo(() => Schema(t), [t])

    type MarketDataForm = z.infer<typeof MarketDataSchema>

    const form = useForm<MarketDataForm>({
        resolver: zodResolver(MarketDataSchema),
        defaultValues: {
            unit: "ton"
        }
    })

    const { isPending, mutateAsync } = useMutation(
        trpc.market.request.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(
                    trpc.market.history.infiniteQueryOptions({
                        limit: DEFAULT_PAGE_LIMIT
                    })
                )
                setSuccess(true)
            },
            onError: () => {
                // TODO: Notificaty user
            }
        })
    )

    async function handleSubmit(values: MarketDataForm) {
        form.clearErrors()
        await mutateAsync({ values })
    }

    return (
        <Card className="p-0">
            <CardContent className="px-4 md:px-6 lg:px-8 py-6 space-y-6">
                <CardHeader className="p-0 flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">{t("form.header.title")}</CardTitle>

                    <div className="">
                        <IconExclamationCircle className="text-destructive size-5" stroke={1.5} />
                    </div>
                </CardHeader>

                {!isSuccess
                    ? (
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <FieldGroup className="gap-4">
                                <LocationInput
                                    control={form.control}
                                    name={`loading.${0}.address`}
                                    label={t("form.loading.label")}
                                    placeholder={t("form.loading.placeholder")}
                                    isPending={form.formState.isSubmitting || isPending}
                                    setCountry={(value: string) => form.setValue(`loading.${0}.country`, value)}
                                    setPlaceId={(value: string) => form.setValue(`loading.${0}.placeId`, value)}
                                    setState={(value: string) => form.setValue(`loading.${0}.state`, value)}
                                />

                                <LocationInput
                                    control={form.control}
                                    name={`offloading.${0}.address`}
                                    label={t("form.offloading.label")}
                                    placeholder={t("form.offloading.placeholder")}
                                    isPending={form.formState.isSubmitting || isPending}
                                    setCountry={(value: string) => form.setValue(`offloading.${0}.country`, value)}
                                    setPlaceId={(value: string) => form.setValue(`offloading.${0}.placeId`, value)}
                                    setState={(value: string) => form.setValue(`offloading.${0}.state`, value)}
                                />

                                <SelectInput
                                    control={form.control}
                                    name="category"
                                    label={t("form.category.label")}
                                    placeholder={t("form.category.placeholder")}
                                    isPending={form.formState.isSubmitting || isPending}
                                >
                                    {CATEGORIES.map((item, index) => <SelectItem key={index} value={item}>{t(`form.category.options.${item}`)}</SelectItem>)}
                                </SelectInput>

                                <WeightInput
                                    control={form.control}
                                    name="quantity"
                                    label={t("form.quantity.label")}
                                    placeholder={t("form.quantity.placeholder")}
                                    isPending={form.formState.isSubmitting || isPending}
                                    value={form.watch("unit") as typeof WEIGHT_UNIT[number] ?? "ton"}
                                    setValue={(value: typeof WEIGHT_UNIT[number]) => form.setValue(`unit`, value)}
                                    disabled
                                />

                                <Button
                                    size="lg"
                                    disabled={form.formState.isSubmitting || isPending}
                                >
                                    <IconSearch />
                                    {t("form.footer.submit")}
                                </Button>
                            </FieldGroup>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center shrink-0">
                                        <IconTrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                                            {t("result.title")}
                                        </h3>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                                            {t("result.note")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="w-full"
                                variant="secondary"
                                onClick={() => {
                                    form.reset()
                                    setSuccess(false)
                                }}
                            >
                                <IconArrowLeft />
                                {t("result.footer.new-request")}
                            </Button>
                        </div>
                    )
                }
            </CardContent>
        </Card>
    )
}
