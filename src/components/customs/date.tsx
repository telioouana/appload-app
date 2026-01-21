"use client"

import { useState } from "react";
import { useFormatter } from "next-intl";
import { IconCalendar } from "@tabler/icons-react";

import { Base } from "@/components/customs/base";
import { Calendar } from "@/components/ui/calendar"
import { ControlFunc } from "@/components/customs/types";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

export const DateInput: ControlFunc = (props) => {
    const [open, setOpen] = useState(false)

    const f = useFormatter()

    return (
        <Base {...props}>
            {(field) => (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <InputGroup>
                            <InputGroupInput
                                {...field}
                                type="text"
                                value={field.value ? f.dateTime(field.value, {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                }) : ""}
                                disabled={props.isPending}
                                placeholder={props.placeholder}
                                readOnly
                            />

                            <InputGroupAddon>
                                <InputGroupText onClick={() => setOpen(true)}><IconCalendar /></InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </PopoverTrigger>
                    <PopoverContent className="w-full overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                                if (date) {
                                    field.onChange(date)
                                }
                                setOpen(false)
                            }}
                        />
                    </PopoverContent>
                </Popover>
            )}
        </Base>
    )
}