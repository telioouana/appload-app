"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { IconBuildingFactory, IconCaravan, IconChecks, IconClock, IconDashboard, IconDeviceDesktopAnalytics, IconFileInvoice, IconHistory, IconInvoice, IconNetwork, IconPackages, IconPencilMinus, IconTruck, IconTruckDelivery, IconUsersGroup } from "@tabler/icons-react"

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"

interface Props extends React.ComponentProps<typeof Sidebar> {
    type: "shipper" | "carrier" | "appload" | "driver"
}

export function MainSidebar({
    type,
    ...props
}: Props) {
    const t = useTranslations("Main.sidebar")
    const pathname = usePathname()

    const top = [
        {
            label: t("dashboard.label"),
            url: "/dashboard",
            Icon: IconDashboard,
            items: [
                {
                    label: t("dashboard.kpis"),
                    url: "/dashboard/kpis",
                    Icon: IconDeviceDesktopAnalytics,
                }
            ]
        },
    ]

    const middle = [
        {
            id: "shipper",
            items: [
                {
                    label: t("shipper.orders.label"),
                    url: "/orders",
                    Icon: IconPackages,
                    items: [
                        {
                            label: t("shipper.orders.drafted"),
                            url: "/orders/drafted",
                            Icon: IconPencilMinus,
                        },
                        {
                            label: t("shipper.orders.pending"),
                            url: "/orders/pending",
                            Icon: IconClock,
                        },
                        {
                            label: t("shipper.orders.on-going"),
                            url: "/orders/on-going",
                            Icon: IconTruck,
                        },
                        {
                            label: t("shipper.orders.delivered"),
                            url: "/orders/delivered",
                            Icon: IconChecks,
                        }
                    ]
                },
                {
                    label: t("shipper.marketplace"),
                    url: "/marketplace",
                    Icon: IconNetwork,
                },
                {
                    label: t("shipper.quote"),
                    url: "/quote-requests",
                    Icon: IconInvoice,
                },
                {
                    label: t("shipper.offers"),
                    url: "/offers",
                    Icon: IconFileInvoice,
                },
                {
                    label: t("shipper.history"),
                    url: "/history",
                    Icon: IconHistory,
                }
            ]
        },
        {
            id: "carrier",
            items: [
                {
                    label: t("carrier.orders.label"),
                    url: "/orders",
                    Icon: IconPackages,
                    items: [
                        {
                            label: t("carrier.orders.marketplace"),
                            url: "/orders/marketplace",
                            Icon: IconNetwork,
                        },
                        {
                            label: t("carrier.orders.pending"),
                            url: "/orders/pending",
                            Icon: IconClock,
                        },
                        {
                            label: t("carrier.orders.on-going"),
                            url: "/orders/on-going",
                            Icon: IconTruck,
                        },
                        {
                            label: t("carrier.orders.delivered"),
                            url: "/orders/delivered",
                            Icon: IconChecks,
                        }
                    ]
                },
                {
                    label: t("carrier.trips"),
                    url: "/trips",
                    Icon: IconTruckDelivery,
                },
                {
                    label: t("carrier.quote"),
                    url: "/quote-requests",
                    Icon: IconInvoice,
                },
                {
                    label: t("carrier.history"),
                    url: "/history",
                    Icon: IconHistory,
                },
                {
                    label: t("carrier.fleet.label"),
                    url: "/fleet",
                    Icon: IconBuildingFactory,
                    items: [
                        {
                            label: t("carrier.fleet.drivers"),
                            url: "/fleet/drivers",
                            Icon: IconUsersGroup,
                        },
                        {
                            label: t("carrier.fleet.trucks"),
                            url: "/fleet/trucks",
                            Icon: IconTruck,
                        },
                        {
                            label: t("carrier.fleet.trailers"),
                            url: "/fleet/trailers",
                            Icon: IconCaravan,
                        },
                        {
                            label: t("carrier.fleet.links"),
                            url: "/fleet/links",
                            Icon: IconCaravan,
                        }
                    ]
                }
            ]
        }
    ]

    return (
        <Sidebar
            className="top-[calc(var(--header-height)+1rem)] h-[calc(100svh-var(--header-height)-1rem)]!"
            collapsible="icon"
            variant="inset"
            {...props}
        >
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {top.map((item) => (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.label}
                                        isActive={pathname.startsWith(item.url)}
                                        className={cn(
                                            "h-9 hover:bg-linear-to-r/oklch border-transparent hover:border-[#E67623]/10 from-sidebar-accent from-5% via-30% via-sidebar/20 to-sidebar/50 px-4",
                                            pathname.startsWith(item.url) && "bg-linear-to-r/oklch border-[#E67623]/10"
                                        )}
                                    >
                                        <Link href={item.url}>
                                            <item.Icon className="size-5" />
                                            <span className="text-sm font-medium tracking-tight">
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>

                                    {item.items?.length ? (
                                        <SidebarMenuSub className="mx-0 border-l-0 px-0 pl-3.5">
                                            {item.items.map((item) => (
                                                <SidebarMenuSubItem key={item.url}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={pathname.startsWith(item.url)}
                                                        className={cn(
                                                            "h-9 hover:bg-linear-to-r/oklch border-transparent hover:border-[#E67623]/10 from-sidebar-accent from-5% via-30% via-sidebar/20 to-sidebar/50 px-4",
                                                            pathname.startsWith(item.url) && "bg-linear-to-r/oklch border-[#E67623]/10"
                                                        )}
                                                    >
                                                        <Link href={item.url}>
                                                            <item.Icon className="size-5" />
                                                            <span className="text-sm font-medium tracking-tight">
                                                                {item.label}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    ) : null}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {middle.map(({ id, items }) => {
                                return id === type && (
                                    items.map((item) => (
                                        <SidebarMenuItem key={item.url} className="mb-2">
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={item.label}
                                                isActive={pathname.startsWith(item.url)}
                                                className={cn(
                                                    "h-9 hover:bg-linear-to-r/oklch border-transparent hover:border-[#E67623]/10 from-sidebar-accent from-5% via-30% via-sidebar/20 to-sidebar/50 px-4",
                                                    pathname.startsWith(item.url) && "bg-linear-to-r/oklch border-[#E67623]/10"
                                                )}
                                            >
                                                <Link href={item.url}>
                                                    <item.Icon className="size-5" />
                                                    <span className="text-sm font-medium tracking-tight">
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            </SidebarMenuButton>

                                            {item.items?.length ? (
                                                <SidebarMenuSub className="mx-0 border-l-0 px-0 pl-3.5">
                                                    {item.items.map((item) => (
                                                        <SidebarMenuSubItem key={item.url}>
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={pathname.startsWith(item.url)}
                                                                className={cn(
                                                                    "h-9 hover:bg-linear-to-r/oklch border-transparent hover:border-[#E67623]/10 from-sidebar-accent from-5% via-30% via-sidebar/20 to-sidebar/50 px-4",
                                                                    pathname.startsWith(item.url) && "bg-linear-to-r/oklch border-[#E67623]/10"
                                                                )}
                                                            >
                                                                <Link href={item.url}>
                                                                    <item.Icon className="size-5" />
                                                                    <span className="text-sm font-medium tracking-tight">
                                                                        {item.label}
                                                                    </span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            ) : null}
                                        </SidebarMenuItem>
                                    ))
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
