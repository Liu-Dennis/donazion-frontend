"use client"
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Authenticator } from "@aws-amplify/ui-react";
import { redirect } from "next/navigation";

export default function Login() {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);

  if (authStatus === "authenticated") {
    redirect("/");
  }

  return (
    <Authenticator />
  );
}
