"use client"
import { useAuthenticator } from "@aws-amplify/ui-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const { signOut } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    signOut()
    redirect("/")
  }, [signOut]);

  return (
    <>
    {/* Signing out, please wait to be redirected... */}
    </>
  );
}
