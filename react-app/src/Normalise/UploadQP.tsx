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
  const handleNormalize = async () => {
    if (!chemistryFile || !physicsFile || !mathsFile) {
      alert("Please upload all three question papers");
      return;
    }

    const formData = new FormData();
    formData.append("chemistry", chemistryFile);
    formData.append("physics", physicsFile);
    formData.append("maths", mathsFile);

    try {
      const response = await fetch("http://localhost:5000/normalize", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      alert("Normalization completed!");
    } catch (error) {
      console.error(error);
    }
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
      <button className="btn btn-lg me-3 btn-purple" onClick={handleNormalize}>Normalize</button>
    </div>
  );
}

export default UploadQP;
