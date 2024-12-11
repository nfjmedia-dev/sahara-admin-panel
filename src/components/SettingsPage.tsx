import React, { useState } from 'react';
import styles from './SettingsPage/settingsPage.module.css';


const SettingsPage: React.FC = () => {
  const [merchantId, setMerchantId] = useState('');
  const [gatewayId, setGatewayId] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch('http://localhost:3000/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ merchantId, gatewayId, secretKey }),
    });

    if (response.ok) {
      alert('Settings saved successfully');
    } else {
      alert('Failed to save settings');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h3>Session Scope Payment Gateway Settings</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="merchantId">Merchant ID:</label>
            <input
              id="merchantId"
              type="text"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="gatewayId">Gateway ID:</label>
            <input
              id="gatewayId"
              type="text"
              value={gatewayId}
              onChange={(e) => setGatewayId(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="secretKey">Secret Key:</label>
            <input
              id="secretKey"
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
            />
          </div>
          <button type="submit">Save Settings</button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
