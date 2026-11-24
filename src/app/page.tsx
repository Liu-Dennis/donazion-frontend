"use client"
import Container from "react-bootstrap/Container"

export default function Home() {
  return (
    <Container>
      <ul>
        <li><link href="/login">Login</link><p>You cant log in if you are already logged on</p></li>
        <li><link href="/logout">Logout</link><p>Logout here</p></li>
        <li><link href="/onboard">Onboard</link><p>This completes the registration <strong>Attn: you can only onboard once per sign up ever!</strong></p></li>
        <li><link href="/dashboard">DC Dashboard</link><p>Manage your Center Dashboard</p></li>
        <li><link href="/donor">Donor Dashboard</link><p>Make and donate a box here</p></li>
      </ul>
    </Container>
  );
}
