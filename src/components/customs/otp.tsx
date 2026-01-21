"use client"

import { Base } from "@/components/customs/base";
import { ControlFunc } from "@/components/customs/types";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export const OTPInput: ControlFunc = props => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const REGEX_OTP_NUMBERS_VALIDATION: any = /^[0-9]+$/

    return <Base {...props}>{(field) => (
        <InputOTP {...field} maxLength={6} pattern={REGEX_OTP_NUMBERS_VALIDATION} disabled={props.isPending} >
            <InputOTPGroup><InputOTPSlot index={0} /></InputOTPGroup>
            <InputOTPGroup><InputOTPSlot index={1} /></InputOTPGroup>
            <InputOTPGroup><InputOTPSlot index={2} /></InputOTPGroup>
            <InputOTPGroup><InputOTPSlot index={3} /></InputOTPGroup>
            <InputOTPGroup><InputOTPSlot index={4} /></InputOTPGroup>
            <InputOTPGroup><InputOTPSlot index={5} /></InputOTPGroup>
        </InputOTP>
    )}</Base>
}