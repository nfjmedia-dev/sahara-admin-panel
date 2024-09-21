import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import BorgunPaymentForm from '../BorgunPaymentForm';

interface Product {
  name: string;
  description: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

interface CheckoutPageProps {
  product: Product;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ product }) => {
  return (
    <Container>
      <Row>
        <Col md={6}>
          <Card>
            <Card.Img variant="top" src={product.imageUrl} />
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text>{product.description}</Card.Text>
              <Card.Text>Quantity: {product.quantity}</Card.Text>
              <Card.Text>Price: {product.price} ISK</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <BorgunPaymentForm
            merchantId="9275444"
            paymentGatewayId="16"
            orderId={`ORDER${Date.now()}`}
            amount={(product.price * product.quantity).toFixed(2)}
            currency="ISK"
            buyerName="John Doe"
            buyerEmail="john@example.com"
            merchantLogo="/path-to-your-logo.png"
            successUrl="/payment/success"
            cancelUrl="/payment/cancel"
            errorUrl="/payment/error"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
