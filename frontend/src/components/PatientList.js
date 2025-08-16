import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/PatientList.css';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch patients');
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/patients/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchPatients(); // Refresh the list
      } catch (err) {
        setError('Failed to delete patient');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="patient-list">
      <div className="patient-list-header">
        <h2>Patients</h2>
        <Link to="/patients/new" className="btn-add">
          Add New Patient
        </Link>
      </div>

      <div className="patient-grid">
        {patients.map(patient => (
          <div key={patient._id} className="patient-card">
            <div className="patient-info">
              <h3>{patient.name}</h3>
              <p><strong>ID:</strong> {patient.patientId}</p>
              <p><strong>DOB:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
              <p><strong>Gender:</strong> {patient.gender}</p>
              <p><strong>Phone:</strong> {patient.contact.phone}</p>
              <p><strong>Email:</strong> {patient.contact.email}</p>
            </div>
            <div className="patient-actions">
              <button 
                className="btn-edit"
                onClick={() => handleEdit(patient._id)}
              >
                Edit
              </button>
              <button 
                className="btn-delete"
                onClick={() => handleDelete(patient._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {patients.length === 0 && (
        <div className="no-patients">
          <p>No patients found. Add a new patient to get started.</p>
        </div>
      )}
    </div>
  );
};

export default PatientList; 