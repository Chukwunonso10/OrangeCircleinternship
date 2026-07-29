import { cookies } from "next/headers";
import prisma from "./prisma";
import { NextResponse } from "next/server";

export async function getCurrentUserId(){
  try {
    const cookiesStore = await cookies()
    const sessionToken = cookiesStore.get("sessionToken")?.value

    if(!sessionToken)return null;

    const session = await prisma.session.findUnique({
        where: {sessionToken}
    })

    if (!session) {
      cookiesStore.delete("sessionToken")
      return null
    }

    if (session && session.expiresAt < new Date()){
        await prisma.session.delete({where: {sessionToken}})
        cookiesStore.delete("sessionToken")
        return null
    }

    const userId = session.userId
    return userId;
  } catch (error: any) {
    if (error && (error.digest === 'DYNAMIC_SERVER_USAGE' || String(error.message).includes('Dynamic server usage'))) {
      throw error;
    }
    console.error("authentication error: unable to validate session", error)
    return null
  }
}

export async function getCurrentUser(){
  const cookiesStore = await cookies()
  const sessionToken = cookiesStore.get("sessionToken")?.value
  if(!sessionToken) return null

  const session = await prisma.session.findUnique({where: {sessionToken}, include: {user: true}})

  if(!session) {
    cookiesStore.delete("sessionToken")
    return null
  }

  const user = session.user
  return user;
}