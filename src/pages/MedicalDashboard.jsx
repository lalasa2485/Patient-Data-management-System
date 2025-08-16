import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MedicalDashboard.css";

const MedicalDashboard = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [patient, setPatient] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState([]);
  const [currentService, setCurrentService] = useState({ name: "", cost: "" });

  const totalAmount = services.reduce((sum, s) => sum + Number(s.cost), 0);

  const handleAddService = () => {
    if (currentService.name && currentService.cost) {
      setServices([...services, currentService]);
      setCurrentService({ name: "", cost: "" });
    }
  };

  const handleGenerateBill = () => {
    alert("Bill generated successfully!");
    setShowModal(false);
    setPatient("");
    setDescription("");
    setServices([]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="medical-dashboard">
      <div className="top-bar">
        <h2>Welcome, Medical Staff</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <button className="open-modal-btn" onClick={() => setShowModal(true)}>
        Generate New Bill
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Generate New Bill</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <p className="sub-text">Create a new bill for patient services</p>

            <label>Select Patient *</label>
            <select value={patient} onChange={(e) => setPatient(e.target.value)}>
              <option value="">Select a patient</option>
              <option value="P001">John Smith</option>
              <option value="P002">Emma Johnson</option>
              {/* Add more patients dynamically later */}
            </select>

            <label>Description *</label>
            <textarea
              placeholder="Enter bill description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="service-input">
              <label>Treatments and Services *</label>
              <div className="service-fields">
                <input
                  type="text"
                  placeholder="Treatment name"
                  value={currentService.name}
                  onChange={(e) =>
                    setCurrentService({ ...currentService, name: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Cost"
                  value={currentService.cost}
                  onChange={(e) =>
                    setCurrentService({ ...currentService, cost: e.target.value })
                  }
                />
                <button className="add-item-btn" onClick={handleAddService}>
                  + Add Item
                </button>
              </div>
            </div>

            <div className="total">
              <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="generate-btn" onClick={handleGenerateBill}>
                Generate Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalDashboard;
