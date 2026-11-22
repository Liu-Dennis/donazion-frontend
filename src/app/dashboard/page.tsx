"use client"
import { useAuthenticator } from "@aws-amplify/ui-react";
import { redirect } from "next/navigation";
import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect } from "react";
import { useState } from "react"
import type { ChangeEvent } from "react"


const uploadItemsAPI = "https://3a0daglx54.execute-api.us-east-1.amazonaws.com/prod/api/uploadCategoryItem"

type Entry = { category: string; name: string; highLimit: number; lowLimit: number }

const blank = { category: "", name: "", highLimit: "", lowLimit: "" }

import { useAuthenticator } from "@aws-amplify/ui-react"
import { redirect, useRouter } from "next/navigation"
import { fetchAuthSession } from 'aws-amplify/auth'
import { useState, useEffect } from "react"
//import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context"

const showDashAPI = "https://ehkpleh7v4.execute-api.us-east-1.amazonaws.com/prod/api/dcShowDash"

type CategoryInfo = {
  cat_name: string;
  cat_itemCount: number;
  cat_totalValue: string
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

  const [form, setForm] = useState(blank)
  const [entries, setEntries] = useState<Entry[]>([])
  const [message, setMessage] = useState("")

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

        const userId = tokens?.idToken?.payload.sub as string
        console.log("to manually create thing with given user id:", userId)
        //const userId = "aa"
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



  // Bind an input to one field of the form
  const field = (key: keyof typeof blank) => ({
    value: form[key],
    onChange: (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value }),
  })

  function add() {
    const highLimit = Number(form.highLimit)
    const lowLimit = Number(form.lowLimit)

    // Only accept prices of 0 or more (blank fields count as 0 in Number(), so check them too)
    if (form.highLimit === "" || form.lowLimit === "" || !(highLimit >= 0) || !(lowLimit >= 0)) {
      setMessage("Prices must be 0 or more.")
      return
    }

    setEntries([...entries, { ...form, highLimit, lowLimit }])
    setForm(blank)
    setMessage("")
  }

  async function upload() {
    const { tokens } = await fetchAuthSession()
    const res = await fetch(uploadItemsAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": tokens?.idToken?.toString() ?? "" },
      body: JSON.stringify({ items: entries }),
    })
    const body = await res.json()

    if (res.ok) {
      setEntries([])
      setMessage("Uploaded")
    } else {
      setMessage(body.error)
    }
  }

  return (
    <div>
      <p>Welcome {user?.signInDetails?.loginId}</p>
      <a href="/logout">Sign out</a>
      <p>Upload items</p>
      <input placeholder="Category name" {...field("category")} />
      <input placeholder="Item name" {...field("name")} />
      <input placeholder="High price" type="number" {...field("highLimit")} />
      <input placeholder="Low price" type="number" {...field("lowLimit")} />
      <button onClick={add}>Add item</button>

      <ul>
        {entries.map((e, i) => (
          <li key={i}>{e.category}, {e.name}, high {e.highLimit}, low {e.lowLimit}</li>
        ))}
      </ul>

      <button onClick={upload}>Upload</button>
      <p>{message}</p>

      <div>
        <p>Dashboard Information</p>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {data && (
          <>
            <p>Grand items: {data.grandItems}</p>
            <p>Grand value: {data.grandValue}</p>
            <ul>
              {data.categoryInfo.map((c) => (
                <p key = {c.cat_name}>
                  {c.cat_name}: {c.cat_itemCount} item types, Total Value of ${c.cat_totalValue}
                </p>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}


