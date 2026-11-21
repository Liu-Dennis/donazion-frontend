"use client"
import { useAuthenticator } from "@aws-amplify/ui-react";
import { redirect } from "next/navigation";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

export default function Onboard() {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const { user } = useAuthenticator((context) => [context.user]);

  if (authStatus === "unauthenticated") {
    redirect("/login");
  }

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Donation Center Onboarding</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">Finish your sign-up</Card.Subtitle>
              <Form>
                <Row>
                  <Form.Group as={Col} controlId="formCenterName">
                    <Form.Label>Donation Center Name</Form.Label>
                    <Form.Control required type="text" placeholder="DonyMcDon Place" />
                  </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control required type="Address" placeholder="123 Main St" />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} controlId="formCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control required type="city" placeholder="Boston" />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formState">
                    <Form.Label>State</Form.Label>
                    <Form.Select required defaultValue="Choose...">
                      <option>Choose...</option>
                      <option>...</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formZipCode">
                    <Form.Label>Zipcode</Form.Label>
                    <Form.Control required type="text" placeholder="12345-1234" />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} controlId="formLongitude">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control required type="text" placeholder="12.345" />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formLatitude">
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control required type="text" placeholder="67.890" />
                  </Form.Group>
                </Row>
                <Button type="submit">Submit form</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
