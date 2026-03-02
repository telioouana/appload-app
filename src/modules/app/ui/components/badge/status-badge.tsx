import { IconAlertTriangle, IconCancel, IconClock, IconContract, IconFileTime, IconForklift, IconInvoice, IconNavigationPause, IconPencilMinus, IconRosetteDiscountCheck, IconRoute, IconTruckDelivery, IconTruckLoading, IconUrgent, } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";

export type StatusKey = "drafted" | "prospect" | "open" | "booked" | "to-loading" | "at-loading" | "loading" | "on-route" | "at-border" | "stopped" | "issue" | "at-offloading" | "offloading" | "delivered" | "completed" | "cancelled" | "waiting-documents";

const statusIcons: Record<StatusKey, React.ReactNode> = {
    drafted: <IconPencilMinus size={14} />,
    prospect: <IconInvoice size={14} />,
    open: <IconClock size={14} />,
    booked: <IconContract size={14} />,
    "to-loading": <IconRoute size={14} />,
    "at-loading": <IconTruckLoading size={14} />,
    loading: <IconForklift size={14} />,
    "on-route": <IconRoute size={14} />,
    "waiting-documents": <IconFileTime size={14} />,
    stopped: <IconNavigationPause size={14} />,
    issue: <IconAlertTriangle size={14} />,
    "at-border": <IconUrgent size={14} />,
    "at-offloading": <IconTruckLoading size={14} />,
    offloading: <IconForklift size={14} />,
    delivered: <IconTruckDelivery size={14} />,
    completed: <IconRosetteDiscountCheck size={14} />,
    cancelled: <IconCancel size={14} />,
};

interface Props {
    label: string
    status: StatusKey
}

export function StatusBadge({ label, status }: Props) {
    return (
        <Badge
            variant="secondary"
            className="status px-2 py-1 gap-1.5 inline-flex items-center rounded-full text-sm border-none"
            style={{
                ["--status-text" as string]: `var(--status-${status}-text)`,
                ["--status-bg" as string]: `var(--status-${status}-bg)`,
            }}
        >
            {statusIcons[status]}
            {label}
        </Badge>
    )
}

