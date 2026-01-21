"use client"

import { IconHash } from "@tabler/icons-react";

import { Base } from "@/components/customs/base";
import { ControlFunc } from "@/components/customs/types";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

export const NumberInput: ControlFunc = (props) => {
    return (
        <Base {...props}>
            {(field) => (
                <InputGroup>
                    <InputGroupInput
                        {...field}
                        type="number"
                        autoComplete="off"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={props.isPending}
                        placeholder={props.placeholder}
                    />

                    <InputGroupAddon>
                        <InputGroupText><IconHash /></InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
            )}
        </Base>
    )
}