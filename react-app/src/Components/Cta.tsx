import { Link } from "react-router-dom";
function Cta() {
  return (
    <div className="d-flex justify-content-center mt-4">
      <Link className="nav-link" to="/normalise"><button
        type="button"
        className="btn btn-lg me-3 btn-purple"
      >
        Normalise cutoff
      </button></Link>

      <button
        type="button"
        className="btn btn-lg btn-purple"
      >
        Analyse QP
      </button>
    </div>
  );
}

export default Cta;