"use client"
import type { ChangeEvent } from "react"
import { useAuthenticator } from "@aws-amplify/ui-react"
import { redirect, useRouter } from "next/navigation"
import { fetchAuthSession } from 'aws-amplify/auth'
import { useState, useEffect } from "react"
import Link from 'next/link';
//import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context"





type Entry = { category: string; name: string; highLimit: number; lowLimit: number }

const blank = { category: "", name: "", highLimit: "", lowLimit: "" }
const showDashAPI = `${process.env.NEXT_PUBLIC_AWS_ENDPOINT}/dcShowDash`
const uploadItemsAPI = `${process.env.NEXT_PUBLIC_AWS_ENDPOINT}/uploadCategoryItem`
const addCatAPI = `${process.env.NEXT_PUBLIC_AWS_ENDPOINT}/addCat`
const dcDelete = `${process.env.NEXT_PUBLIC_AWS_ENDPOINT}/dcDelete`

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
  
  //Establishing variables to inherit data from messages
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function addCategoryAPI() {
      //ensure tokens exist
      const { tokens } = await fetchAuthSession()
      const idToken = tokens?.idToken?.toString()
      const accessToken = tokens?.accessToken?.toString()

      if(!idToken) throw new Error("No ID token in session")        
        
      if (!accessToken) throw new Error("No token in session")
      console.log('ID token:', idToken)
      console.log('Access token:', accessToken)

      //receive cat_name
      const name = document.getElementById("cat_name") as HTMLInputElement
      const cat_name = String(name.value)
      //lazy loading, orgo_id can only be 0
      const orgo_id = 0
      //console.log("this work?")
      const res = await fetch(addCatAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": idToken},
        body: JSON.stringify({
          "orgo_id" : orgo_id,
          "cat_name" : cat_name
        })
      })
      //console.log("here?")

      const body = await res.json()

      if(res.status == 400){
        throw new Error(body.error ?? "Invalid Authentication")
      }

      if(!res.ok){
        throw new Error('API Error ${res.status}: ${JSON.stringify(body)}')
      }
      return true
  }


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

    async function showDashbaordApi(){
      try {
        
        const { tokens } = await fetchAuthSession()
        const idToken = tokens?.idToken?.toString()
        const accessToken = tokens?.accessToken?.toString()

        if(!idToken) throw new Error("No ID token in session")        
        
        if (!accessToken) throw new Error("No token in session")
        
        //Testing stuff, should probably be deleted for security reasons
        //TODO
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
    showDashbaordApi()
  }, [authStatus]);


  //helper function for addCategoryItem
  // Bind an input to one field of the form
  const field = (key: keyof typeof blank) => ({
    value: form[key],
    onChange: (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value }),
  })


  //Helper function for addCategoryItem use case
  //Interprets button input and sends API request
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

  //Helper function for Delete DC
  async function deleteDC(){
    const { tokens } = await fetchAuthSession()
      const idToken = tokens?.idToken?.toString()
      const accessToken = tokens?.accessToken?.toString()

      if(!idToken) throw new Error("No ID token in session")
      if(!accessToken) throw new Error("No Access token in session")

      const userId = tokens?.idToken?.payload.sub as string

      const res = await fetch(dcDelete, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": idToken},
        body: JSON.stringify({
          "used_id":userId
        })
      }) 

      const body = await res.json()

      if(res.status == 400){
        throw new Error(body.error ?? "Invalid Authentication")
      }

      if(!res.ok){
        throw new Error('API Error ${res.status}: ${JSON.stringify(body)}')
      }
      return true
  }

  return (
    <div>
      <p>Welcome {user?.signInDetails?.loginId}</p>
      <Link href="/logout">Sign out</Link>
      <p>Create Category</p>
      <input id= "cat_name" type="text" placeholder="Category name"/>
      <button type= "button" onClick={() => addCategoryAPI()}>Create New Category</button>
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
      <div>
        <p>Do Not Delete Unless Sure</p>
        <button onClick={() => deleteDC()} style={{color:'black', backgroundColor:'red',}}>DELETE</button>
      </div>
    </div>
  );
}


