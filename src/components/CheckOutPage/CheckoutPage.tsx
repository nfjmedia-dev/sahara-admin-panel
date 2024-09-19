import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const CheckoutPage: React.FC = () => {
  const [checkhash, setCheckhash] = useState('');

  const generateCheckhash = async () => {
    const merchantId = '9256684'; // Replace with your actual merchant ID
    const returnUrlSuccess = 'https://lobster-app-9rq3t.ondigitalocean.app/payment/success';
    const returnUrlSuccessServer = 'https://lobster-app-9rq3t.ondigitalocean.app/api/payment/success';
    const orderId = 'ORDER1230001'; // This should be dynamically generated
    const amount = '800.00';
    const currency = 'ISK';

    try {
      const response = await fetch('/api/generate-checkhash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantId,
          returnUrlSuccess,
          returnUrlSuccessServer,
          orderId,
          amount,
          currency,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate checkhash');
      }

      const data = await response.json();
      setCheckhash(data.checkhash);
    } catch (error) {
      console.error('Error generating checkhash:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await generateCheckhash();
    // Now you can submit the form
    event.currentTarget.submit();
  };

  return (
    <Container className="mt-5">
      <Row>
        {/* Product Details Section */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Img variant="top" src={product.imageUrl} />
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text>{product.description}</Card.Text>
              <Card.Text>Quantity: {product.quantity}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Checkout Form Section */}
        <Col md={6}>
          <h2 className="text-center mb-4">Checkout Form</h2>
          <Form
            id="form1"
            action="https://test.borgun.is/SecurePay/default.aspx"
            method="post"
            onSubmit={handleSubmit}
          >
            <Form.Group className="mb-3" controlId="merchantId">
              <Form.Label>Merchant ID</Form.Label>
              <Form.Control
                type="text"
                name="merchantid"
                defaultValue="9256684"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="paymentGatewayId">
              <Form.Label>Payment Gateway ID</Form.Label>
              <Form.Control
                type="text"
                name="paymentgatewayid"
                defaultValue="471"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="checkHash">
              <Form.Label>Check Hash</Form.Label>
              <Form.Control
                type="text"
                name="checkhash"
                value={checkhash}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="orderId">
              <Form.Label>Order ID</Form.Label>
              <Form.Control
                type="text"
                name="orderid"
                defaultValue="ORDER1230001"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="currency">
              <Form.Label>Currency</Form.Label>
              <Form.Control type="text" name="currency" defaultValue="ISK" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="buyerName">
              <Form.Label>Buyer Name</Form.Label>
              <Form.Control
                type="text"
                name="buyername"
                defaultValue="Agnar Agnarsson"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="buyerEmail">
              <Form.Label>Buyer Email</Form.Label>
              <Form.Control
                type="email"
                name="buyeremail"
                defaultValue="test@borgun.is"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="returnUrlSuccess">
              <Form.Label>Return URL (Success)</Form.Label>
              <Form.Control
                type="url"
                name="returnurlsuccess"
                defaultValue="https://lobster-app-9rq3t.ondigitalocean.app/payment/success"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="returnUrlSuccessServer">
              <Form.Label>Return URL (Success Server)</Form.Label>
              <Form.Control
                type="url"
                name="returnurlsuccessserver"
                defaultValue="https://lobster-app-9rq3t.ondigitalocean.app/api/payment/success"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="returnUrlCancel">
              <Form.Label>Return URL (Cancel)</Form.Label>
              <Form.Control
                type="url"
                name="returnurlcancel"
                defaultValue="https://lobster-app-9rq3t.ondigitalocean.app/payment/cancel"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="returnUrlError">
              <Form.Label>Return URL (Error)</Form.Label>
              <Form.Control
                type="url"
                name="returnurlerror"
                defaultValue="https://lobster-app-9rq3t.ondigitalocean.app/payment/error"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="amount">
              <Form.Label>Total Amount</Form.Label>
              <Form.Control
                type="text"
                name="amount"
                defaultValue="800.00"
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit Payment
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
