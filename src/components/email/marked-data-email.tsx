import { getTranslations } from "next-intl/server";
import { Body, Container, Head, Html, Img, Link, Preview, Section, Text } from "@react-email/components";

import { market } from "@/backend/db/schema";

import { TailwindProvider } from "@/components/providers/tailwind";

type Props = {
    requester: {
        name: string
        email: string
    }
    data: typeof market.$inferSelect
}

export async function MarketDataEmail({ requester, data }: Props) {
    const t = await getTranslations("Emails.market-data-email")

    return (
        <Html>
            <Head />
            <Preview>{t("preview")}</Preview>

            <TailwindProvider>
                <Body className="font-sans">
                    <Container className="mx-auto px-4 py-5">
                        <Section className="mt-2">
                            <Link href="https://appload.co.mz/">
                                <Img
                                    src="https://appload.co.mz/appload.svg"
                                    width="92"
                                    height="96"
                                    alt="appload Logo"
                                />
                            </Link>
                        </Section>

                        <Section className="mt-8 space-y-1">
                            <Text className="text-2xl font-bold">{t("title")}</Text>
                            <Text className="text-lg font-semibold">{t("intro", { name: requester.name })}</Text>
                            <Text className="text-base">{t("instructions")}</Text>
                        </Section>

                        <Section className="mt-2 space-y-1">
                            <Text className="text-lg font-semibold">{t("section_general")}</Text>
                            <Text className="text-muted-foreground text-base">{t("request_id", { id: data.legacyId.toString().padStart(4, "0") })}</Text>

                            <div className="gap-2 grid grid-cols-2">
                                <Text className="flex flex-col gap-1">
                                    <span>{t("loading")}</span>
                                    <span className="font-bold text-lg text-wrap">{data.loading[0].address}</span>
                                </Text>

                                <Text className="flex flex-col gap-1">
                                    <span>{t("offloading")}</span>
                                    <span className="font-bold text-lg text-wrap">{data.offloading[0].address}</span>
                                </Text>
                            </div>
                        </Section>

                        <Section className="mt-2 space-y-1">
                            <Text className="text-lg font-semibold">{t("section_cargo")}</Text>
                            
                            <Text className="flex justify-between items-center gap-1">
                                <span>{t("category.label")}</span>
                                <span className="font-bold text-lg text-wrap">{t(`category.options.${data.category}`)}</span>
                            </Text>

                            <Text className="flex justify-between items-center gap-1">
                                <span>{t("quantity")}</span>
                                <span className="font-bold text-lg text-wrap">{data.quantity} {data.unit}</span>
                            </Text>
                        </Section>

                        <Section className="mt-2 flex flex-col gap-1">
                            <Text className="italic">{t("tagline")}</Text>
                            <Text className="text-[0.75rem]">{t("address")}</Text>
                        </Section>
                    </Container>
                </Body>
            </TailwindProvider>
        </Html>
    );
}
