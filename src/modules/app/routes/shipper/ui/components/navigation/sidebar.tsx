"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { IconBuildingFactory, IconChecks, IconChevronRight, IconClock, IconDashboard, IconDeviceDesktopAnalytics, IconGavel, IconGlobe, IconHistory, IconInvoice, IconLock, IconMap, IconPackages, IconPencilMinus, IconTruck } from "@tabler/icons-react"

import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"

export function ShipperSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
    const t = useTranslations("Shipper.sidebar")
    const pathname = usePathname()

    const dashboard = [
        {
            label: t("content.dashboard"),
            url: "/s/dashboard",
            Icon: IconDashboard,
        },
        {
            label: t("content.kpis"),
            url: "/s/kpis",
            Icon: IconDeviceDesktopAnalytics,
        },
        {
            label: t("content.map"),
            url: "/s/map",
            Icon: IconMap,
        }
    ]

    const marketplace = [
        {
            label: t("content.marketplace.private.label"),
            url: "/s/private",
            Icon: IconLock,
            items: [
                {
                    label: t("content.marketplace.private.all"),
                    url: "/s/private/orders/all",
                    Icon: IconPackages,
                },
                {
                    label: t("content.marketplace.private.drafted"),
                    url: "/s/private/orders/drafted",
                    Icon: IconPencilMinus,
                },
                {
                    label: t("content.marketplace.private.open"),
                    url: "/s/private/orders/open",
                    Icon: IconClock,
                },
                {
                    label: t("content.marketplace.private.booked"),
                    url: "/s/private/orders/booked",
                    Icon: IconLock,
                },
                {
                    label: t("content.marketplace.private.on-going"),
                    url: "/s/private/orders/on-going",
                    Icon: IconTruck,
                },
                {
                    label: t("content.marketplace.private.delivered"),
                    url: "/s/private/orders/delivered",
                    Icon: IconChecks,
                },
                {
                    label: t("content.marketplace.private.history"),
                    url: "/s/private/orders/history",
                    Icon: IconHistory,
                },
                {
                    label: t("content.marketplace.private.transporters"),
                    url: "/s/private/transporters",
                    Icon: IconBuildingFactory,
                },
                {
                    label: t("content.marketplace.private.terms-and-conditions"),
                    url: "/s/private/terms-and-conditions",
                    Icon: IconGavel,
                }
            ]
        },
        {
            label: t("content.marketplace.public.label"),
            url: "/s/public/orders",
            Icon: IconGlobe,
            items: [
                {
                    label: t("content.marketplace.public.all"),
                    url: "/s/public/orders/all",
                    Icon: IconPackages,
                },
                {
                    label: t("content.marketplace.public.drafted"),
                    url: "/s/public/orders/drafted",
                    Icon: IconPencilMinus,
                },
                {
                    label: t("content.marketplace.public.open"),
                    url: "/s/public/orders/open",
                    Icon: IconClock,
                },
                {
                    label: t("content.marketplace.public.booked"),
                    url: "/s/public/orders/booked",
                    Icon: IconClock,
                },
                {
                    label: t("content.marketplace.public.on-going"),
                    url: "/s/public/orders/on-going",
                    Icon: IconTruck,
                },
                {
                    label: t("content.marketplace.public.delivered"),
                    url: "/s/public/orders/delivered",
                    Icon: IconChecks,
                },
                {
                    label: t("content.marketplace.public.history"),
                    url: "/s/public/orders/history",
                    Icon: IconHistory,
                },
                {
                    label: t("content.marketplace.public.terms-and-conditions"),
                    url: "/s/public/terms-and-conditions",
                    Icon: IconGavel,
                }
            ]
        }
    ]

    const others = [
        {
            label: t("content.other.market-data"),
            url: "/s/market-data",
            Icon: IconInvoice,
        }
    ]

    return (
        <Sidebar variant="floating" {...props}>
            <SidebarHeader>
                <div className="flex gap-2 items-start">
                    <div className="bg-sidebar-muted flex aspect-square size-12 items-center justify-center rounded-lg">
                        <Image src="/logos/logo-unlabel.svg" alt="appload" width={1} height={1} className="size-10" priority />
                    </div>
                    <div className="flex flex-col gap-1 leading-tight">
                        <span className="font-semibold">{t("header.app-name")}</span>
                        <span className="text-muted-foreground">{t("header.slogan")}</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {dashboard.map((item) => (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.label}
                                        isActive={pathname.startsWith(item.url)}
                                        className={cn(
                                            "h-9 hover:bg-linear-to-r/oklch border-transparent hover:border-[#E67623]/10 from-sidebar-primary from-5% via-30% via-sidebar-accent/20 to-sidebar/50 px-4",
                                            pathname.startsWith(item.url) && "bg-linear-to-r/oklch border-[#E67623]/10"
                                        )}
                                    >
                                        <Link href={item.url}>
                                            <item.Icon className="size-5!" stroke={1} />
                                            <span className="font-medium tracking-tight">
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <Separator />

                <SidebarGroup className="py-4">
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {marketplace.map((item) => {
                                const hasChildren = !!item.items?.length;

                                return (
                                    <Collapsible
                                        key={item.url}
                                        open={openSubmenu === item.url || pathname.startsWith(item.url)}
                                        onOpenChange={(isOpen) => {
                                            setOpenSubmenu(isOpen ? item.url : null)
                                        }}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton
                                                    // Only use asChild when we are actually wrapping a Link component
                                                    asChild={!hasChildren}
                                                    tooltip={item.label}
                                                    isActive={pathname.startsWith(item.url)}
                                                    className={cn(
                                                        "h-9 hover:bg-linear-to-r/oklch border-transparent hover:border-[#E67623]/10 from-sidebar-primary from-5% via-30% via-sidebar-accent/20 to-sidebar/50 px-4",
                                                        pathname.startsWith(item.url) && "bg-linear-to-r/oklch border-[#E67623]/10"
                                                    )}
                                                >
                                                    {hasChildren ? (
                                                        /* Parent UI: Just a layout, no navigation */
                                                        <div className="flex w-full items-center gap-2">
                                                            <item.Icon className="size-5! shrink-0" stroke={1} />
                                                            <span className="font-medium tracking-tight flex-1 text-left">
                                                                {item.label}
                                                            </span>
                                                            <IconChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                        </div>
                                                    ) : (
                                                        /* Leaf UI: Standard navigation link */
                                                        <Link href={item.url}>
                                                            <item.Icon className="size-5!" stroke={1} />
                                                            <span className="font-medium tracking-tight">
                                                                {item.label}
                                                            </span>
                                                        </Link>
                                                    )}
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>

                                            {hasChildren && item.items?.length && (
                                                <CollapsibleContent>
                                                    <SidebarMenuSub className="mx-0 border-l-0 px-0 pl-3.5">
                                                        {item.items.map((subItem) => (
                                                            <SidebarMenuSubItem key={subItem.url} className="gap-2">
                                                                <SidebarMenuSubButton
                                                                    asChild
                                                                    isActive={pathname.startsWith(subItem.url)}
                                                                    className={cn(
                                                                        "h-9 hover:bg-linear-to-r/oklch border-transparent hover:border-[#E67623]/10 from-sidebar-primary from-5% via-30% via-sidebar-accent/20 to-sidebar/50 px-4",
                                                                        pathname.startsWith(subItem.url) && "bg-linear-to-r/oklch border-[#E67623]/10"
                                                                    )}
                                                                >
                                                                    <Link href={subItem.url}>
                                                                        <subItem.Icon className="size-5!" stroke={1} />
                                                                        <span className="tracking-tight">
                                                                            {subItem.label}
                                                                        </span>
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            )}
                                        </SidebarMenuItem>
                                    </Collapsible>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <Separator />

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {others.map((item) => (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.label}
                                        isActive={pathname.startsWith(item.url)}
                                        className={cn(
                                            "h-9 hover:bg-linear-to-r/oklch border-transparent hover:border-[#E67623]/10 from-sidebar-primary from-5% via-30% via-sidebar-accent/20 to-sidebar/50 px-4",
                                            pathname.startsWith(item.url) && "bg-linear-to-r/oklch border-[#E67623]/10"
                                        )}
                                    >
                                        <Link href={item.url}>
                                            <item.Icon className="size-5! " stroke={1} />
                                            <span className="font-medium tracking-tight">
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
