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
                        onClick={() => handleNavigation('/users')}
                        className="btn btn-link d-flex align-items-center"
                    >
                        <i className="bi bi-person-lines-fill me-2"></i>
                        User Management
                    </button>
                </li>
                <li className="mb-2">
                    <button
                        onClick={() => handleNavigation('/payment-settings')}
                        className="btn btn-link d-flex align-items-center"
                    >
                        <i className="bi bi-person-lines-fill me-2"></i>
                        Payment Management
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
