import { IconTrash } from "@tabler/icons-react"
import { useTranslations } from "next-intl"

import { User } from "@/backend/auth/types"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { AvatarGenerator } from "@/components/customs/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

type Props = {
    user: User
}

export function PictureAndName({ user }: Props) {
    const t = useTranslations("Account.profile.picture-and-name")
    const { image, name } = user

    function avatar(className?: string) {
        if (image) {
            return (
                <Avatar className={className}>
                    <AvatarImage src={image} alt="avatar" />
                </Avatar>
            )
        }
        return <AvatarGenerator seed={name} className={className} />
    }
    return (
        <Card className="border-none">
            <CardContent className="flex gap-6 items-center justify-start">
                {avatar("size-40")}

                <div className="flex flex-col gap-4 w-full text-sm">
                    <div className="flex flex-col gap-2">
                        <p>{t("description")}</p>
                        <p className="text-xs text-muted-foreground">{t("instructions")}</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline">{t("buttons.change")}</Button>
                        <Button variant="destructive"><IconTrash /> {t("buttons.remove")}</Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t flex justify-between items-center gap-4 text-sm">
                <div className="inline-flex gap-2 leading-1 justify-between items-center w-full">
                    <span className="text-muted-foreground w-full">{t("name")}</span>
                    <span className="font-semibold w-full">{name}</span>
                </div>
                <div className="flex justify-end w-full items-end"><Button variant="link" className="text-sm font-normal hover:no-underline hover:text-primary/90 cursor-pointer px-0">{t("buttons.edit-name")}</Button></div>
            </CardFooter>
        </Card>
    )
}