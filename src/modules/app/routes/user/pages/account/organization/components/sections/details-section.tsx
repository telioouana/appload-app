"use client"

import { useTheme } from "next-themes";
import { IconBuilding, IconEdit } from "@tabler/icons-react";

import { Organization } from "@/backend/auth/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { themes } from "@/theme/theme-colors";
import { getSafePrivateColor } from "@/theme/theme-provider";

interface Props {
    company: Organization
}

export function DetailsSection({ company }: Props) {
    const { resolvedTheme } = useTheme();
    
    // Read directly from our safe utility (no useState, no useEffect)
    const color = getSafePrivateColor();
    
    const mode = (resolvedTheme === "dark" ? "dark" : "light");
    const theme = themes[color][mode] || themes["amber"]["light"];

    return (
        <Card className="p-0 border-2 border-primary">
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
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">NUIT: {company.nuit}</p>
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
                                <span className="text-xs text-gray-500 dark:text-gray-400">Brand Color</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <Button
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                            >
                                <IconEdit className="size-3" />
                                Edit
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
