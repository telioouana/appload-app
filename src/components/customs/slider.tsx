"use client"

import { Slider } from "@/components/ui/slider";
import { Base } from "@/components/customs/base";
import { ControlFunc } from "@/components/customs/types";

import { cn } from "@/lib/utils";

export const SliderInput: ControlFunc<{
    max: number
    min: number
    step: number
    message: string
}> = ({
    max,
    min,
    step,
    message,
    ...props
}) => {
        return (
            <Base {...props}>
                {({ onChange, ...field }) => (
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex justify-end items-center gap-2 text-end text-sm">
                            <span className="text-muted-foreground">{message}</span>
                            <span className="text-primary font-semibold">{field.value}º C</span>
                        </div>
                        <Slider
                            defaultValue={field.value}
                            min={min}
                            max={max}
                            step={step}
                            onValueChange={(value) => {
                                onChange(value)
                            }}
                            className={cn("w-full")}
                            disabled={props.isPending}
                        />
                    </div>

                )}
            </Base>
        )
    }