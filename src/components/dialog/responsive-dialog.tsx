"use client"

import { IconX } from "@tabler/icons-react"

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    button?: React.ReactNode
    description?: string
    open: boolean
    onClose: () => void
    title: string
    type?: "dialog" | "sheet"
}

export function ResponsiveDialog({
    children,
    button,
    description,
    open,
    title,
    type,
    onClose,
    className,
}: Props) {
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <Drawer open={open}>
                <DrawerContent>
                    <DrawerHeader>
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex flex-col gap-2">
                                <DrawerTitle>{title}</DrawerTitle>
                                <DrawerDescription>{description}</DrawerDescription>
                            </div>

                            <div>{button}</div>
                        </div>

                        {!button && (
                            <DrawerClose
                                onClick={onClose}
                                className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                            >
                                <IconX className="size-4" />
                                <span className="sr-only">Close</span>
                            </DrawerClose>
                        )}
                    </DrawerHeader>

                    <div className="p-4 max-h-112 overflow-y-scroll container-snap">
                        {children}
                    </div>
                </DrawerContent>
            </Drawer>
        )
    }

    if (type && type === "dialog") {
        return (
            <Dialog open={open}>
                <DialogContent showCloseButton={false} className={cn(className)}>
                    <DialogHeader className="px-4">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex flex-col gap-2">
                                <DialogTitle>{title}</DialogTitle>
                                <DialogDescription>{description}</DialogDescription>
                            </div>

                            <div>{button}</div>
                        </div>

                        {!button && (
                            <DialogClose
                                onClick={onClose}
                                className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                            >
                                <IconX className="size-4" />
                                <span className="sr-only">Close</span>
                            </DialogClose>
                        )}
                    </DialogHeader>

                    <div className="h-full overflow-y-scroll container-snap p-4">
                        {children}
                    </div>
                </DialogContent>
            </Dialog>
        )
    } else {
        return (
            <Sheet open={open}>
                <SheetContent className={cn("w-full md:w-3/4 xl:w-2/4")} side="right" showCloseButton={false}>
                    <SheetHeader>
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex flex-col gap-2">
                                <SheetTitle>{title}</SheetTitle>
                                <SheetDescription>{description}</SheetDescription>
                            </div>

                            <div>{button}</div>
                        </div>

                        {!button && (
                            <SheetClose
                                onClick={onClose}
                                className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                            >
                                <IconX className="size-4" />
                                <span className="sr-only">Close</span>
                            </SheetClose>
                        )}
                    </SheetHeader>

                    <div className="h-full overflow-y-scroll container-snap p-4">
                        {children}
                    </div>
                </SheetContent>
            </Sheet>
        )
    }
}