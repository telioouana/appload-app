"use client"

import { IconAbc } from "@tabler/icons-react";

import { Base } from "@/components/customs/base";
import { ControlFunc } from "@/components/customs/types";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";

export const TextAreaInput: ControlFunc = (props) => {
    return (
        <Base {...props}>
            {(field) => (
                <InputGroup>
                    <InputGroupTextarea
                        {...field}
                        rows={2}
                        autoComplete="off"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={props.isPending}
                        placeholder={props.placeholder}
                    />

                    <InputGroupAddon>
                        <InputGroupText><IconAbc /></InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
            )}
        </Base>
    )
}