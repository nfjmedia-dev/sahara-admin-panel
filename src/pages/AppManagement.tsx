// src/pages/UserManagement.tsx
import React from 'react';
import AppManagementTable from './AppManagementTable';


const AppManagement: React.FC = () => {
    return (
        <div className="container mt-4">
            <h1>App Management</h1>
            <AppManagementTable />
        </div>
    );
};

export default AppManagement;
