"use client"

import { IconAbc } from "@tabler/icons-react";

import { Base } from "@/components/customs/base";
import { ControlFunc } from "@/components/customs/types";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

export const TextInput: ControlFunc = (props) => {
    return (
        <Base {...props}>
            {(field) => (
                <InputGroup>
                    <InputGroupInput
                        {...field}
                        type="text"
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