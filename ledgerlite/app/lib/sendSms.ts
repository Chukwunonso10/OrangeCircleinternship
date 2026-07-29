import { getCurrentUserId } from "./authhelper";

export async function Sendsms(to: string, body: string) {
    const userId = await getCurrentUserId()
    if (userId) return null

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NO;


    if (!accountSid || !authToken || !fromNumber) {
        return "invalid credentials, ensure you load  your SID credentials from .env"
    }

    try {
        const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
            method: "POST",
            headers: {
                "Content-Type": "x-form-www-urlencoded",
                "Authorization": "Basic " + Buffer.from(accountSid + ":" + authToken).toString("base64")
            },
            body: JSON.stringify({ to, body, fromNumber })

        })
        const data = await res.json()

        if (!res.ok && data.success) {
            return `${data.success} || Network error`
        }


        return data;
    } catch (error: any) {
        throw new Error(error.data || "failed to fetch records")
    }
}