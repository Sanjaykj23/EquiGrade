import UploadQP from "../Normalise/UploadQP";
function File1() {
  return (
    <div className="File1">
      <div className="head">
        <h1>Normalise Your CutOff</h1>
        <h4 style={{ color: "Grey" }}>
          Upload your question paper and marks to calculate a fair cutoff based
          on exam difficulty across different boards.
        </h4>
      </div>
      <div className="head">
        <h3>Upload The Question Paper</h3>
        <UploadQP />
      </div>
    </div>
  );
}
export default File1;
