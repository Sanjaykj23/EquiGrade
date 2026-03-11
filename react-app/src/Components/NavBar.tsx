import { Link } from "react-router-dom";
function NavBar() {
  return (
    <nav
      className="navbar navbar-dark navbar-expand-lg sticky-top"
      style={{ backgroundColor: "#2f0141",
        boxShadow: "0 4px 10px rgb(0, 0, 0)"
      }}
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img
            src="/logo.png"
            alt="Logo"
            width="32%"
            height="9%"
            className="d-inline-block align-text-top"
          />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/normalise">Normalise Cutoff</Link>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#" >Analyse difficulty</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;