import { Card, CardContent, CardDescription } from '@/components/ui/card'

export function PageView() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold tracking-tight">Mapa</h2>
                <p className="text-muted-foreground">Veja a localização das suas cargas em andamento.</p>
            </div>

            <Card>
                <CardContent className="flex gap-8">
                    <CardDescription>Legend:</CardDescription>
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-blue-500" />
                        <span>Loading</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-green-500" />
                        <span>On Route</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-neutral-500" />
                        <span>Stopped</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-red-500" />
                        <span>Issue</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-purple-500" />
                        <span>Offloading</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
