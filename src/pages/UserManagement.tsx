// src/pages/UserManagement.tsx
import React from 'react';
import UserTable from './UserTable';


const UserManagement: React.FC = () => {
    return (
        <div className="container mt-4">
            <h1>User Management</h1>
            <UserTable />
        </div>
    );
};

export default UserManagement;
