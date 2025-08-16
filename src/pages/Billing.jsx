import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Billing.css';

const Billing = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showBillModal, setShowBillModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    treatmentType: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const isInsuranceStaff = user?.role === 'Insurance Staff';
  const isHospitalStaff = user?.role === 'Hospital Staff';
  const isViewOnly = isInsuranceStaff || isHospitalStaff;

  useEffect(() => {
    // Simulate loading patients and bills data
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Load sample patients
        const samplePatients = [
          {
            patientId: 'P001',
            name: 'John Doe',
            age: 35,
            gender: 'Male',
            contact: '1234567890'
          },
          {
            patientId: 'P002',
            name: 'Jane Smith',
            age: 28,
            gender: 'Female',
            contact: '9876543210'
          }
        ];
        setPatients(samplePatients);

        // Load sample bills
        setBills([
          {
            billId: 'B001',
            patientId: 'P001',
            patientName: 'John Doe',
            treatmentType: 'Consultation',
            amount: 150,
            date: '2024-03-15',
            status: 'Pending',
            description: 'Initial consultation with Dr. Smith'
          },
          {
            billId: 'B002',
            patientId: 'P002',
            patientName: 'Jane Smith',
            treatmentType: 'Lab Test',
            amount: 250,
            date: '2024-03-16',
            status: 'Paid',
            description: 'Blood test and analysis'
          }
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'patientId') {
      const selectedPatient = patients.find(p => p.patientId === value);
      setFormData(prev => ({
        ...prev,
        patientId: value,
        patientName: selectedPatient ? selectedPatient.name : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.patientId) newErrors.patientId = 'Patient ID is required';
    if (!formData.treatmentType) newErrors.treatmentType = 'Treatment type is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (!formData.date) newErrors.date = 'Date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditBill = (bill) => {
    setFormData({
      patientId: bill.patientId,
      patientName: bill.patientName,
      treatmentType: bill.treatmentType,
      amount: bill.amount.toString(),
      date: bill.date,
      description: bill.description || ''
    });
    setSelectedBill(bill);
    setIsEditing(true);
    setShowBillModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isEditing && selectedBill) {
      // Update existing bill
      setBills(prev => prev.map(bill => 
        bill.billId === selectedBill.billId 
          ? {
              ...bill,
              patientId: formData.patientId,
              patientName: formData.patientName,
              treatmentType: formData.treatmentType,
              amount: parseFloat(formData.amount),
              date: formData.date,
              description: formData.description
            }
          : bill
      ));
    } else {
      // Create new bill
      const newBillId = `B${String(bills.length + 1).padStart(3, '0')}`;
      const newBill = {
        ...formData,
        billId: newBillId,
        status: 'Pending',
        amount: parseFloat(formData.amount)
      };
      setBills(prev => [...prev, newBill]);
    }

    setShowBillModal(false);
    setIsEditing(false);
    setSelectedBill(null);
    setFormData({
      patientId: '',
      patientName: '',
      treatmentType: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setShowViewModal(true);
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = 
      bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.billId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || bill.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredBills.reduce((sum, bill) => sum + bill.amount, 0);
  const pendingBills = filteredBills.filter(bill => bill.status === 'Pending');
  const overdueBills = filteredBills.filter(bill => bill.status === 'Overdue');

  return (
    <div className="billing-container">
      <div className="billing-header">
        <h2>Billing Management {isViewOnly }</h2>
        <div className="header-actions">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by patient name or bill ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          {!isViewOnly && (
            <button onClick={() => setShowBillModal(true)} className="add-bill-btn">
              Generate New Bill
            </button>
          )}
        </div>
      </div>

      <div className="billing-summary">
        <div className="summary-card">
          <h3>Total Bills</h3>
          <p className="stat-number">{filteredBills.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total Amount</h3>
          <p className="stat-number">${totalAmount.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Pending Bills</h3>
          <p className="stat-number">{pendingBills.length}</p>
        </div>
        <div className="summary-card">
          <h3>Overdue Bills</h3>
          <p className="stat-number">{overdueBills.length}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Loading bills...</div>
      ) : (
        <div className="bills-table-container">
          <table className="bills-table">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Patient Name</th>
                <th>Treatment Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map(bill => (
                <tr key={bill.billId}>
                  <td>{bill.billId}</td>
                  <td>{bill.patientName}</td>
                  <td>{bill.treatmentType}</td>
                  <td>${bill.amount.toFixed(2)}</td>
                  <td>{bill.date}</td>
                  <td>
                    <span className={`status-badge ${bill.status.toLowerCase()}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="view-btn"
                      onClick={() => handleViewBill(bill)}
                    >
                      View
                    </button>
                    {!isViewOnly && (
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditBill(bill)}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showBillModal && !isViewOnly && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{isEditing ? 'Edit Bill' : 'Generate New Bill'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Patient:</label>
                  <select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    className={errors.patientId ? 'error' : ''}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.patientId} value={patient.patientId}>
                        {patient.patientId} - {patient.name}
                      </option>
                    ))}
                  </select>
                  {errors.patientId && <span className="error-message">{errors.patientId}</span>}
                </div>

                <div className="form-group">
                  <label>Patient Name:</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    readOnly
                    className="readonly-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Treatment Type:</label>
                  <select
                    name="treatmentType"
                    value={formData.treatmentType}
                    onChange={handleInputChange}
                    className={errors.treatmentType ? 'error' : ''}
                    required
                  >
                    <option value="">Select Treatment Type</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Lab Test">Lab Test</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Medication">Medication</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.treatmentType && <span className="error-message">{errors.treatmentType}</span>}
                </div>

                <div className="form-group">
                  <label>Amount:</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className={errors.amount ? 'error' : ''}
                    required
                    min="0"
                    step="0.01"
                  />
                  {errors.amount && <span className="error-message">{errors.amount}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={errors.date ? 'error' : ''}
                  required
                />
                {errors.date && <span className="error-message">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="modal-buttons">
                <button 
                  type="button" 
                  className="cancel" 
                  onClick={() => {
                    setShowBillModal(false);
                    setIsEditing(false);
                    setSelectedBill(null);
                    setFormData({
                      patientId: '',
                      patientName: '',
                      treatmentType: '',
                      amount: '',
                      date: new Date().toISOString().split('T')[0],
                      description: ''
                    });
                  }}
                >
                  Cancel
                </button>
                <button type="submit">
                  {isEditing ? 'Update Bill' : 'Generate Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedBill && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Bill Details</h2>
            <div className="bill-details">
              <div className="detail-row">
                <span className="detail-label">Bill ID:</span>
                <span className="detail-value">{selectedBill.billId}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Patient Name:</span>
                <span className="detail-value">{selectedBill.patientName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Treatment Type:</span>
                <span className="detail-value">{selectedBill.treatmentType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Amount:</span>
                <span className="detail-value">${selectedBill.amount.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{selectedBill.date}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge ${selectedBill.status.toLowerCase()}`}>
                  {selectedBill.status}
                </span>
              </div>
              {selectedBill.description && (
                <div className="detail-row">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{selectedBill.description}</span>
                </div>
              )}
            </div>
            <div className="modal-buttons">
              <button 
                type="button" 
                className="cancel" 
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedBill(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing; 