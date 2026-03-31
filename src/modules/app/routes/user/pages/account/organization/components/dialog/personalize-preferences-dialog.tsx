"use client"

import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { IconCheck, IconChecks, IconX } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { cn } from "@/lib/utils"

import { usePersonilizePreferences } from "../../hooks/use-personalize-preferences"

import { ThemeColors } from "@/theme/theme-types"
import { setGlobalColorTheme } from "@/theme/theme-colors"

const COLORS: ThemeColors[] = ["amber", "blue", "cyan", "emerald", "fuchsia", "green", "indigo", "lime", "orange", "pink", "purple", "red", "rose", "sky", "teal", "violet", "yellow"]

export function PersonalizePreferencesDialog({ color }: { color: ThemeColors }) {
    const [selectedColor, setSelectedColor] = useState<ThemeColors>(color)
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    const t = useTranslations("User.account.organization.views.details.personalization")
    const router = useRouter()

    const { isOpen, onClose } = usePersonilizePreferences()
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        if (!api) return;

        const syncState = () => {
            setTimeout(() => {
                setCount(api.scrollSnapList().length);
                setCurrent(api.selectedScrollSnap() + 1);
            }, 0);
        };

        syncState();

        api.on("select", syncState);
        api.on("reInit", syncState);

        return () => {
            api.off("select", syncState);
            api.off("reInit", syncState);
        };
    }, [api]);

    function handleColorChange() {
        const mode = (resolvedTheme === "dark" ? "dark" : "light")
        localStorage.setItem("privateThemeColor", selectedColor);
        setGlobalColorTheme(mode, selectedColor)
        router.refresh() // Refresh to apply the new theme
        onClose() // Close the dialog after selection
    }

    return (
        <Dialog open={isOpen}>
            <DialogContent showCloseButton={false} className="p-0 md:max-w-xl">
                <DialogHeader className="border-b p-6">
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogDescription>{t("description")}</DialogDescription>

                    <DialogClose
                        onClick={onClose}
                        className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    >
                        <IconX className="size-4" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogHeader>

                <div className="px-6 overflow-hidden">

                    <div className="relative w-full">
                        <div className={cn(
                            "absolute left-12 top-0 bottom-0 w-12 z-10 bg-linear-to-r from-muted to-transparent pointer-events-none",
                            current === 1 && "hidden"
                        )} />

                        <Carousel
                            setApi={setApi}
                            opts={{
                                align: "start",
                                dragFree: true,
                            }}
                            className="w-full px-12"
                        >
                            <CarouselContent className="-ml-2">
                                <CarouselItem
                                    className="pl-2 basis-auto"
                                >
                                    <div
                                        className="size-16 rounded-lg cursor-pointer"
                                        style={{ backgroundColor: `var(--color-${color}-500)` }}
                                    >
                                        <div className="bg-neutral-200/30 flex items-center justify-center size-full rounded-lg">
                                            <IconChecks className="size-6 text-white" />
                                        </div>
                                    </div>
                                </CarouselItem>

                                {COLORS.filter(item => item !== color).map((item) => (
                                    <CarouselItem
                                        key={item}
                                        className="pl-2 basis-auto"
                                        onClick={() => setSelectedColor(item)}
                                    >
                                        <div
                                            className="size-16 rounded-lg cursor-pointer"
                                            style={{ backgroundColor: `var(--color-${item}-500)` }}
                                        >
                                            {item === selectedColor && (
                                                <div className="bg-neutral-200/30 flex items-center justify-center size-full rounded-lg">
                                                    <IconCheck className="size-6 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent >
                            <CarouselPrevious className="left-0 z-20" />
                            <CarouselNext className="right-0 z-20" />
                        </Carousel>

                        <div className={cn(
                            "absolute right-12 top-0 bottom-0 w-12 z-10 bg-linear-to-l from-muted to-transparent pointer-events-none",
                            current === count && "hidden"
                        )} />
                    </div >
                </div>

                <DialogFooter className="border-t p-6">
                    <Button
                        variant="success"
                        onClick={handleColorChange}
                        className="w-full"
                    >
                        <IconChecks />
                        {t("actions.apply")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}