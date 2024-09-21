import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import the useLocation hook
import HamburgerMenu from './HamburgerMenu';
import Header from './Header';
import Sidebar from './Sidebar'; // Assuming a Sidebar component for larger screens
import './Layout.css'; // Add your custom CSS here

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
    const location = useLocation(); // Get the current location

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Conditionally show the sidebar only if the path is NOT '/login'
    //const showSidebar = location.pathname !== '/login';
    const showSidebar: boolean = !(location.pathname === '/login' || location.pathname === '/payment-settings');



    return (
        <div className="layout-container">
            {/* Top fixed header */}
            <Header username="Admin" onLogout={() => console.log('Logout clicked')} />

            <div className="main-content">
                {/* Show sidebar if not on mobile, otherwise show hamburger menu, and only if not on login path */}
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
