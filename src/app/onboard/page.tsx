"use client"
import { useAuthenticator } from "@aws-amplify/ui-react";
import { redirect } from "next/navigation";

export default function Onboard() {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  if (authStatus === "unauthenticated") {
    redirect("/login");
  }

  return (
    <div>
      {JSON.stringify(authStatus)}
      <p>Welcome {JSON.stringify(user)}</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}
