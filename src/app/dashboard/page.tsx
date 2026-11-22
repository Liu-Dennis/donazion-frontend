"use client"
import { useAuthenticator } from "@aws-amplify/ui-react";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const { user } = useAuthenticator((context) => [context.user]);

  if (authStatus === "unauthenticated") {
    redirect("/login?return=dashboard");
  }

  useEffect(() =>  {
    async function fetch() {
      const { tokens } = await fetchAuthSession()
      console.log('ID token:', tokens?.idToken?.toString())
      console.log('Access token:', tokens?.accessToken?.toString())
    }
    fetch()
  }, []);


  return (
    <div>
      {JSON.stringify(authStatus)}
      <p>Welcome {JSON.stringify(user)}</p>
      <a href="/logout">Sign out</a>
    </div>
  );
}
import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect } from "react";

