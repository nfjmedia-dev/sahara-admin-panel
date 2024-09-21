// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import PaymentSettings from './pages/PaymentSettings';

const App: React.FC = () => {
    // Show sidebar on all pages except login

    return (
        <Layout >
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
                <Route path="/users" element={<PrivateRoute element={<UserManagement />} />} />
                <Route path="/payment-settings" element={<PaymentSettings /> } />
                {/* Redirect to login if path doesn't match */}
                <Route path="/" element={<Login />} />
            </Routes>
        </Layout>
    );
};

// Wrap App in Router
const WrappedApp: React.FC = () => (
    <Router>
        <App />
    </Router>
);

export default WrappedApp;
