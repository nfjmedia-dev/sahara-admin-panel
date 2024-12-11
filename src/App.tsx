import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CheckoutPage from './components/CheckOutPage/CheckoutPage';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentCancel from './components/PaymentCancel';
import PaymentError from './components/PaymentError';

const App: React.FC = () => {
  const product = {}; // Define your product object here

  return (
    <Router>
      <Routes>
        <Route path="/checkout" element={<CheckoutPage product={product} />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
        <Route path="/payment/error" element={<PaymentError />} />
      </Routes>
    </Router>
  );
};

export default App;
