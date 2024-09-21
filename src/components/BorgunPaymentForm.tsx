import React, { useState, useEffect } from 'react';

interface BorgunPaymentFormProps {
  merchantId: string;
  paymentGatewayId: string;
  orderId: string;
  amount: string;
  currency: string;
  buyerName: string;
  buyerEmail: string;
  merchantLogo?: string;
  successUrl: string;
  cancelUrl: string;
  errorUrl: string;
}

const BorgunPaymentForm: React.FC<BorgunPaymentFormProps> = ({
  merchantId,
  paymentGatewayId,
  orderId,
  amount,
  currency,
  buyerName,
  buyerEmail,
  merchantLogo,
  successUrl,
  cancelUrl,
  errorUrl
}) => {
  const [checkhash, setCheckhash] = useState('');

  useEffect(() => {
    generateCheckhash();
  }, [merchantId, orderId, amount, currency, successUrl]);

  const generateCheckhash = async () => {
    const response = await fetch('/api/generate-checkhash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ merchantId, orderId, amount, currency, successUrl }),
    });
    const data = await response.json();
    setCheckhash(data.checkhash);
  };

  return (
    <form id="form1" action="https://test.borgun.is/SecurePay/default.aspx" method="post">
      <input type="hidden" name="merchantid" value={merchantId} />
      <input type="hidden" name="paymentgatewayid" value={paymentGatewayId} />
      <input type="hidden" name="checkhash" value={checkhash} />
      <input type="hidden" name="orderid" value={orderId} />
      <input type="hidden" name="currency" value={currency} />
      <input type="hidden" name="language" value="IS" />
      <input type="hidden" name="buyername" value={buyerName} />
      <input type="hidden" name="buyeremail" value={buyerEmail} />
      <input type="hidden" name="returnurlsuccess" value={successUrl} />
      <input type="hidden" name="returnurlcancel" value={cancelUrl} />
      <input type="hidden" name="returnurlerror" value={errorUrl} />
      <input type="hidden" name="amount" value={amount} />
      {merchantLogo && <input type="hidden" name="merchantlogo" value={merchantLogo} />}
      <input type="submit" value="Proceed to Payment" />
    </form>
  );
};

export default BorgunPaymentForm;
