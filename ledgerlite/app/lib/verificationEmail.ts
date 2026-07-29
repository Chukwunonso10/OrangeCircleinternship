import { Resend } from "resend";
import { EmailTemplate } from "../components/reactEmail";
import { NextResponse } from "next/server";

export async function VerificationEmail(to: string, code: string) {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to,
        subject: "verify your email",
        react: EmailTemplate({ code })
    })

    if(error){
        return NextResponse.json({
            success: false, message: "send email error"
        })
    }

    return data;
}