import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleLogout = () => {
        // Implement your logout logic here
        logout();
        console.log('Logout clicked');
        // Redirect to login or home after logout
        navigate('/login');
    };

    return (
        <div className="sidebar bg-light p-3">
            <ul className="list-unstyled">
                <li className="mb-2">
                    <button
                        onClick={() => handleNavigation('/dashboard')}
                        className="btn btn-link d-flex align-items-center"
                    >
                        <i className="bi bi-house me-2"></i>
                        Dashboard
                    </button>
                </li>
                <li className="mb-2">
                    <button
                        onClick={() => handleNavigation('/app-management')}
                        className="btn btn-link d-flex align-items-center"
                    >
                        <i className="bi bi-grid me-2"></i>
                        App Management
                    </button>
                </li>
                {/* <li className="mb-2">
                    <button
                        onClick={() => handleNavigation('/payment-settings')}
                        className="btn btn-link d-flex align-items-center"
                    >
                        <i className="bi bi-credit-card me-2"></i>
                        Payment Management
                    </button>
                </li>
                <li className="mb-2">
                    <button
                        onClick={() => handleNavigation('/checkout')}
                        className="btn btn-link d-flex align-items-center"
                    >
                        <i className="bi bi-cart-check me-2"></i>
                        Checkout Page
                    </button>
                </li> */}
                <li className="mb-2">
                    <button
                        onClick={() => handleNavigation('/transactions')}
                        className="btn btn-link d-flex align-items-center"
                    >
                        <i className="bi bi-receipt me-2"></i>
                        Transactions
                    </button>
                </li>
                {/* Add more sidebar items as needed */}
                <li className="mb-2">
                    <button
                        onClick={handleLogout}
                        className="btn btn-link d-flex align-items-center text-danger"
                    >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
