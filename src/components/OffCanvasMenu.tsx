// src/components/OffCanvasMenu.tsx
import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService'; // Import the logout function
import 'bootstrap-icons/font/bootstrap-icons.css'; // Ensure you import icons

const OffCanvasMenu: React.FC<{ show: boolean; handleClose: () => void }> = ({ show, handleClose }) => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        handleClose(); // Close the off-canvas menu
        navigate(path); // Navigate to the specified path
    };

    const handleLogout = () => {
        logout(); // Call the logout function
        handleClose(); // Close the off-canvas menu
        navigate('/login'); // Redirect to login page
    };

    return (
        <Offcanvas show={show} onHide={handleClose} placement="start" className="bg-light">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Admin Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <ul className="list-unstyled">
                    <li className="mb-2">
                        <button onClick={() => handleNavigation('/dashboard')} className="btn btn-link d-flex align-items-center">
                            <i className="bi bi-house me-2"></i>
                            Dashboard
                        </button>
                    </li>
                    <li className="mb-2">
                        <button onClick={() => handleNavigation('/users')} className="btn btn-link d-flex align-items-center">
                            <i className="bi bi-person-lines-fill me-2"></i>
                            User Management
                        </button>
                    </li>
                    {/* Add more items as needed */}
                    <li className="mb-2">
                        <button onClick={handleLogout} className="btn btn-link d-flex align-items-center text-danger">
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Logout
                        </button>
                    </li>
                </ul>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default OffCanvasMenu;
