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

export default function Dashboard() {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const { user } = useAuthenticator((context) => [context.user]);

  if (authStatus === "unauthenticated") {
    redirect("/login?return=dashboard");
  }

  const [form, setForm] = useState(blank)
  const [entries, setEntries] = useState<Entry[]>([])
  const [message, setMessage] = useState("")

  useEffect(() =>  {
    async function fetch() {
      const { tokens } = await fetchAuthSession()
      console.log('ID token:', tokens?.idToken?.toString())
      console.log('Access token:', tokens?.accessToken?.toString())
    }
    fetch()
  }, []);


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
      {JSON.stringify(authStatus)}
      <p>Welcome {JSON.stringify(user)}</p>
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
    </div>
  );
}



