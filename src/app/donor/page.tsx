"use client"

import { useAuthenticator } from "@aws-amplify/ui-react"
import { redirect, useRouter } from "next/navigation"
import { fetchAuthSession } from 'aws-amplify/auth'
import { useState, useEffect } from "react"
import React from 'react'
import { Box, Item, Model } from './box'


export default function donorDashboard() {
    const[box, setBox] = React.useState(new Model())
    const[redraw, setRedraw] = React.useState(0)


    const createBox = () => {
        const donationcenter_id = document.getElementById("donationcenter_id") as HTMLInputElement
        box.boxes.push(new Box(donationcenter_id.value))
        console.log("Created new box of id: ", donationcenter_id.value)
        //testing note, aa and ab are basically the only oens that are populated right now
        return 1;
    }
    return (
        <div>
            
            <div>
                <p>Please enter a valid Donation Center ID</p>
                <input id = "donationcenter_id" type="string"></input>
                <button className="button" onClick= {() => createBox()}>Create Box</button>
            </div>
        </div>
    )
}