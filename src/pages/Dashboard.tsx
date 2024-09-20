// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';

const Dashboard: React.FC = () => {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await apiService.get('dashboard');
            setData(result);
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <div className="card">
                <div className="card-body">
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
