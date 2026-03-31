"use client"

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { IconBuilding, IconEdit, IconSettings } from "@tabler/icons-react";

import { Organization } from "@/backend/auth/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { usePersonilizePreferences } from "../../hooks/use-personalize-preferences";
import { PersonalizePreferencesDialog } from "../dialog/personalize-preferences-dialog";

import { themes } from "@/theme/theme-colors";
import { getSafePrivateColor } from "@/theme/theme-provider";

interface Props {
    company: Organization
}

export function DetailsSection({ company }: Props) {
    const t = useTranslations("User.account.organization.views.details.main");
    const { onOpenChange } = usePersonilizePreferences()
    const { resolvedTheme } = useTheme();

    // Read directly from our safe utility (no useState, no useEffect)
    const color = getSafePrivateColor();

    const mode = (resolvedTheme === "dark" ? "dark" : "light");
    const theme = themes[color][mode] || themes["amber"]["light"];

    return (
        <Card className="p-0 border-2 border-orange-500">
            <CardContent className="rounded-xl p-4 transition-all">
                <div className="flex items-start gap-4">
                    <div
                        className="size-16 rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
                        style={{
                            backgroundColor: `color-mix(in srgb, ${theme.accent}, transparent 90%)`,
                        }}
                    >
                        {company.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                        ) : (
                            <IconBuilding className="size-8" style={{ color: theme.accent }} />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                                <h3 className="text-gray-900 dark:text-white font-medium">{company.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t("nuit", { nuit: company.nuit })}</p>
                            </div>
                            <span className="px-2 py-1 bg-[#ff5722]/10 text-[#ff5722] text-xs rounded-full">
                                {company.status}
                            </span>
                        </div>

                        {company.billingAddress?.address && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {company.billingAddress.address}
                            </p>
                        )}

                        {company.type === "shipper" && (
                            <div className="flex items-center gap-2 mb-3">
                                <div
                                    className="size-6 rounded border border-gray-200 dark:border-gray-700"
                                    style={{ backgroundColor: theme.accent }}
                                />
                                <span className="text-xs text-gray-500 dark:text-gray-400">{t("brand")}</span>
                            </div>
                        )}

                        <PersonalizePreferencesDialog color={color}/>
                        <div className="flex items-center gap-2">
                            <Button
                                disabled
                                size="sm"
                                variant="secondary"
                                className="text-xs"
                            >
                                <IconEdit className="size-3" />
                                {t("actions.edit")}
                            </Button>

                            <Button
                                size="sm"
                                variant="secondary"
                                className="text-xs"
                                onClick={onOpenChange}
                            >
                                <IconSettings className="size-3" />
                                {t("actions.personalize")}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
