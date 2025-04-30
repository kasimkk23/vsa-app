// App.jsx (Updated to fetch data from database)

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [excelData, setExcelData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/data");
        const data = await res.json();
        setExcelData(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage("");
  };

  // Upload Excel to backend
  const handleUploadToDB = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message || "Upload complete.");
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Error uploading file.");
    }
  };

  return (
    <div className="container text-center py-5">
      <h1 className="mb-4">Car Inspection Uploader</h1>

      <div className="mb-3">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <button
          className="btn btn-primary"
          onClick={handleUploadToDB}
          disabled={!selectedFile}
        >
          Upload Excel to Database
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <h2 className="mt-4">Database Records</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Plate Number</th>
            <th>Card ID</th>
            <th>Company</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {excelData.map((row, index) => (
            <tr key={index}>
              <td>{row.plate_number}</td>
              <td>{row.car_id}</td>
              <td>{row.company_name}</td>
              <td>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
