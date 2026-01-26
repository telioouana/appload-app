import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, } from "@/components/ui/card"

export function OrdersLoadingFallback() {
    return (
        <div className="flex flex-col gap-8 h-full w-full p-4">
            <div className="flex justify-between items-center gap-4">
                <div><Skeleton className="h-8 w-54" /></div>
                <div><Skeleton className="h-8 w-16" /></div>
            </div>
            <div className="grid col-auto xl:grid-cols-4 gap-8 h-full w-full">
                {Array.from({ length: 8 }).map((_, index) => (
                    <Card className="w-full max-w-md" key={index}>
                        <CardHeader className="flex items-center justify-between gap-4">
                            <div><Skeleton className="h-3.5 w-20" /></div>
                            <div><Skeleton className="h-3.5 w-20" /></div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col gap-1.5">
                                    <span><Skeleton className="h-2.5 w-16" /></span>
                                    <span><Skeleton className="h-3.5 w-24" /></span>
                                </div>
                                <div className="flex flex-col gap-1.5 items-end">
                                    <span><Skeleton className="h-2.5 w-8" /></span>
                                    <span><Skeleton className="h-3.5 w-8" /></span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <span><Skeleton className="h-2.5 w-16" /></span>
                                <div className="grid grid-cols-2 items-center">
                                    <div className="flex flex-col gap-1.5">
                                        <span><Skeleton className="h-2.5 w-6" /></span>
                                        <span><Skeleton className="h-3.5 w-16" /></span>
                                    </div>

                                    <div className="flex flex-col gap-1.5 items-end">
                                        <span><Skeleton className="h-2.5 w-6" /></span>
                                        <span><Skeleton className="h-3.5 w-16" /></span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <span><Skeleton className="h-2.5 w-20" /></span>
                                <span><Skeleton className="h-3.5 w-16" /></span>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <span><Skeleton className="h-2.5 w-10" /></span>
                                <div className="grid grid-cols-2 items-center">
                                    <div className="flex flex-col gap-1.5">
                                        <span><Skeleton className="h-2.5 w-6" /></span>
                                        <span><Skeleton className="h-3.5 w-24" /></span>
                                    </div>

                                    <div className="flex flex-col gap-1.5 items-end">
                                        <span><Skeleton className="h-2.5 w-6" /></span>
                                        <span><Skeleton className="h-3.5 w-24" /></span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <div className="flex items-center justify-between gap-4 w-full">
                                <div className="w-full"><Skeleton className="h-8 w-full" /></div>
                                <div className="w-full"><Skeleton className="h-8 w-full" /></div>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
