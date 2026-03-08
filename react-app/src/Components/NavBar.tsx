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
            width="29%"
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
              <a className="nav-link active" href="#" >Home</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#" >Normalise Cutoff</a>
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