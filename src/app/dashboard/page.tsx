"use client"

import { useAuthenticator } from "@aws-amplify/ui-react"
import { redirect, useRouter } from "next/navigation"
import { fetchAuthSession } from 'aws-amplify/auth'
import { useState, useEffect } from "react"
//import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context"

const showDashAPI = "https://ehkpleh7v4.execute-api.us-east-1.amazonaws.com/prod/api/dcShowDash"

type CategoryInfo = {
  name: string;
  numItems: number;
  totalValue: number
}
type DashboardData = {
  grandItems: number;
  grandValue: number;
  categoryInfo: CategoryInfo[]
}

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

   const [data, setData] = useState<DashboardData | null>(null)
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
        const accessToken = tokens?.accessToken?.toString()

        if(!idToken) throw new Error("No ID token in session")        
        
        if (!accessToken) throw new Error("No token in session")
        console.log('ID token:', idToken)
        console.log('Access token:', accessToken)

        //const userId = tokens?.idToken?.payload.sub as string
        const userId = "aa"
        const res = await fetch(showDashAPI, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": idToken},
          body: JSON.stringify( {authCode: idToken, userId} )
        })

        const body = await res.json()

        if(res.status == 400){
          throw new Error(body.error ?? "Invalid Authentication")
        }

        if(!res.ok){
          throw new Error('API Error ${res.status}: ${JSON.stringify(body)}')
        }
        
        setData(body as DashboardData)
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      } 
    }
    callApi()
  }, [authStatus]);



  return (
    <div>
      <p>Welcome {user?.signInDetails?.loginId}</p>
      <a href="/logout">Sign out</a>

      <div>
        <p>Dashboard Information</p>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {data && (
          <>
            <p>Total items: {data.grandItems}</p>
            <p>Total value: ${Number(data.grandValue).toFixed(2)}</p>
            <ul>
              {data.categoryInfo.map((c) => (
                <li key={c.name}>
                  {c.name}: {c.numItems} items, ${c.totalValue.toFixed(2)}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}


