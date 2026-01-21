"use client"

import { IconListCheck } from "@tabler/icons-react";
import { PropsWithChildren } from "react";

import { Base } from "@/components/customs/base";
import { ControlFunc } from "@/components/customs/types";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"

export const SelectInput: ControlFunc<PropsWithChildren> = ({
    children,
    ...props
}) => {
    return (
        <Base {...props}>
            {({ onChange, onBlur, ...field }) => (
                <Select
                    {...field}
                    onValueChange={onChange}
                >
                    <SelectTrigger
                        id={field.id}
                        onBlur={onBlur}
                        disabled={props.isPending}
                        aria-invalid={field["aria-invalid"]}
                    >
                        <div className="flex items-center gap-3">
                            <IconListCheck />
                            <SelectValue placeholder={props.placeholder} />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        {children}
                    </SelectContent>
                </Select>
            )}
        </Base>
    )
}