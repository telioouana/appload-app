"use client"

import { IconWeight } from "@tabler/icons-react";
import { Select as SelectPrimitive } from "radix-ui"

import { WEIGHT_UNIT } from "@/backend/db/types";

import { Base } from "@/components/customs/base";
import { ControlFunc } from "@/components/customs/types";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

export const WeightInput: ControlFunc<{
    value: typeof WEIGHT_UNIT[number]
    setValue: (value: typeof WEIGHT_UNIT[number]) => void
    disabled?: boolean
}> = ({
    value,
    setValue,
    disabled,
    ...props
}) => {
        return (
            <Base {...props}>
                {(field) => (
                    <InputGroup>
                        <InputGroupInput
                            {...field}
                            type="text"
                            // Use * for zero or more, or + for one or more numbers
                            pattern="[0-9]*"
                            className="w-full"
                            autoComplete="off"
                            value={field.value ?? ""}
                            onChange={(e) => {
                                // This regex removes anything that is NOT (^) a digit (0-9)
                                const sanitized = e.target.value.replace(/[^0-9]/g, "");

                                // Update the value directly
                                e.target.value = sanitized;

                                // Pass it to React Hook Form
                                field.onChange(e);
                            }}
                            disabled={props.isPending}
                            placeholder={props.placeholder}
                        />

                        <InputGroupAddon>
                            <InputGroupText><IconWeight /></InputGroupText>
                        </InputGroupAddon>

                        <InputGroupAddon align="inline-end">
                            <Select disabled={disabled} value={value} onValueChange={setValue}>
                                <SelectPrimitive.Trigger
                                    asChild
                                    className="ring-0 border-0 outline-0"
                                >
                                    <InputGroupButton
                                        variant="ghost"
                                        size="xs"
                                        className="ring-0 border-0 outline-0"
                                    >
                                        <SelectValue />
                                    </InputGroupButton>
                                </SelectPrimitive.Trigger>
                                <SelectContent align="end" position="popper">
                                    {WEIGHT_UNIT.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </InputGroupAddon>
                    </InputGroup>
                )
                }
            </Base >
        )
    }