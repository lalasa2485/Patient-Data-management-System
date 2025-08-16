import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/InsuranceClaims.css';

const InsuranceClaims = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    insuranceProvider: '',
    policyNumber: '',
    claimType: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [claims, setClaims] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const isInsuranceStaff = user?.role === 'Insurance Staff';
  const isHospitalStaff = user?.role === 'Hospital Staff';
  const isViewOnly = isHospitalStaff;

  useEffect(() => {
    // Simulate loading claims data
    const loadClaims = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setClaims([
          {
            claimId: 'CLM001',
            patientId: 'PAT001',
            patientName: 'John Doe',
            insuranceProvider: 'HealthCare Plus',
            policyNumber: 'HP123456',
            claimType: 'Medical Treatment',
            amount: 5000,
            date: '2024-03-15',
            status: 'Pending',
            description: 'Hospital admission and treatment'
          },
          {
            claimId: 'CLM002',
            patientId: 'PAT002',
            patientName: 'Jane Smith',
            insuranceProvider: 'MediCover',
            policyNumber: 'MC789012',
            claimType: 'Lab Tests',
            amount: 2500,
            date: '2024-03-14',
            status: 'Approved',
            description: 'Diagnostic tests and analysis'
          }
        ]);
      } catch (error) {
        console.error('Error loading claims:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClaims();
  }, []);

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.claimId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || claim.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredClaims.reduce((sum, claim) => sum + claim.amount, 0);
  const pendingClaims = filteredClaims.filter(claim => claim.status === 'Pending');
  const approvedClaims = filteredClaims.filter(claim => claim.status === 'Approved');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.patientId) newErrors.patientId = 'Patient ID is required';
    if (!formData.patientName) newErrors.patientName = 'Patient name is required';
    if (!formData.insuranceProvider) newErrors.insuranceProvider = 'Insurance provider is required';
    if (!formData.policyNumber) newErrors.policyNumber = 'Policy number is required';
    if (!formData.claimType) newErrors.claimType = 'Claim type is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (!formData.date) newErrors.date = 'Date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateClaimId = () => {
    const lastId = claims.length > 0 
      ? parseInt(claims[claims.length - 1].claimId.slice(3))
      : 0;
    return `CLM${String(lastId + 1).padStart(3, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newClaim = {
      ...formData,
      claimId: generateClaimId(),
      status: 'Pending',
      amount: parseFloat(formData.amount)
    };

    setClaims(prev => [...prev, newClaim]);
    setShowClaimModal(false);
    setFormData({
      patientId: '',
      patientName: '',
      insuranceProvider: '',
      policyNumber: '',
      claimType: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleView = (claimId) => {
    const claim = claims.find(c => c.claimId === claimId);
    if (claim) {
      setSelectedClaim(claim);
    }
  };

  const handleStatusChange = (claimId, newStatus) => {
    setClaims(prev => 
      prev.map(claim => 
        claim.claimId === claimId ? { ...claim, status: newStatus } : claim
      )
    );
  };

  return (
    <div className="insurance-claims-container">
      <div className="claims-header">
        <h1>Insurance Claims Management {isViewOnly}</h1>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search by patient name, ID, claim ID, or policy number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          {!isViewOnly && (
            <button 
              className="add-claim-btn"
              onClick={() => setShowClaimModal(true)}
            >
              New Insurance Claim
            </button>
          )}
        </div>
      </div>

      <div className="claims-summary">
        <div className="summary-card">
          <h3>Total Claims</h3>
          <p>{filteredClaims.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total Amount</h3>
          <p>₹{totalAmount.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Pending Claims</h3>
          <p>{pendingClaims.length}</p>
        </div>
        <div className="summary-card">
          <h3>Approved Claims</h3>
          <p>{approvedClaims.length}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Loading claims...</div>
      ) : (
        <div className="claims-table-container">
          <table className="claims-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Insurance Provider</th>
                <th>Policy Number</th>
                <th>Claim Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.map(claim => (
                <tr key={claim.claimId}>
                  <td>{claim.claimId}</td>
                  <td>{claim.patientId}</td>
                  <td>{claim.patientName}</td>
                  <td>{claim.insuranceProvider}</td>
                  <td>{claim.policyNumber}</td>
                  <td>{claim.claimType}</td>
                  <td>₹{claim.amount.toFixed(2)}</td>
                  <td>{claim.date}</td>
                  <td>
                    <span className={`status-badge ${claim.status.toLowerCase()}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="action-btn view"
                      onClick={() => handleView(claim.claimId)}
                    >
                      View
                    </button>
                    {!isViewOnly && claim.status === 'Pending' && (
                      <>
                        <button 
                          className="action-btn approve"
                          onClick={() => handleStatusChange(claim.claimId, 'Approved')}
                        >
                          Approve
                        </button>
                        <button 
                          className="action-btn reject"
                          onClick={() => handleStatusChange(claim.claimId, 'Rejected')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showClaimModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>New Insurance Claim</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Patient ID:</label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  className={errors.patientId ? 'error' : ''}
                  required
                />
                {errors.patientId && <span className="error-message">{errors.patientId}</span>}
              </div>

              <div className="form-group">
                <label>Patient Name:</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  className={errors.patientName ? 'error' : ''}
                  required
                />
                {errors.patientName && <span className="error-message">{errors.patientName}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Insurance Provider:</label>
                  <input
                    type="text"
                    name="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={handleInputChange}
                    className={errors.insuranceProvider ? 'error' : ''}
                    required
                  />
                  {errors.insuranceProvider && <span className="error-message">{errors.insuranceProvider}</span>}
                </div>

                <div className="form-group">
                  <label>Policy Number:</label>
                  <input
                    type="text"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleInputChange}
                    className={errors.policyNumber ? 'error' : ''}
                    required
                  />
                  {errors.policyNumber && <span className="error-message">{errors.policyNumber}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Claim Type:</label>
                  <select
                    name="claimType"
                    value={formData.claimType}
                    onChange={handleInputChange}
                    className={errors.claimType ? 'error' : ''}
                    required
                  >
                    <option value="">Select Claim Type</option>
                    <option value="Medical Treatment">Medical Treatment</option>
                    <option value="Lab Tests">Lab Tests</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Medication">Medication</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.claimType && <span className="error-message">{errors.claimType}</span>}
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
                />
              </div>

              <div className="modal-buttons">
                <button 
                  type="button" 
                  className="cancel"
                  onClick={() => setShowClaimModal(false)}
                >
                  Cancel
                </button>
                <button type="submit">Submit Claim</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedClaim && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Claim Details</h2>
            <div className="claim-details">
              <p><strong>Claim ID:</strong> {selectedClaim.claimId}</p>
              <p><strong>Patient Name:</strong> {selectedClaim.patientName}</p>
              <p><strong>Patient ID:</strong> {selectedClaim.patientId}</p>
              <p><strong>Insurance Provider:</strong> {selectedClaim.insuranceProvider}</p>
              <p><strong>Policy Number:</strong> {selectedClaim.policyNumber}</p>
              <p><strong>Claim Type:</strong> {selectedClaim.claimType}</p>
              <p><strong>Amount:</strong> ₹{selectedClaim.amount.toFixed(2)}</p>
              <p><strong>Date:</strong> {selectedClaim.date}</p>
              <p><strong>Status:</strong> {selectedClaim.status}</p>
              <p><strong>Description:</strong> {selectedClaim.description}</p>
            </div>
            <div className="modal-buttons">
              <button 
                className="cancel"
                onClick={() => setSelectedClaim(null)}
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

export default InsuranceClaims; 