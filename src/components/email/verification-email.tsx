import { getTranslations } from "next-intl/server";
import { Body, Button, Container, Head, Html, Img, Link, Preview, Section, Text, } from "@react-email/components";

import { TailwindProvider } from "@/components/providers/tailwind";

type Props = {
    url: string,
    name: string,

}

export async function VerificationEmail({ name, url }: Props) {
    const t = await getTranslations("Emails.verify-email")

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

                        <Section className="mt-8">
                            <Text className="text-2xl font-bold">{t("greeting", { username: name })}</Text>
                        </Section>

                        <Section className="mt-2">
                            <Text className="text-base">{t("intro")}</Text>
                        </Section>

                        <Section className="mt-2">
                            <Text className="text-base">{t("instruction")}</Text>
                        </Section>

                        <Section className="mt-2 text-center">
                            <Button
                                className="bg-brand flex w-fit items-center justify-center rounded-lg px-6 py-3 text-center text-sm font-semibold text-white"
                                href={url}
                            >
                                {t("cta")}
                            </Button>
                        </Section>

                        <Section className="mt-2 space-y-2">
                            <Text className="font-semibold text-lg">{t("section-title")}</Text>

                            <ul className="list-disc list-inside space-y-2">
                                <li className="text-base">{t("features.one")}</li>
                                <li className="text-base">{t("features.two")}</li>
                                <li className="text-base">{t("features.three")}</li>
                                <li className="text-base">{t("features.four")}</li>
                            </ul>
                        </Section>

                        <Section className="mt-2">
                            <Text className="text-base">{t("value-proposition")}</Text>
                        </Section>

                        <Section className="mt-2">
                            <Text className="text-sm text-muted">{t("disclaimer")}</Text>
                        </Section>

                        <Section className="mt-2 flex flex-col gap-1">
                            <Text className="text-base">{t("signature")}</Text>
                            <Text className="italic">{t("tagline")}</Text>
                            <Text className="text-[0.75rem]">{t("address")}</Text>
                        </Section>
                    </Container>
                </Body>
            </TailwindProvider>
        </Html>
    );
}
