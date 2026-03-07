"use client"

import { withMask } from "use-mask-input"
import { IconAbc } from "@tabler/icons-react";

import { Base } from "@/components/customs/base";
import { ControlFunc } from "@/components/customs/types";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

export const TextInput: ControlFunc<{
    hasInputMask?: boolean,
    inputMask?: string
}> = ({
    hasInputMask,
    inputMask,
    ...props
}) => {
        return (
            <Base {...props}>
                {(field) => (
                    <InputGroup>
                        {(hasInputMask && inputMask)
                            ? (
                                <InputGroupInput
                                    {...field}
                                    type="text"
                                    ref={withMask(inputMask, {
                                        placeholder: '-',
                                        showMaskOnHover: false
                                    })}
                                    className="w-full"
                                    autoComplete="off"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    disabled={props.isPending}
                                    placeholder={props.placeholder}
                                />
                            ) : (
                                <InputGroupInput
                                    {...field}
                                    type="text"
                                    className="w-full"
                                    autoComplete="off"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    disabled={props.isPending}
                                    placeholder={props.placeholder}
                                />
                            )
                        }

                        <InputGroupAddon>
                            <InputGroupText><IconAbc /></InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                )}
            </Base>
        )
    }