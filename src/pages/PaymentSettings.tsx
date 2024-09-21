import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { apiService } from '../services/api';
import './PaymentSettings.css';
import { toast, ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ApiSettingsData {
    site_name: string;
    username: string;
    password: string;
    country: string;
}

interface CheckoutSettingsData {
    title: string;
    logo: File | null;
    min_order_amount: number;
    country: string;
}

interface CheckoutData {
    title: string;
    min_order_amount: number;
    country: string;
}

const PaymentSettings: React.FC = () => {
    // State for API settings
    const [apiSettings, setApiSettings] = useState<ApiSettingsData>({
        site_name: '',
        username: '',
        password: '',
        country: ''
    });

    // State for Checkout Page settings
    const [checkoutSettings, setCheckoutSettings] = useState<CheckoutSettingsData>({
        title: '',
        logo: null,
        min_order_amount: 0,
        country: ''
    });

    const [activeTab, setActiveTab] = useState<'api' | 'checkout'>('api'); // Tab state

    // Fetch existing settings on component mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const apiData: ApiSettingsData = await apiService.get(`paymentGatewaySettings/23b668d0b95647c08ab4a2433cfa9158`);
                const checkoutData: CheckoutData = await apiService.get(`checkoutPageSetting/23b668d0b95647c08ab4a2433cfa9158`);

                setApiSettings(apiData);
                setCheckoutSettings({
                    ...checkoutData,
                    logo: null // Ensure logo is null for file uploads
                });
            } catch (error) {
                console.error("Error fetching settings:", error);
                toast.error('Failed to fetch settings.');
            }
        };

        fetchSettings();
    }, []);

    // Handle input changes for API settings form
    const handleApiSettingsChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setApiSettings((prevState) => ({ ...prevState, [id]: value }));
    };

    // Handle input changes for Checkout settings form
    const handleCheckoutSettingsChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setCheckoutSettings((prevState) => ({
            ...prevState,
            [id]: id === 'min_order_amount' ? parseFloat(value) : value
        }));
    };

    // Handle file input change for logo
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setCheckoutSettings((prevState) => ({
                ...prevState,
                logo: files[0],
            }));
        }
    };

    // Handle API settings form submission
    const handleApiSettingsSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await apiService.create('paymentGatewaySettings', apiSettings);
            toast.success('API Settings saved successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save API Settings.');
        }
    };

    // Handle Checkout Page settings form submission
    const handleCheckoutSettingsSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', checkoutSettings.title);
            formData.append('min_order_amount', checkoutSettings.min_order_amount.toString());
            formData.append('country', checkoutSettings.country);
            formData.append('site_name', apiSettings.site_name);
            if (checkoutSettings.logo) {
                formData.append('logo', checkoutSettings.logo);
            }
            await apiService.create('checkoutPageSetting', formData);
            toast.success('Checkout Page Settings saved successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save Checkout Page Settings.' + error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Payment Settings</h2>
            <ul className="nav nav-tabs" id="paymentSettingsTabs">
                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === 'api' ? 'active' : ''}`}
                        href="#"
                        onClick={() => setActiveTab('api')}
                    >
                        API Settings
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === 'checkout' ? 'active' : ''}`}
                        href="#"
                        onClick={() => setActiveTab('checkout')}
                    >
                        Checkout Settings
                    </a>
                </li>
            </ul>

            <div className="tab-content mt-4">
                {/* API Settings Tab */}
                {activeTab === 'api' && (
                    <div className="card p-4 shadow-sm">
                        <h3 className="mb-3">API Settings</h3>
                        <form onSubmit={handleApiSettingsSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="site_name">Site Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="site_name"
                                    value={apiSettings.site_name}
                                    onChange={handleApiSettingsChange}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    value={apiSettings.username}
                                    onChange={handleApiSettingsChange}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={apiSettings.password}
                                    onChange={handleApiSettingsChange}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="country">Select Country</label>
                                <select
                                    id="country"
                                    className="form-control"
                                    value={apiSettings.country}
                                    onChange={handleApiSettingsChange}
                                    required
                                >
                                    <option value="" disabled>Select a country</option>
                                    <option value="usa">USA</option>
                                    <option value="uk">UK</option>
                                    <option value="germany">Germany</option>
                                    <option value="france">France</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary w-100">Save API Settings</button>
                        </form>
                    </div>
                )}

                {/* Checkout Settings Tab */}
                {activeTab === 'checkout' && (
                    <div className="card p-4 shadow-sm">
                        <h3 className="mb-3">Checkout Page Settings</h3>
                        <form onSubmit={handleCheckoutSettingsSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="title">Checkout Page Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    value={checkoutSettings.title}
                                    onChange={handleCheckoutSettingsChange}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="logo">Checkout Page Logo</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="logo"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="min_order_amount">Minimum Order Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="min_order_amount"
                                    value={checkoutSettings.min_order_amount}
                                    onChange={handleCheckoutSettingsChange}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="country">Select Country</label>
                                <select
                                    id="country"
                                    className="form-control"
                                    value={checkoutSettings.country}
                                    onChange={handleCheckoutSettingsChange}
                                    required
                                >
                                    <option value="" disabled>Select a country</option>
                                    <option value="usa">USA</option>
                                    <option value="uk">UK</option>
                                    <option value="germany">Germany</option>
                                    <option value="france">France</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary w-100">Save Checkout Settings</button>
                        </form>
                    </div>
                )}
            </div>
                       {/* Toast Container for Notifications */}
                       <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default PaymentSettings;
