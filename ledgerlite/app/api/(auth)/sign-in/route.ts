import { Verifypassword } from "@/app/lib/hashpassword";
import prisma from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({
                success: false, message: "Bad Request: email or password is required"
            }, { status: 400 })
        }

        const regexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!regexPattern.test(email)) {
            return NextResponse.json({
                success: false, message: "invalid email address"
            }, { status: 400 })
        }

        const lowerEmail = email.toLowerCase().trim()
        if (password.length < 8) {
            return NextResponse.json({
                success: false, message: "password must be a minimum of 8 characters"
            }, { status: 400 })
        }


        const user = await prisma.user.findUnique({ where: { email: lowerEmail } })
        if (!user) {
            return NextResponse.json({
                success: false, message: "Account Not Found"
            },{status: 404})
        }

        const isPassword = await Verifypassword(password, user.passwordHash)

        if (!isPassword) {
            return NextResponse.json({
                success: false, message: "password is incorrect"
            }, { status: 400 })
        }

        if (!user.isVerified) {
            return NextResponse.json({
                success: false, message: "unverified account, pls go to your email and verify your account"
            }, { status: 400 })
        }

        const sessionToken = crypto.randomUUID()
        const cookiesStore = await cookies()
        const isProduction = process.env.NODE_ENV === "production"

        await prisma.session.create({
            data: {
                sessionToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        })

        cookiesStore.set("sessionToken", sessionToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: 60*60*24
        })

        return NextResponse.json({
            success: true, message: "user successfully signed in", user: {
                userId: user.id,
                email: user.email,
                buisnessName: user.buisnessName,
                name: user.name
                
            }
        }, { status: 200 })

    } catch (error) {
        console.error("Error logging user in", error)
        return NextResponse.json({
            success: false, message: "internal server error"
        }, { status: 500 })
    }


}