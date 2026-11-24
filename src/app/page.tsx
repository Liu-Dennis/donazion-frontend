"use client"
import Container from "react-bootstrap/Container"
import Link from 'next/link';

export default function Home() {
  return (
    <Container>
      <ul>
        <li><Link href="/login">Login</Link><p>You cant log in if you are already logged on</p></li>
        <li><Link href="/logout">Logout</Link><p>Logout here</p></li>
        <li><Link href="/onboard">Onboard</Link><p>This completes the registration <strong>Attn: you can only onboard once per sign up ever!</strong></p></li>
        <li><Link href="/dashboard">DC Dashboard</Link><p>Manage your Center Dashboard</p></li>
        <li><Link href="/donor">Donor Dashboard</Link><p>Make and donate a box here</p></li>
      </ul>
    </Container>
  );
}
