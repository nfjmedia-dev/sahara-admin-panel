import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const CheckoutPage: React.FC = () => {
  const [checkhash, setCheckhash] = useState<string>('');

  // Example product details
  const product = {
    name: 'Product Name',
    description: 'This is a product description.',
    imageUrl: 'https://via.placeholder.com/300',
    quantity: 1,
  };

  // Secret key (do not expose it directly in your code; ideally, use environment variables or secure storage)
  const secretKey = 'cdedfbb6ecab4a4994ac880144dd92dc';

  // Function to generate the checkhash
  const generateCheckhash = () => {
    const merchantId = '9256684';
    const returnUrlSuccess = 'http://borgun.is/ReturnPageSuccess';
    const returnUrlSuccessServer = 'http://borgun.is/ReturnPageSuccessServer';
    const orderId = 'ORDER1230001';
    const amount = '800.00';
    const currency = 'ISK';

    const data = `${merchantId}|${returnUrlSuccess}|${returnUrlSuccessServer}|${orderId}|${amount}|${currency}`;

    // Create HMAC SHA256 hash
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const keyBuffer = encoder.encode(secretKey);

    return crypto.subtle.importKey(
      'raw', keyBuffer, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    ).then(key => {
      return crypto.subtle.sign('HMAC', key, dataBuffer);
    }).then(signature => {
      const hashArray = Array.from(new Uint8Array(signature));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }).then(hash => {
      setCheckhash(hash);
      console.log(hash);
    }).catch(error => {
      console.error('Error generating checkhash:', error);
    });
  };

  // Call the generateCheckhash function when the component mounts
  React.useEffect(() => {
    generateCheckhash();
  }, []);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const actionUrl = form.getAttribute('action') || '';

    try {
      const response = await fetch(actionUrl, {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      console.log('Response:', responseText);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
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
            onSubmit={handleSubmit} // Handle form submission
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
                defaultValue="http://borgun.is/ReturnPageSuccess"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="returnUrlSuccessServer">
              <Form.Label>Return URL (Success Server)</Form.Label>
              <Form.Control
                type="url"
                name="returnurlsuccessserver"
                defaultValue="http://borgun.is/ReturnPageSuccessServer"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="returnUrlCancel">
              <Form.Label>Return URL (Cancel)</Form.Label>
              <Form.Control
                type="url"
                name="returnurlcancel"
                defaultValue="http://borgun.is/ReturnPageCancel.aspx"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="returnUrlError">
              <Form.Label>Return URL (Error)</Form.Label>
              <Form.Control
                type="url"
                name="returnurlerror"
                defaultValue="http://borgun.is/ReturnUrlError.aspx"
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
