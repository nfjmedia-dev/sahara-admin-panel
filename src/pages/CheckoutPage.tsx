import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { apiService } from '../services/api';

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
   // const actionUrl = form.getAttribute('action') || '';

    try {
      console.log(formData)
      const response =  await apiService.create('https://test.borgun.is/SecurePay/default.aspx', formData);
      // const response = await fetch(actionUrl, {
      //   method: 'POST',
      //   mode: 'no-cors', 
      //   body: formData,
      // });

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
      defaultValue="Test Buyer Name"
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="buyerEmail">
    <Form.Label>Buyer Email</Form.Label>
    <Form.Control
      type="email"
      name="buyeremail"
      defaultValue="marcelo.mosquera@saltpay.co"
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="language">
    <Form.Label>Language</Form.Label>
    <Form.Control
      type="text"
      name="language"
      defaultValue="is"
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="pagetype">
    <Form.Label>Page Type</Form.Label>
    <Form.Control
      type="text"
      name="pagetype"
      defaultValue="0"
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="skipReceiptPage">
    <Form.Label>Skip Receipt Page</Form.Label>
    <Form.Control
      type="text"
      name="skipReceiptPage"
      defaultValue="0"
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="serviceMethod">
    <Form.Label>Service Method</Form.Label>
    <Form.Control
      type="text"
      name="serviceMethod"
      defaultValue="0"
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="recurrentToken">
    <Form.Label>Recurrent Token</Form.Label>
    <Form.Control
      type="text"
      name="recurrentToken"
      defaultValue="0"
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="customField">
    <Form.Label>Custom Field</Form.Label>
    <Form.Control
      type="text"
      name="customField"
      defaultValue="This is a custom field"
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="itemdescription_0">
    <Form.Label>Item Description 0</Form.Label>
    <Form.Control
      type="text"
      name="itemdescription_0"
      defaultValue="Pen"
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="itemcount_0">
    <Form.Label>Item Count 0</Form.Label>
    <Form.Control
      type="text"
      name="itemcount_0"
      defaultValue="1"
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="itemamount_0">
    <Form.Label>Item Amount 0</Form.Label>
    <Form.Control
      type="text"
      name="itemamount_0"
      defaultValue="100"
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="itemdescription_1">
    <Form.Label>Item Description 1</Form.Label>
    <Form.Control
      type="text"
      name="itemdescription_1"
      defaultValue="Pen"
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="itemcount_1">
    <Form.Label>Item Count 1</Form.Label>
    <Form.Control
      type="text"
      name="itemcount_1"
      defaultValue="1"
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="itemamount_1">
    <Form.Label>Item Amount 1</Form.Label>
    <Form.Control
      type="text"
      name="itemamount_1"
      defaultValue="100"
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="amount">
    <Form.Label>Total Amount</Form.Label>
    <Form.Control
      type="text"
      name="amount"
      defaultValue="200"
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
