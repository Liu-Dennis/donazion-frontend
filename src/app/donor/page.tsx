"use client"

//import { useAuthenticator } from "@aws-amplify/ui-react"
//import { redirect, useRouter } from "next/navigation"
//import { fetchAuthSession } from 'aws-amplify/auth'
import { useState, useEffect } from "react"
import React from 'react'
import { Box, Item, Model } from './box'

const donateAPI = "https://3a0daglx54.execute-api.us-east-1.amazonaws.com/prod/api/donate"

type notDonated = {
    itemId: number
    value: number
    reason: string
}

export default function donorDashboard() {
    const[model, setBox] = React.useState(new Model())
    const[redraw, setRedraw] = React.useState(0)

    const [message, setMessage] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [notDonated, setNotDonated] = useState<notDonated[]>([])
    
    const createBox = () => {
        const donationcenter_id = document.getElementById("donationcenter_id") as HTMLInputElement
        model.boxes.push(new Box(model.incBid(), donationcenter_id.value))
        setRedraw(redraw+1)
        //testing note, aa and ab are basically the only oens that are populated right now
        return 1;
    }

    const removeBox = (model: Model, boxIndex: number) => {
        const x = model.removeBox(boxIndex)
        setRedraw(redraw+1)
        return x
    }

    const removeItem = (box: Box, item_id: number) => {
        const x = box.removeItem(item_id)
        setRedraw(redraw+1)
        return x
    }

    const addItem = (box: Box, boxIndex: number) => {
        const idInput = document.getElementById(`iid-${boxIndex}`) as HTMLInputElement
        const valInput = document.getElementById(`value-${boxIndex}`) as HTMLInputElement

        const id = Number(idInput.value)
        const val = Number(valInput.value)
        if (idInput.value === "" || valInput.value === "" || Number.isNaN(id) || Number.isNaN(val)) {
            return false
        }
        (box.item ??= []).push(new Item(box.incUid(), id, val))
        idInput.value = ""
        valInput.value = ""
        setRedraw(redraw + 1)
        return true
    }

        const sendBox = async (box: Box, boxIndex: number) => {
        try {
            if(!box.item || box.item.length === 0) throw new Error("Add at least one item first")

            const res = await fetch(donateAPI, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"},
                body: JSON.stringify({
                    "destination" : box.dc_id,
                    "items" : box.item.map((it) => ({ itemId: it.item_id, value: it.item_value }))
                })
            })

            const body = await res.json()

            if(res.status == 400){
                setNotDonated(body.malformed ?? [])
                throw new Error(body.error ?? "Donation rejected")
            }

            if(!res.ok){
                throw new Error(`API Error ${res.status}: ${JSON.stringify(body)}`)
            }

            box.item = []
            setNotDonated(body.not_Donated ?? [])
            setError(null)
            setMessage(`${body.message}, total value of $${body.total_Value}`)
            setRedraw(redraw + 1)
            return true
        } catch (e) {
            setMessage("")
            setError(e instanceof Error ? e.message : String(e))
            return false
        }
    }

    return (
        <div>
            
            <div>
                <p>Please enter a valid Donation Center ID</p>
                <input id = "donationcenter_id" type="string" placeholder="Donation Center ID"></input>
                <button className="button" onClick= {() => createBox()}>Create Box</button>
                <br></br>
                <ul>
                    {model.boxes.map((box, boxIndex) => (
                    <li key={box.box_id ?? boxIndex}>
                        Box: {boxIndex + 1} Sending to Donation Center: {box.dc_id} &nbsp;
                        <button onClick ={() => removeBox(model, box.box_id)}> Remove? </button>
                    <ul>
                        {box.item?.map((item) => (
                    <li key={item.uid}>
                        Item: {item.item_id} Value: ${item.item_value} &nbsp; 
                        <button onClick={() => removeItem(box, item.uid)}> Remove? </button>
                    </li>
                    ))}
                    <input id={`iid-${boxIndex}`} type="text" placeholder="Item ID" />
                    <input id={`value-${boxIndex}`} type="text" placeholder="Item Value" />
                    <button onClick={() => addItem(box, boxIndex)}> Add Item </button>
                    <br></br>
                    <button onClick={() => sendBox(box, boxIndex)}> Send Box to Donation Center </button>
                </ul>
            </li>
            ))}
            </ul>
            <p>{message}</p>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {notDonated.length > 0 && (
                <>
                    <p>Items not donated:</p>
                    <ul>
                        {notDonated.map((m, i) => (
                            <li key={i}>Item {String(m.itemId)}: {m.reason}</li>
                        ))}
                    </ul>
                </>
            )}
            </div>
        </div>
    )
}