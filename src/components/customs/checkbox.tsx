"use client"

import { Base } from "@/components/customs/base";
import { Checkbox } from "@/components/ui/checkbox";
import { ControlFunc } from "@/components/customs/types";

export const CheckboxInput: ControlFunc = props => {
    return <Base
        {...props}
        horizontal
        controlFirst
    >
        {({ onChange, value, ...field }) => (
            <Checkbox {...field} checked={value} onCheckedChange={onChange} disabled={props.isPending} />
        )}
    </Base>
}