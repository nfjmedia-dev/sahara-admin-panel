import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HamburgerMenu from './HamburgerMenu';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
    const location = useLocation();

    // Retrieve login status (Replace with actual authentication logic)
    const isLoggedIn = Boolean(localStorage.getItem('token')); // Example: checking token presence

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Hide sidebar if the user is NOT logged in OR the route is '/login' or '/payment-settings'
    const showSidebar: boolean = isLoggedIn && !(location.pathname === '/login' || location.pathname === '/payment-settings');

    return (
        <div className="layout-container">
            {/* Top fixed header */}
            <Header username="Admin" onLogout={() => console.log('Logout clicked')} />

            <div className="main-content">
                {/* Show sidebar only if user is logged in and not on public routes */}
                {showSidebar && (!isMobile ? <Sidebar /> : <HamburgerMenu />)}

                {/* Main content area */}
                <div className="content-area">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
