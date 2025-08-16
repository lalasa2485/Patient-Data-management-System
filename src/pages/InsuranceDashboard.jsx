import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/InsuranceDashboard.css";

const InsuranceDashboard = () => {
  const navigate = useNavigate();

  const [claims, setClaims] = useState([
    { id: "C001", patient: "John Smith", billId: "B001", amount: 450.75, status: "Approved" },
    { id: "C002", patient: "Emma Johnson", billId: "B002", amount: 325.5, status: "Pending" },
    { id: "C003", patient: "Michael Chen", billId: "B003", amount: 195.25, status: "Rejected" },
    { id: "C004", patient: "Sophia Martinez", billId: "B004", amount: 780.0, status: "Pending" },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleStatusChange = (id, newStatus) => {
    setClaims(prev =>
      prev.map(claim =>
        claim.id === id ? { ...claim, status: newStatus } : claim
      )
    );
  };

  const totalClaims = claims.length;
  const approved = claims.filter(c => c.status === "Approved").length;
  const pending = claims.filter(c => c.status === "Pending").length;
  const rejected = claims.filter(c => c.status === "Rejected").length;

  return (
    <div className="insurance-dashboard">
      {/* Top bar with title and logout */}
      <div className="top-bar">
        <h2>Insurance Claims</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <p>Manage patient insurance claims and status updates</p>

      <div className="summary-cards">
        <div className="card">Total Claims: <strong>{totalClaims}</strong></div>
        <div className="card">Approved: <strong>{approved}</strong></div>
        <div className="card">Pending: <strong>{pending}</strong></div>
        <div className="card">Rejected: <strong>{rejected}</strong></div>
      </div>

      <input type="text" className="search-bar" placeholder="Search claims..." />

      <table className="claims-table">
        <thead>
          <tr>
            <th>Claim ID</th>
            <th>Patient</th>
            <th>Bill ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((claim, index) => (
            <tr key={index}>
              <td>{claim.id}</td>
              <td>{claim.patient}</td>
              <td>{claim.billId}</td>
              <td>${claim.amount.toFixed(2)}</td>
              <td>
                <span className={`status ${claim.status.toLowerCase()}`}>{claim.status}</span>
              </td>
              <td>
                {claim.status === "Pending" && (
                  <>
                    <button onClick={() => handleStatusChange(claim.id, "Approved")} className="approve">Approve</button>
                    <button onClick={() => handleStatusChange(claim.id, "Rejected")} className="reject">Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InsuranceDashboard;
