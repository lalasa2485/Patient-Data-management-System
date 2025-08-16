import React, { useState, useEffect } from 'react';
import '../styles/PatientRecords.css';

const PatientRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    name: '',
    age: '',
    gender: '',
    contact: '',
    address: '',
    medicalHistory: '',
    bloodGroup: '',
    allergies: '',
    emergencyContact: ''
  });
  const [errors, setErrors] = useState({});

  // Simulate loading patient data
  useEffect(() => {
    const loadPatients = async () => {
      // Simulate API call
      const samplePatients = [
        {
          patientId: 'P001',
          name: 'John Doe',
          age: 35,
          gender: 'Male',
          contact: '1234567890',
          address: '123 Main St, City',
          medicalHistory: 'Hypertension',
          bloodGroup: 'A+',
          allergies: 'None',
          emergencyContact: 'Jane Doe (9876543210)'
        },
        {
          patientId: 'P002',
          name: 'Jane Smith',
          age: 28,
          gender: 'Female',
          contact: '9876543210',
          address: '456 Oak Ave, Town',
          medicalHistory: 'Asthma',
          bloodGroup: 'B+',
          allergies: 'Peanuts',
          emergencyContact: 'John Smith (1234567890)'
        }
      ];
      setPatients(samplePatients);
    };

    loadPatients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.contact) newErrors.contact = 'Contact is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Generate new patient ID
    const newPatientId = `P${String(patients.length + 1).padStart(3, '0')}`;
    
    const newPatient = {
      ...formData,
      patientId: newPatientId
    };

    setPatients(prev => [...prev, newPatient]);
    setShowAddModal(false);
    setFormData({
      patientId: '',
      name: '',
      age: '',
      gender: '',
      contact: '',
      address: '',
      medicalHistory: '',
      bloodGroup: '',
      allergies: '',
      emergencyContact: ''
    });
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="patient-records-container">
      <div className="records-header">
        <h2>Patient Records</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => setShowAddModal(true)} className="add-patient-btn">
            Add New Patient
          </button>
        </div>
      </div>

      <div className="records-table-container">
        <table className="records-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Contact</th>
              <th>Blood Group</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(patient => (
              <tr key={patient.patientId}>
                <td>{patient.patientId}</td>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.contact}</td>
                <td>{patient.bloodGroup}</td>
                <td>
                  <button className="view-btn" onClick={() => handleViewPatient(patient)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Patient</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'error' : ''}
                    required
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label>Age:</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className={errors.age ? 'error' : ''}
                    required
                  />
                  {errors.age && <span className="error-message">{errors.age}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Gender:</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={errors.gender ? 'error' : ''}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <span className="error-message">{errors.gender}</span>}
                </div>

                <div className="form-group">
                  <label>Blood Group:</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className={errors.bloodGroup ? 'error' : ''}
                    required
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  {errors.bloodGroup && <span className="error-message">{errors.bloodGroup}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Contact:</label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className={errors.contact ? 'error' : ''}
                  required
                />
                {errors.contact && <span className="error-message">{errors.contact}</span>}
              </div>

              <div className="form-group">
                <label>Address:</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'error' : ''}
                  required
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label>Medical History:</label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Allergies:</label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Emergency Contact:</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-buttons">
                <button type="button" className="cancel" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit">Save Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedPatient && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Patient Details</h2>
            <div className="patient-details">
              <div className="detail-row">
                <strong>Patient ID:</strong>
                <span>{selectedPatient.patientId}</span>
              </div>
              <div className="detail-row">
                <strong>Name:</strong>
                <span>{selectedPatient.name}</span>
              </div>
              <div className="detail-row">
                <strong>Age:</strong>
                <span>{selectedPatient.age}</span>
              </div>
              <div className="detail-row">
                <strong>Gender:</strong>
                <span>{selectedPatient.gender}</span>
              </div>
              <div className="detail-row">
                <strong>Contact:</strong>
                <span>{selectedPatient.contact}</span>
              </div>
              <div className="detail-row">
                <strong>Blood Group:</strong>
                <span>{selectedPatient.bloodGroup}</span>
              </div>
              <div className="detail-row">
                <strong>Address:</strong>
                <span>{selectedPatient.address}</span>
              </div>
              <div className="detail-row">
                <strong>Medical History:</strong>
                <span>{selectedPatient.medicalHistory || 'None'}</span>
              </div>
              <div className="detail-row">
                <strong>Allergies:</strong>
                <span>{selectedPatient.allergies || 'None'}</span>
              </div>
              <div className="detail-row">
                <strong>Emergency Contact:</strong>
                <span>{selectedPatient.emergencyContact || 'None'}</span>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="close-btn" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
