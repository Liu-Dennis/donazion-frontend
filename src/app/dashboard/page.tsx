"use client"
import { useAuthenticator } from "@aws-amplify/ui-react";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const { user } = useAuthenticator((context) => [context.user]);

  if (authStatus === "unauthenticated") {
    redirect("/login?return=dashboard");
  }

  return (
    <div>
      {JSON.stringify(authStatus)}
      <p>Welcome {JSON.stringify(user)}</p>
      <a href="/logout">Sign out</a>
    </div>
  );
}
