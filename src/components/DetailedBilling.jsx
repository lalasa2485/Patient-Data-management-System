import React, { useState, useEffect } from 'react';
import '../styles/DetailedBilling.css';

const DetailedBilling = ({ patientId }) => {
  const [bill, setBill] = useState({
    items: [],
    totalAmount: 0,
    status: 'Pending',
    paymentHistory: []
  });
  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    unitPrice: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBillDetails();
  }, [patientId]);

  const fetchBillDetails = async () => {
    try {
      const response = await fetch(`/api/bills/${patientId}`);
      if (!response.ok) throw new Error('Failed to fetch bill details');
      const data = await response.json();
      setBill(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice' ? Number(value) : value
    }));
  };

  const addItem = () => {
    const total = newItem.quantity * newItem.unitPrice;
    setBill(prev => ({
      ...prev,
      items: [...prev.items, { ...newItem, total }],
      totalAmount: prev.totalAmount + total
    }));
    setNewItem({
      description: '',
      quantity: 1,
      unitPrice: 0
    });
  };

  const removeItem = (index) => {
    const itemToRemove = bill.items[index];
    setBill(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
      totalAmount: prev.totalAmount - itemToRemove.total
    }));
  };

  const handlePayment = async (amount) => {
    try {
      const response = await fetch(`/api/bills/${patientId}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) throw new Error('Failed to process payment');
      
      const data = await response.json();
      setBill(prev => ({
        ...prev,
        paymentHistory: [...prev.paymentHistory, data],
        status: data.remainingAmount === 0 ? 'Paid' : 'Partial'
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading bill details...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="detailed-billing">
      <h2>Detailed Billing</h2>
      
      {/* Add New Item Form */}
      <div className="add-item-form">
        <h3>Add New Item</h3>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={newItem.description}
            onChange={handleItemChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={newItem.quantity}
            onChange={handleItemChange}
            min="1"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Unit Price</label>
          <input
            type="number"
            name="unitPrice"
            value={newItem.unitPrice}
            onChange={handleItemChange}
            min="0"
            step="0.01"
            required
          />
        </div>
        
        <button onClick={addItem} className="add-button">Add Item</button>
      </div>

      {/* Bill Items Table */}
      <div className="bill-items">
        <h3>Bill Items</h3>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, index) => (
              <tr key={index}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>${item.unitPrice.toFixed(2)}</td>
                <td>${item.total.toFixed(2)}</td>
                <td>
                  <button onClick={() => removeItem(index)} className="remove-button">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3"><strong>Total Amount:</strong></td>
              <td colSpan="2">${bill.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Payment Section */}
      <div className="payment-section">
        <h3>Payment History</h3>
        <div className="payment-form">
          <input
            type="number"
            placeholder="Enter payment amount"
            min="0"
            max={bill.totalAmount}
            step="0.01"
            id="paymentAmount"
          />
          <button onClick={() => handlePayment(document.getElementById('paymentAmount').value)}>
            Process Payment
          </button>
        </div>
        
        <div className="payment-history">
          {bill.paymentHistory.map((payment, index) => (
            <div key={index} className="payment-item">
              <span className="date">{new Date(payment.date).toLocaleDateString()}</span>
              <span className="amount">${payment.amount.toFixed(2)}</span>
              <span className="method">{payment.method}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bill Status */}
      <div className="bill-status">
        <h3>Bill Status: <span className={bill.status.toLowerCase()}>{bill.status}</span></h3>
      </div>
    </div>
  );
};

export default DetailedBilling; 