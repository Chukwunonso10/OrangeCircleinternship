import LedgerLiteLogin from "@/components/signinclient";
import { getCurrentUser } from "../lib/authhelper";
import { redirect } from "next/navigation";

export default async function Signin() {
  let user = null;
  try {
    user = await getCurrentUser();
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT") || error.digest === "DYNAMIC_SERVER_USAGE" || error.message?.includes("Dynamic server usage")) {
      throw error;
    }
    console.error("Database connection error in Signin page:", error);
  }
  if (user) {
    redirect("/dashboard")
  }
  return (
    <div>
      <LedgerLiteLogin />
    </div>
  )
}