function Cards() {
  return (
    <div className="d-flex justify-content-center mt-4">
      <div className="card" style={{ width: "18rem",marginRight:'25px'}}>
        <div className="card-body">
          <h5 className="card-title">Cutoff Normalization</h5>
          <h6 className="card-subtitle mb-2" style={{color:"grey"}}>
            Ensures fair comparison of scores across different exam sessions.
          </h6>
          <p className="card-text">
            Adjusts marks across different exam sessions to ensure fairness.
          </p>
        </div>
      </div>
      <div className="card" style={{ width: "18rem",marginRight:'25px'}}>
        <div className="card-body">
          <h5 className="card-title">Question Paper Analysis</h5>
          <h6 className="card-subtitle mb-2 " style={{color:"grey"}}>
            Identifies easy, medium, and difficult questions using statistical patterns.
          </h6>
          <p className="card-text">
            Detects easy, medium, and hard questions using statistical analysis.
          </p>
        </div>
      </div>
      <div className="card" style={{ width: "18rem",marginRight:'25px' }}>
        <div className="card-body">
          <h5 className="card-title">Data-Driven Decisions</h5>
          <h6 className="card-subtitle mb-2 " style={{color:"grey"}}>
            Transforms exam data into fair and transparent admission insights.
          </h6>
          <p className="card-text">
            Helps institutions make fair admission decisions using analytics.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cards;
