import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { apiService } from '../services/api';
import axios, { AxiosResponse } from 'axios';
import { useLocation } from 'react-router-dom';
interface PaymentSession {
  amount: number;
  currency: string;
  status: string;

}
interface accessToken {
  auth_token:string
}
const CheckoutPage: React.FC = () => {
  const [checkhash, setCheckhash] = useState<string>('');
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null); // Store payment session data
  const [accessToken, setAccessToken] = useState<accessToken | null>(null); // Store payment session data
  console.log("paymentSession^^^^^^^^^^^^^^^^^^^^^^^^^",paymentSession)
  // Example product details
  // Custom hook to get query parameters
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const query = useQuery();
  const sessionId = query.get('session_id'); // Get the session_id parameter
  const siteName = query.get('site_name'); // Get the site_name parameter

  // Function to fetch payment session data from Duda API
  const fetchPaymentSessionFromDuda = async (siteName: string, sessionId: string, accessToken: string): Promise<void> => {
    const dudaUrl = `https://api-sandbox.duda.co/api/integrationhub/application/site/${siteName}/ecommerce/payment-sessions/${sessionId}`;
    try {
      const response: AxiosResponse<PaymentSession> = await axios.get(dudaUrl, {
        headers: {
          'Authorization': `Basic ${secretKey}`, // Assuming this is the correct credentials setup
          'X-DUDA-ACCESS-TOKEN': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });
      console.log('Payment session retrieved from Duda API:', response.data);
      setPaymentSession(response.data); // Save the payment session data in the state
    } catch (error) {
      console.error('Error fetching payment session from Duda API:', error);
    }
  };
  const fetchAccessToken = async (siteName: string): Promise<any> => {
    const accessTokenUrl = `http://localhost:3000/settings/auth_token?site_name=${siteName}`;
    try {
      const response:AxiosResponse<accessToken> = await axios.get(accessTokenUrl, {
      });
      console.log("response authtoken_____________",response.data.auth_token)
      if(response.data &&response.data.auth_token){
        console.log('accessToken retrieved from  API:', response.data.auth_token);
        setAccessToken({ auth_token: response.data.auth_token }); // Save the payment session data in the state
        return response.data.auth_token
      }
      else {
        console.log('accessToken retrieved failed for the site:', siteName);
      }
    } catch (error) {
      console.error(`accessToken retrieved failed for the site:${siteName}`, error);
    }
  };

  

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
  // Call the generateCheckhash function when the component mounts
  React.useEffect(() => {
    const fetchPaymentSession = async () => {
      generateCheckhash(); // Generate the hash
      if (siteName && sessionId) {
        try {
          // Fetch the access token and await its response
          const accessTokenData = await fetchAccessToken(siteName);
          console.log("accessTokenData_____************",accessTokenData)
          if (accessTokenData) {
            // Now fetch the payment session using the token
            await fetchPaymentSessionFromDuda(siteName, sessionId, accessTokenData);
          }
        } catch (error) {
          console.error('Error fetching access token or payment session:', error);
        }
      }
    };

    fetchPaymentSession(); // Call the async function
  }, [siteName, sessionId]); // Dependency array

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
      defaultValue ={checkhash}
      required
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
