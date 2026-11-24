"use client"
import Container from "react-bootstrap/Container"

export default function Home() {
  return (
    <Container>
      <ul>
        <li><a href="/login">Login</a><p>You cant log in if you are already logged on</p></li>
        <li><a href="/logout">Logout</a><p>Logout here</p></li>
        <li><a href="/onboard">Onboard</a><p>This completes the registration <strong>Attn: you can only onboard once per sign up ever!</strong></p></li>
        <li><a href="/dashboard">DC Dashboard</a><p>Manage your Center Dashboard</p></li>
        <li><a href="/donor">Donor Dashboard</a><p>Make and donate a box here</p></li>
      </ul>
    </Container>
  );
}
