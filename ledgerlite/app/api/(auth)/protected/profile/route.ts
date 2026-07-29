import { getCurrentUser } from "@/app/lib/authhelper";
import { HashPassword, Verifypassword } from "@/app/lib/hashpassword";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type update = {
    name?: string
    buisnessName?: string
    passwordHash?: string
    newPassword?: string
    image?: string | null
}
export async function GET() {
    try {
        const user = await getCurrentUser()
        if
            (!user) {
            return NextResponse.json({
                success: false, message: "Unauthorized!"
            }, { status: 403 })
        }

        return NextResponse.json({
            success: true, message: "successfull",
            profile: {
                id: user.id,
                name: user.name,
                buisnessName: user.buisnessName,
                email: user.email,
                isVerified: user.isVerified,
                image: user.image,
                createdAt: user.createdAt
            }
        }, { status: 200 })
    } catch (error) {
        console.error("error retrieving profile information")
        return NextResponse.json({
            success: false, message: "internal server error"
        })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({
                success: false, message: "Unauthorized!"
            }, { status: 403 })
        }

        const { name, buisnessName, password, newPassword, image } = await req.json()
        let needRevocation = false
        const updateData: update = {}

        if (name !== undefined) {
            updateData.name = name
        }

        if (buisnessName !== undefined) {
            updateData.buisnessName = buisnessName
        }

        if (image !== undefined) {
            updateData.image = image
        }
        //only verify password if their is a password field
        if (newPassword) {
            let isCurrentPassWordCorrect = await Verifypassword(password, user.passwordHash)

            if (!isCurrentPassWordCorrect) {
                return NextResponse.json({
                    success: false, message: "incorrect password"
                })
            }

        }

        if (newPassword && newPassword !== "") {
            if (newPassword.length < 8) {
                return NextResponse.json({
                    success: false, message: "passwords must be 8 characters long"
                }, { status: 400 })
            }

            const passwordhash = await HashPassword(newPassword)
            updateData.passwordHash = passwordhash

            needRevocation = true
        }

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: updateData
        })


        if (needRevocation) {
            await prisma.session.deleteMany({ where: { id: user.id } })
        }

        let message = "updated successfully"
        if (needRevocation) {
            message = "Password Changed. All active sessions has been deleted!"
        } else if (name) {
            message = "name changed successfully"
        } else if (buisnessName) {
            message = "buisnessName changed successfully"
        } else { message }


        return NextResponse.json({
            success: true, message, updated
        }, { status: 200 })
    } catch (error) {
        console.log("failed to update")
        return NextResponse.json({
            success: false, message: "Internal server error"
        }, { status: 500 })
    }


}