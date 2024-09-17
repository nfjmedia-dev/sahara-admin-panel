import React from 'react';
//import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SettingsPage from './components/SettingsPage/SettingsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckoutForm from './components/CheckOutPage/CheckoutPage';


function App() {
  return (
    <Router>
    <div>
      <h1>My Application</h1>
      <Routes>
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/checkout" element={<CheckoutForm />} />
        {/* Add other routes here */}
      </Routes>
    </div>
  </Router>
  );
}

export default App;
