"use client"
import { useAuthenticator } from "@aws-amplify/ui-react";
import { redirect } from "next/navigation";
import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect } from "react";
import { PassThrough } from "stream";

const API = "https://3a0daglx54.execute-api.us-east-1.amazonaws.com/prod/api/uploadCategoryItem"

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

  const uploadCategoryItem = async () => {
    const category = (document.getElementById("CategoryItem") as HTMLInputElement).value;
    const item = (document.getElementById("Item") as HTMLInputElement).value;
    const priceLow = (document.getElementById("priceLow") as HTMLInputElement).value;
    const priceHigh = (document.getElementById("priceHigh") as HTMLInputElement).value;

    PassThrough
  }
  return (
    <div>
      {JSON.stringify(authStatus)}
      <p>Welcome {JSON.stringify(user)}</p>
      <a href="/logout">Sign out</a>
      <p> Upload Category Item</p>
      <b>Category: </b><input id="CategoryItem" type="text"/>
      <b>Item Name: </b><input id="Item" type="text"/>
      <h2>Price</h2>
      <b>Price Low: </b><input id="priceLow" type="int"/>
      <b>Price High: </b><input id="priceHigh" type="int"/>
      <p></p>
      <button className="button" onClick={() => uploadCategoryItem()}>Upload Category Item</button>


    </div>
  );
}

