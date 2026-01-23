import { FileText, Handshake, ClipboardCheck, Package, Truck, CheckCircle2, BadgeCheck, Ban, AlertTriangle, PackageCheck, Forklift, Columns4, PackageSearch, } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export type StatusKey = "drafted" | "prospect" | "pending" | "booked" | "at-loading" | "loading" | "in-trasit" | "at-border" | "stopped" | "at-offloading" | "offloading" | "delivered" | "completed" | "cancelled" | "waiting-documents";

const statusIcons: Record<StatusKey, React.ReactNode> = {
    drafted: <FileText size={14} />,
    prospect: <PackageSearch size={14} />,
    pending: <Handshake size={14} />,
    booked: <PackageCheck size={14} />,
    "at-loading": <Columns4 size={14} />,
    loading: <Forklift size={14} />,
    "in-trasit": <Truck size={14} />,
    "waiting-documents": <ClipboardCheck size={14} />,
    stopped: <AlertTriangle size={14} />,
    "at-border": <Package size={14} />,
    "at-offloading": <Columns4 size={14} />,
    offloading: <Forklift size={14} />,
    delivered: <CheckCircle2 size={14} />,
    completed: <BadgeCheck size={14} />,
    cancelled: <Ban size={14} />,
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

