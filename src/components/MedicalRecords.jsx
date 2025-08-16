import React, { useState, useEffect } from 'react';
import '../styles/MedicalRecords.css';

const MedicalRecords = ({ patientId }) => {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRecord, setNewRecord] = useState({
    diagnosis: '',
    treatment: '',
    notes: '',
    attachments: []
  });

  useEffect(() => {
    fetchMedicalHistory();
  }, [patientId]);

  const fetchMedicalHistory = async () => {
    try {
      const response = await fetch(`/api/patients/${patientId}/medical-history`);
      if (!response.ok) throw new Error('Failed to fetch medical history');
      const data = await response.json();
      setMedicalHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewRecord(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(newRecord).forEach(([key, value]) => {
        if (key === 'attachments') {
          value.forEach(file => formData.append('attachments', file));
        } else {
          formData.append(key, value);
        }
      });

      const response = await fetch(`/api/patients/${patientId}/medical-history`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to add medical record');
      
      setNewRecord({
        diagnosis: '',
        treatment: '',
        notes: '',
        attachments: []
      });
      fetchMedicalHistory();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading medical records...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="medical-records">
      <h2>Medical Records</h2>
      
      {/* Add New Record Form */}
      <form onSubmit={handleSubmit} className="new-record-form">
        <h3>Add New Medical Record</h3>
        <div className="form-group">
          <label>Diagnosis</label>
          <input
            type="text"
            name="diagnosis"
            value={newRecord.diagnosis}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Treatment</label>
          <textarea
            name="treatment"
            value={newRecord.treatment}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={newRecord.notes}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label>Attachments</label>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>
        
        <button type="submit" className="submit-button">Add Record</button>
      </form>

      {/* Medical History List */}
      <div className="medical-history">
        <h3>Medical History</h3>
        {medicalHistory.length === 0 ? (
          <p>No medical records found</p>
        ) : (
          <div className="history-list">
            {medicalHistory.map((record, index) => (
              <div key={index} className="history-item">
                <div className="record-header">
                  <span className="date">{new Date(record.date).toLocaleDateString()}</span>
                  <span className="doctor">Dr. {record.doctor.name}</span>
                </div>
                <div className="record-content">
                  <h4>Diagnosis: {record.diagnosis}</h4>
                  <p><strong>Treatment:</strong> {record.treatment}</p>
                  {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
                  {record.attachments && record.attachments.length > 0 && (
                    <div className="attachments">
                      <strong>Attachments:</strong>
                      <ul>
                        {record.attachments.map((file, i) => (
                          <li key={i}>
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                              {file.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords; 