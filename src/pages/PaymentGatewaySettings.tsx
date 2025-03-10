import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from 'react';
import { apiService } from '../services/api';
import './PaymentSettings.css';
import { toast, ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';

interface ApiSettingsData {
    site_name: string;
    merchant_id: string;
    payment_gateway_id: string;
    secret_key: string;
    gateway_mode: 'test' | 'live';
}

const PaymentSettings: React.FC = () => {
    const location = useLocation();

    const [apiSettings, setApiSettings] = useState<ApiSettingsData>({
        site_name: '',
        merchant_id: '',
        payment_gateway_id: '',
        secret_key: '',
        gateway_mode: 'live'
    });

    const [loading, setLoading] = useState<boolean>(false);

    const fetchSettings = useCallback(async (siteName: string) => {
        setLoading(true);
        try {
            const apiData: ApiSettingsData = await apiService.get(`paymentGatewaySettings/${siteName}`);
            setApiSettings(apiData || {
                site_name: siteName,
                merchant_id: '',
                payment_gateway_id: '',
                secret_key: '',
                gateway_mode: 'live'
            });
        } catch (error) {
            console.error('Error fetching settings:', error);
            setApiSettings({
                site_name: siteName,
                merchant_id: '',
                payment_gateway_id: '',
                secret_key: '',
                gateway_mode: 'live'
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const site_name = params.get('site_name') || '';

        if (site_name) {
            setApiSettings((prevState) => ({ ...prevState, site_name }));
            fetchSettings(site_name);
        } else {
            toast.error('Site name is mandatory in the URL!');
            // No redirect, just leave the form with empty fields
            setApiSettings({
                site_name: '',
                merchant_id: '',
                payment_gateway_id: '',
                secret_key: '',
                gateway_mode: 'live'
            });
        }
    }, [location.search, fetchSettings]);

    const handleApiSettingsChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setApiSettings((prevState) => ({ ...prevState, [id]: value }));
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setApiSettings((prevState) => ({
            ...prevState,
            gateway_mode: isChecked ? 'test' : 'live'
        }));
    };

    const handleApiSettingsSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!apiSettings.site_name) {
            toast.error('Site name is required from URL!');
            return;
        }

        if (!apiSettings.merchant_id || !apiSettings.payment_gateway_id || !apiSettings.secret_key) {
            toast.error('Please fill all fields except Site Name.');
            return;
        }

        try {
            await apiService.create('paymentGatewaySettings', apiSettings);
            toast.success('API Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save API Settings.');
        }
    };

    return (
        <div className="container mt-4">
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading settings...</p>
                </div>
            ) : (
                <div className="card p-4 shadow-sm">
                    <div
                        className="mb-3 pb-2"
                        style={{
                            borderBottom: "2px solid #007bff",
                            marginBottom: "1rem"
                        }}
                    >
                        <h3 className="mb-0">API Settings</h3>
                    </div>

                    <form onSubmit={handleApiSettingsSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="site_name">Site Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="site_name"
                                value={apiSettings.site_name}
                                readOnly
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="merchant_id">Merchant ID</label>
                            <input
                                type="text"
                                className="form-control"
                                id="merchant_id"
                                value={apiSettings.merchant_id}
                                onChange={handleApiSettingsChange}
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="payment_gateway_id">Payment Gateway ID</label>
                            <input
                                type="text"
                                className="form-control"
                                id="payment_gateway_id"
                                value={apiSettings.payment_gateway_id}
                                onChange={handleApiSettingsChange}
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="secret_key">Secret Key</label>
                            <input
                                type="password"
                                className="form-control"
                                id="secret_key"
                                value={apiSettings.secret_key}
                                onChange={handleApiSettingsChange}
                                required
                            />
                        </div>

                        <div className="form-check form-switch mb-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="gateway_mode"
                                checked={apiSettings.gateway_mode === 'test'}
                                onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label ms-2" htmlFor="gateway_mode">
                                Test Gateway Credentials
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Save API Settings</button>
                    </form>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default PaymentSettings;