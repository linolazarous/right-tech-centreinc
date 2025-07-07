import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { processPayment } from '../services/paymentService';
import { FaCreditCard, FaSpinner } from 'react-icons/fa';

const Payment = ({ userId, amount, onPaymentSuccess }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
    saveCard: false
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvv) {
      setError('Please fill all payment details');
      return;
    }

    setIsProcessing(true);
    setError('');
    try {
      const result = await processPayment({
        userId,
        amount,
        paymentMethod,
        ...paymentData
      });
      onPaymentSuccess(result);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-container">
      <h1 className="payment-header">
        <FaCreditCard /> Payment
      </h1>
      <p className="payment-amount">Total: ${amount.toFixed(2)}</p>

      <div className="payment-methods">
        <button
          className={`method-option ${paymentMethod === 'card' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('card')}
        >
          Credit/Debit Card
        </button>
        <button
          className={`method-option ${paymentMethod === 'paypal' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('paypal')}
        >
          PayPal
        </button>
      </div>

      {paymentMethod === 'card' ? (
        <form onSubmit={handleSubmit} className="payment-form">
          {error && <div className="payment-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formatCardNumber(paymentData.cardNumber)}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').substring(0, 16);
                setPaymentData(prev => ({ ...prev, cardNumber: value }));
              }}
              maxLength="19"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiry">Expiry Date</label>
              <input
                type="text"
                id="expiry"
                name="expiry"
                placeholder="MM/YY"
                value={paymentData.expiry}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, '')
                    .replace(/(\d{2})(\d{0,2})/, '$1/$2')
                    .substring(0, 5);
                  setPaymentData(prev => ({ ...prev, expiry: value }));
                }}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                placeholder="123"
                value={paymentData.cvv}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').substring(0, 4);
                  setPaymentData(prev => ({ ...prev, cvv: value }));
                }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Cardholder Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name on card"
              value={paymentData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="saveCard"
              name="saveCard"
              checked={paymentData.saveCard}
              onChange={handleChange}
            />
            <label htmlFor="saveCard">Save card for future payments</label>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="payment-button"
          >
            {isProcessing ? (
              <>
                <FaSpinner className="spinner" /> Processing...
              </>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </button>
        </form>
      ) : (
        <div className="paypal-method">
          <p>You will be redirected to PayPal to complete your payment</p>
          <button className="payment-button" onClick={handleSubmit}>
            Continue to PayPal
          </button>
        </div>
      )}

      <div className="payment-security">
        <p>Your payment is secured with 256-bit SSL encryption</p>
      </div>
    </div>
  );
};

Payment.propTypes = {
  userId: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  onPaymentSuccess: PropTypes.func.isRequired
};

export default Payment;
