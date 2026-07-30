import LedgerLiteLogin from "@/components/signinclient";
import { getCurrentUser } from "../lib/authhelper";
import { redirect } from "next/navigation";

export default async function Signin() {
  const user = await getCurrentUser()
  if (user) {
    redirect("/dashboard")
  }
  return (
    <div>
      <LedgerLiteLogin />
    </div>
  )
}