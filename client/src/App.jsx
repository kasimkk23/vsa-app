import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [excelData, setExcelData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [matchedRow, setMatchedRow] = useState(null);
  const [status, setStatus] = useState("");
  const [updated, setUpdated] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      setExcelData(json);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setMatchedRow(null);
    setStatus("");
    setUpdated(false);

    if (value.length > 0) {
      const filtered = excelData.filter((row) =>
        row.plate_number?.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (row) => {
    setSearchInput(row.plate_number);
    setMatchedRow(row);
    setShowSuggestions(false);
    setUpdated(false);
  };

  const handleStatusSubmit = () => {
    const updatedData = excelData.map((row) =>
      row.plate_number === matchedRow.plate_number
        ? { ...row, status: status }
        : row
    );
    setExcelData(updatedData);
    setUpdated(true);
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Updated Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "updated_excel.xlsx");
  };

  const totalCars = excelData.length;
  const carsWithStatus = excelData.filter(
    (row) => row.status && row.status.trim() !== ""
  ).length;

  return (
    <div className="container text-center py-5">
      <img src="delivery.png" alt="" />
      <h1 className="mb-4"><b>DSY 1</b></h1>
      <h1 className="mb-4">VSA - Position 4</h1>

      <div className="mb-3">
        <input
          type="file"
          accept=".xlsx, .xls"
          className="form-control"
          onChange={handleFileUpload}
        />
      </div>

      {excelData.length > 0 && (
        <>
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="alert alert-info">
                Total Cars: <strong>{totalCars}</strong>
              </div>
            </div>
            <div className="col-md-6">
              <div className="alert alert-success">
                Cars with Status: <strong>{carsWithStatus}</strong>
              </div>
            </div>
          </div>

          <div className="mb-3 position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Search plate number"
              value={searchInput}
              onChange={handleSearchChange}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="list-group position-absolute w-100 z-3">
                {suggestions.map((row, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleSuggestionClick(row)}
                    style={{ cursor: "pointer" }}
                  >
                    {row.plate_number}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {matchedRow && (
        <div className="mb-3">
          <p className="fw-bold">Company: {matchedRow.company_name}</p>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Enter status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleStatusSubmit}>
            Submit Status
          </button>
        </div>
      )}

      {updated && (
        <div className="alert alert-success mt-3">
          Status updated successfully!
        </div>
      )}

      {excelData.length > 0 && updated && (
        <button className="btn btn-primary mt-4" onClick={handleDownload}>
          Download Updated Excel
        </button>
      )}
    </div>
  );
}

export default App;
