"use client"

import Link from "next/link"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { IconBuildingFactory, IconCaravan, IconChecks, IconClock, IconDashboard, IconDeviceDesktopAnalytics, IconFileInvoice, IconGlobe, IconHistory, IconInvoice, IconLock, IconPackages, IconPencilMinus, IconTruck, IconTruckDelivery, IconUsersGroup } from "@tabler/icons-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"

interface Props extends React.ComponentProps<typeof Sidebar> {
    type: "shipper" | "carrier" | "appload" | "driver"
}

export function MainSidebar({
    type,
    ...props
}: Props) {
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
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
                    label: t("shipper.marketplace.label"),
                    url: "/orders/marketplace",
                    Icon: IconLock,
                    items: [
                        {
                            label: t("shipper.marketplace.transporters"),
                            url: "/marketplace/list-transporters",
                            Icon: IconBuildingFactory,
                        },
                        {
                            label: t("shipper.marketplace.drafted"),
                            url: "/orders/marketplace/drafted",
                            Icon: IconPencilMinus,
                        },
                        {
                            label: t("shipper.marketplace.pending"),
                            url: "/orders/marketplace/pending",
                            Icon: IconClock,
                        },
                        {
                            label: t("shipper.marketplace.on-going"),
                            url: "/orders/marketplace/on-going",
                            Icon: IconTruck,
                        },
                        {
                            label: t("shipper.marketplace.delivered"),
                            url: "/orders/marketplace/delivered",
                            Icon: IconChecks,
                        }
                    ]
                },
                {
                    label: t("shipper.orders.label"),
                    url: "/orders/public",
                    Icon: IconGlobe,
                    items: [
                        {
                            label: t("shipper.orders.drafted"),
                            url: "/orders/public/drafted",
                            Icon: IconPencilMinus,
                        },
                        {
                            label: t("shipper.orders.pending"),
                            url: "/orders/public/pending",
                            Icon: IconClock,
                        },
                        {
                            label: t("shipper.orders.on-going"),
                            url: "/orders/public/on-going",
                            Icon: IconTruck,
                        },
                        {
                            label: t("shipper.orders.delivered"),
                            url: "/orders/public/delivered",
                            Icon: IconChecks,
                        }
                    ]
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
                            Icon: IconLock,
                        },
                        {
                            label: t("carrier.orders.public"),
                            url: "/orders/public",
                            Icon: IconGlobe,
                        },
                    ]
                },
                {
                    label: t("carrier.trips.label"),
                    url: "/trips",
                    Icon: IconTruckDelivery,
                    items: [
                        {
                            label: t("carrier.trips.pending"),
                            url: "/trips/pending",
                            Icon: IconGlobe,
                        },
                        {
                            label: t("carrier.trips.in-transit"),
                            url: "/orders/in-transit",
                            Icon: IconGlobe,
                        },
                        {
                            label: t("carrier.trips.delivered"),
                            url: "/orders/delivered",
                            Icon: IconGlobe,
                        },

                    ]
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
                                        <Collapsible
                                            key={item.url}
                                            open={openSubmenu === item.label} // Controlled state
                                            onOpenChange={(isOpen) => {
                                                // When opening, set this as the active submenu; when closing, clear it
                                                setOpenSubmenu(isOpen ? item.label : null)
                                            }}
                                        >
                                            <SidebarMenuItem className="mb-2">
                                                <CollapsibleTrigger asChild>
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
                                                </CollapsibleTrigger>

                                                {item.items?.length ? (
                                                    <CollapsibleContent>
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
                                                    </CollapsibleContent>
                                                ) : null}
                                            </SidebarMenuItem>
                                        </Collapsible>
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
