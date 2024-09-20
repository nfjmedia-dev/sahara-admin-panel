// src/components/MainContent.tsx
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface MainContentProps {
    children?: ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
    return (
        <div className="container" style={{ marginTop: '60px', marginLeft: '250px' }}>
            {children || <Outlet />}
        </div>
    );
};

export default MainContent;
