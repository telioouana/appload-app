import twilio from "twilio"

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

const authToken = process.env.TWILIO_AUTH_TOKEN!
const accountSid = process.env.TWILIO_ACCOUNT_SID!
const serviceSid = process.env.TWILIO_SERVICE_SID!

export const sms = twilio(accountSid, authToken).verify.v2.services(serviceSid!)
