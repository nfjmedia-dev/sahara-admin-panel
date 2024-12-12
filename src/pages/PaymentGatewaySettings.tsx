/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { apiService } from '../services/api';
import './PaymentSettings.css';
import { toast, ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';
interface ApiSettingsData {
    site_name: string;
    merchant_Id: string;
    payment_Id: string;
    sectret_Key: string;
}

const PaymentSettings: React.FC = () => {
    const location = useLocation();
    // State for API settings
    const [apiSettings, setApiSettings] = useState<ApiSettingsData>({
        site_name: '',
        merchant_Id: '',
        payment_Id: '',
        sectret_Key: ''
    });

 

    const [activeTab, setActiveTab] = useState<'paymentGatewaySetting' >('paymentGatewaySetting'); // Tab state
    const [siteName, setSiteName] = useState<string>('');
 // Parse query parameters and set to state and localStorage
 useEffect(() => {
    const params = new URLSearchParams(location.search);
    const site_name = params.get('site_name') || '';
    const timestamp = params.get('timestamp');
    const lang = params.get('lang');
    const is_white_label = params.get('is_white_label');
    const iframeSDKSrc = params.get('iframeSDKSrc');
    const current_user_uuid = params.get('current_user_uuid');
    const secure_sig = params.get('secure_sig');
    console.log('query param from duda site ****************',params )
    console.log('query param from duda site_name ****************',site_name )
    // Set site_name in state
    setSiteName(site_name);

    // Store parameters in localStorage
    if (site_name) localStorage.setItem('site_name', site_name);
    if (timestamp) localStorage.setItem('timestamp', timestamp);
    if (lang) localStorage.setItem('lang', lang);
    if (is_white_label) localStorage.setItem('is_white_label', is_white_label);
    if (iframeSDKSrc) localStorage.setItem('iframeSDKSrc', iframeSDKSrc);
    if (current_user_uuid) localStorage.setItem('current_user_uuid', current_user_uuid);
    if (secure_sig) localStorage.setItem('secure_sig', secure_sig);
}, [location.search]);

    // Fetch existing settings on component mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                if(siteName) {
                    console.log('If condtion true for site id *** ',siteName)
                const apiData: ApiSettingsData = await apiService.get(`paymentGatewaySettings/${siteName}`);
                console.log('Api data from backend paymentGatewaySettings ******************',apiData)
                setApiSettings(apiData);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
                toast.error('Failed to fetch settings.');
            }
        };

        fetchSettings();
    }, [siteName]);

    // Handle input changes for API settings form
    const handleApiSettingsChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setApiSettings((prevState) => ({ ...prevState, [id]: value }));
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


    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Payment Gateway Settings</h2>
            <ul className="nav nav-tabs" id="paymentSettingsTabs">
                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === 'paymentGatewaySetting' ? 'active' : ''}`}
                        href="#"
                        onClick={() => setActiveTab('paymentGatewaySetting')}
                    >
                        Payment Gateway Settings
                    </a>
                </li>
              
            </ul>

            <div className="tab-content mt-4">
                {/* API Settings Tab */}
                {activeTab === 'paymentGatewaySetting' && (
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
                                <label htmlFor="merchant_Id">Merchant ID</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="merchant_Id"
                                    value={apiSettings.merchant_Id}
                                    onChange={handleApiSettingsChange}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="payment_Id">Payment ID</label>
                                <input
                                    type="payment_Id"
                                    className="form-control"
                                    id="payment_Id"
                                    value={apiSettings.payment_Id}
                                    onChange={handleApiSettingsChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="sectret_Key">Sectret Key</label>
                                <input
                                    type="sectret_Key"
                                    className="form-control"
                                    id="sectret_Key"
                                    value={apiSettings.sectret_Key}
                                    onChange={handleApiSettingsChange}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-100">Save API Settings</button>
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
