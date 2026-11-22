"use client"

import { useAuthenticator } from "@aws-amplify/ui-react"
import { redirect, useRouter } from "next/navigation"
import { fetchAuthSession } from 'aws-amplify/auth'
import { useState, useEffect } from "react"
//import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context"

const showDashAPI = "https://ehkpleh7v4.execute-api.us-east-1.amazonaws.com/prod/api/dcShowDash"

export default function Dashboard() {
  const router = useRouter();
  //one variable decleration instead of two seperate ones
  const {authStatus, user} = useAuthenticator((context) => [
    context.authStatus,
    context.user
  ])
  // if (authStatus === "unauthenticated") {
  //   redirect("/login?return=dashboard")
  // }

  const [result, setResult] = useState<unknown>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if(authStatus === "unauthenticated") {
      router.replace("/login?return=dashboard")
    }
  }, [authStatus, router])

  useEffect(() =>  {
    if(authStatus !== "authenticated") return

    async function callApi(){
      try {
        //
        const { tokens } = await fetchAuthSession()
        const idToken = tokens?.idToken?.toString()
        console.log('ID token:', tokens?.idToken?.toString())
        //console.log('asdasdadasdasdsadasdasdsadsaasdasdasdasd')
        if(!idToken) throw new Error("No ID token in session")
        console.log('Access token:', tokens?.accessToken?.toString())

        const userId = tokens?.idToken?.payload.sub as string

        
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      } 
    }
    callApi()
  }, [authStatus]);



  return (
    <div>
      {JSON.stringify(authStatus)}
      <p>Welcome {JSON.stringify(user)}</p>
      <a href="/logout">Sign out</a>
      <div>
        <p>Dashboard Information</p>
      </div>
    </div>


  );
}


