import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    contact: {
      phone: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      }
    },
    insurance: {
      provider: '',
      policyNumber: '',
      groupNumber: '',
      validUntil: ''
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5001/api/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch patient data');
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        address: {
          ...prev.contact.address,
          [name]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5001/api/patients/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/patients');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update patient');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="edit-patient">
      <h2>Edit Patient</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth.split('T')[0]}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Phone:</label>
          <input
            type="tel"
            name="contact.phone"
            value={formData.contact.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="contact.email"
            value={formData.contact.email}
            onChange={handleChange}
          />
        </div>

        <h3>Address</h3>
        <div className="form-group">
          <label>Street:</label>
          <input
            type="text"
            name="street"
            value={formData.contact.address.street}
            onChange={handleAddressChange}
          />
        </div>

        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={formData.contact.address.city}
            onChange={handleAddressChange}
          />
        </div>

        <div className="form-group">
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={formData.contact.address.state}
            onChange={handleAddressChange}
          />
        </div>

        <div className="form-group">
          <label>Zip Code:</label>
          <input
            type="text"
            name="zipCode"
            value={formData.contact.address.zipCode}
            onChange={handleAddressChange}
          />
        </div>

        <h3>Insurance Information</h3>
        <div className="form-group">
          <label>Provider:</label>
          <input
            type="text"
            name="insurance.provider"
            value={formData.insurance.provider}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Policy Number:</label>
          <input
            type="text"
            name="insurance.policyNumber"
            value={formData.insurance.policyNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Group Number:</label>
          <input
            type="text"
            name="insurance.groupNumber"
            value={formData.insurance.groupNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Valid Until:</label>
          <input
            type="date"
            name="insurance.validUntil"
            value={formData.insurance.validUntil?.split('T')[0] || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Update Patient</button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/patients')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPatient; 