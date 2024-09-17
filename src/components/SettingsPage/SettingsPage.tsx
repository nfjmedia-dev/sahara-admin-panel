import React, { useState } from 'react';
import styles from './settingsPage.module.css';


const SettingsPage: React.FC = () => {
  const [merchantId, setMerchantId] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch('http://localhost:3000/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ merchantId, apiKey }),
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
            <label htmlFor="apiKey">API Key:</label>
            <input
              id="apiKey"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
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
