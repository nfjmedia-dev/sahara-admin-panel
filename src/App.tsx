import React from 'react';
//import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SettingsPage from './components/SettingsPage/SettingsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckoutForm from './components/CheckOutPage/CheckoutPage';

// Define the Product type
interface Product {
  name: string;
  description: string;
  imageUrl: string;
  quantity: number;
}

function App() {
  // Create a sample product object
  const sampleProduct: Product = {
    name: "Sample Product",
    description: "This is a sample product description",
    imageUrl: "https://example.com/sample-image.jpg",
    quantity: 1
  };

  return (
    <Router>
    <div>
      <h1>My Application</h1>
      <Routes>
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/checkout" element={<CheckoutForm product={sampleProduct} />} />
        {/* Add other routes here */}
      </Routes>
    </div>
  </Router>
  );
}

export default App;
