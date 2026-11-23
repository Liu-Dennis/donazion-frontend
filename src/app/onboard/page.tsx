"use client"
import { useAuthenticator } from "@aws-amplify/ui-react"
import { redirect } from "next/navigation"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { fetchAuthSession } from "aws-amplify/auth"
import { Alert } from "react-bootstrap"
import { useState } from "react"

export default function Onboard() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus])
  // const { user } = useAuthenticator((context) => [context.user]);
  const [alert, setAlert] = useState("")

  if (authStatus === "unauthenticated") {
    redirect("/login?return=onboard")
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { tokens } = await fetchAuthSession()
    const formData = new FormData(e.target)
    const idToken = tokens?.idToken?.toString()

    try {
      const res = await fetch(
        "https://ojaff3t5pe.execute-api.us-east-1.amazonaws.com/prod/api/onboard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: idToken ?? "",
          },
          body: JSON.stringify({
            name: formData.get("dc-name"),
            address: formData.get("dc-address"),
            city: formData.get("dc-city"),
            state: formData.get("dc-state"),
            zipcode: formData.get("dc-zipcode"),
            lat: Number(formData.get("dc-long")),
            long: Number(formData.get("dc-lat")),
          }),
        },
      )

      if (!res.ok) {
        const msg = await res.json()
        setAlert(`An error has occured: ${msg.message}`)
        setTimeout(() => {
          setAlert("")
        }, 5000)
        return
      }
    } catch (error) {
      setAlert(JSON.stringify(error))
      return
    }
    redirect("/")
  }

  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ].map((state: string) => <option key={state}>{state}</option>)

  return (
    <Container className="mt-3">
      {alert && <Alert variant="danger">{alert}</Alert>}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Donation Center Onboarding</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                Finish your sign-up
              </Card.Subtitle>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Form.Group as={Col} controlId="formCenterName">
                    <Form.Label>Donation Center Name</Form.Label>
                    <Form.Control
                      name="dc-name"
                      required
                      type="text"
                      placeholder="DonyMcDon Place"
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      name="dc-address"
                      required
                      type="Address"
                      placeholder="123 Main St"
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} controlId="formCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      name="dc-city"
                      required
                      type="city"
                      placeholder="Boston"
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formState">
                    <Form.Label>State</Form.Label>
                    <Form.Select
                      name="dc-state"
                      required
                      defaultValue="Choose..."
                    >
                      <option disabled>Select...</option>
                      {states}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formZipCode">
                    <Form.Label>Zipcode</Form.Label>
                    <Form.Control
                      name="dc-zipcode"
                      required
                      type="text"
                      placeholder="12345"
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} controlId="formLongitude">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                      name="dc-long"
                      required
                      type="text"
                      placeholder="12.345"
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formLatitude">
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control
                      name="dc-lat"
                      required
                      type="text"
                      placeholder="67.890"
                    />
                  </Form.Group>
                </Row>
                <Button type="submit">Submit form</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
