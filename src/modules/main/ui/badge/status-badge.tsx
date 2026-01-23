import { IconAlertTriangle, IconCancel, IconClock, IconContract, IconFileTime, IconForklift, IconInvoice, IconPencilMinus, IconRosetteDiscountCheck, IconRoute, IconTruckDelivery, IconTruckLoading, IconUrgent, } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";

export type StatusKey = "drafted" | "prospect" | "pending" | "booked" | "at-loading" | "loading" | "in-transit" | "at-border" | "stopped" | "at-offloading" | "offloading" | "delivered" | "completed" | "cancelled" | "waiting-documents";

const statusIcons: Record<StatusKey, React.ReactNode> = {
    drafted: <IconPencilMinus size={14} />,
    prospect: <IconInvoice size={14} />,
    pending: <IconClock size={14} />,
    booked: <IconContract size={14} />,
    "at-loading": <IconTruckLoading size={14} />,
    loading: <IconForklift size={14} />,
    "in-transit": <IconRoute size={14} />,
    "waiting-documents": <IconFileTime size={14} />,
    stopped: <IconAlertTriangle size={14} />,
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
            className="status px-2 py-1 gap-1.5 inline-flex items-center rounded-full text-xs border-2 font-semibold"
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

