import React, { useState } from "react";
import "../App.css";

const UploadQP: React.FC = () => {
  // File States
  const [chemistryFile, setChemistryFile] = useState<File | null>(null);
  const [physicsFile, setPhysicsFile] = useState<File | null>(null);
  const [mathsFile, setMathsFile] = useState<File | null>(null);

  // Marks States
  const [chemistryMarks, setChemistryMarks] = useState("");
  const [physicsMarks, setPhysicsMarks] = useState("");
  const [mathsMarks, setMathsMarks] = useState("");

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    subject: string
  ) => {
    if (!event.target.files) return;
    const file = event.target.files[0];

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    if (subject === "chemistry") setChemistryFile(file);
    if (subject === "physics") setPhysicsFile(file);
    if (subject === "maths") setMathsFile(file);
  };

  const handleNormalize = async () => {
    if (!chemistryFile || !physicsFile || !mathsFile) {
      alert("Please upload all question papers");
      return;
    }
    if (!chemistryMarks || !physicsMarks || !mathsMarks) {
      alert("Please enter all marks");
      return;
    }

    const formData = new FormData();
    formData.append("chemistry", chemistryFile);
    formData.append("physics", physicsFile);
    formData.append("maths", mathsFile);
    formData.append("chemistryMarks", chemistryMarks);
    formData.append("physicsMarks", physicsMarks);
    formData.append("mathsMarks", mathsMarks);

    try {
      const response = await fetch("http://localhost:5000/normalize", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      alert("Normalization Completed!");
    } catch (error) {
      console.error(error);
      alert("Error occurred");
    }
  };

  return (
    <div className="upload-page-wrapper">

      <div className="upload-container">

        {/* Upload Section */}
        <div className="upload-section">
          <div className="upload-card">
            <h4>Chemistry Question Paper</h4>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileUpload(e, "chemistry")}
            />
            {chemistryFile && <p className="file-name">{chemistryFile.name}</p>}
          </div>

          <div className="upload-card">
            <h4>Physics Question Paper</h4>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileUpload(e, "physics")}
            />
            {physicsFile && <p className="file-name">{physicsFile.name}</p>}
          </div>

          <div className="upload-card">
            <h4>Maths Question Paper</h4>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileUpload(e, "maths")}
            />
            {mathsFile && <p className="file-name">{mathsFile.name}</p>}
          </div>
        </div>

        {/* Marks Section */}
        <div className="marks-section">
          <h3 className="section-title">Enter Your Marks</h3>
          <div className="marks-grid">
            <input
              type="number"
              placeholder="Chemistry Marks"
              value={chemistryMarks}
              onChange={(e) => setChemistryMarks(e.target.value)}
            />
            <input
              type="number"
              placeholder="Physics Marks"
              value={physicsMarks}
              onChange={(e) => setPhysicsMarks(e.target.value)}
            />
            <input
              type="number"
              placeholder="Maths Marks"
              value={mathsMarks}
              onChange={(e) => setMathsMarks(e.target.value)}
            />
          </div>
        </div>

        {/* Normalize Button */}
        <button className="normalize-btn" onClick={handleNormalize}>
          Normalize
        </button>
      </div>
    </div>
  );
};

export default UploadQP;