import { useTranslations } from "next-intl";

import { CURRENCY } from "@/backend/db/types";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { KPIs_TABS } from "../../../types/types";
import { CostsTab } from "../components/tabs/costs-tab";
import { IncidentsTab } from "../components/tabs/incidents-tab";
import { EfficiencyTab } from "../components/tabs/efficiency-tab";
import { OperationalTab } from "../components/tabs/operational-tab";

type Props = {
    data: { [x: string]: unknown }
    currency: typeof CURRENCY[number]
    setCurrency: (currency: typeof CURRENCY[number]) => void
    setTab: (tab: KPIs_TABS) => void
    tab: KPIs_TABS
}

export function KPIsDataSection({ data, currency, setCurrency, setTab, tab }: Props) {
    const t = useTranslations("Carrier.kpis.page.data")
    return (
        <Card>
            <Tabs value={tab} onValueChange={(value) => setTab(value as KPIs_TABS)}>
                <CardHeader className="flex flex-row justify-between items-center space-y-0">
                    <TabsList>
                        <TabsTrigger value="operational">{t("triggers.operational")}</TabsTrigger>
                        <TabsTrigger value="incidents">{t("triggers.incidents")}</TabsTrigger>
                        <TabsTrigger value="costs">{t("triggers.costs")}</TabsTrigger>
                        <TabsTrigger value="efficiency">{t("triggers.efficiency")}</TabsTrigger>
                    </TabsList>

                    <div className="hidden">
                        <Select
                            value={currency}
                            onValueChange={(value) => setCurrency(value as typeof CURRENCY[number])}
                        >
                            <SelectTrigger className="border-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CURRENCY.map((item, index) => <SelectItem key={index} value={item}>{item}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <TabsContent value="operational">
                        <OperationalTab data={data} />
                    </TabsContent>
                    <TabsContent value="incidents">
                        <IncidentsTab data={data} />
                    </TabsContent>
                    <TabsContent value="costs">
                        <CostsTab currency={currency} data={data} />
                    </TabsContent>
                    <TabsContent value="efficiency">
                        <EfficiencyTab data={data} />
                    </TabsContent>
                </CardContent>
            </Tabs>
        </Card>
    )
}
