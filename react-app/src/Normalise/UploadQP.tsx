import React, { useState } from "react";

function UploadQP() {
  // States for each subject
  const [chemistryFile, setChemistryFile] = useState<File | null>(null);
  const [physicsFile, setPhysicsFile] = useState<File | null>(null);
  const [mathsFile, setMathsFile] = useState<File | null>(null);

  // Chemistry Upload
  const handleChemistryUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files) return;

    const file = event.target.files[0];

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    setChemistryFile(file);
  };

  // Physics Upload
  const handlePhysicsUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    setPhysicsFile(file);
  };

  // Maths Upload
  const handleMathsUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    setMathsFile(file);
  };

  return (
    <div>
      {/* Chemistry Upload */}
      <div style={{ marginBottom: "20px" }}>
        <h4>Chemistry Question Paper</h4>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleChemistryUpload}
        />
        {chemistryFile && <p>Uploaded: {chemistryFile.name}</p>}
      </div>

      {/* Physics Upload */}
      <div style={{ marginBottom: "20px" }}>
        <h4>Physics Question Paper</h4>
        <input
          type="file"
          accept="application/pdf"
          onChange={handlePhysicsUpload}
        />
        {physicsFile && <p>Uploaded: {physicsFile.name}</p>}
      </div>

      {/* Maths Upload */}
      <div style={{ marginBottom: "20px" }}>
        <h4>Maths Question Paper</h4>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleMathsUpload}
        />
        {mathsFile && <p>Uploaded: {mathsFile.name}</p>}
      </div>
    </div>
  );
}

export default UploadQP;
