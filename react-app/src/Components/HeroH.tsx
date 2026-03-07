function HeroH() {
  return (
    <div className="d-flex justify-content-center mt-4">

      <div
        id="carouselExample"
        className="carousel slide shadow rounded"
        style={{ width: "95%" }}
        data-bs-ride="carousel"
      >

        <div className="carousel-inner">

          <div className="carousel-item active">
            <img
              src="/ad1.png"
              className="d-block w-100"
              alt="slide1"
              style={{ height: "350px", objectFit: "fill", borderRadius:"10px"}}
            />
          </div>

          <div className="carousel-item">
            <img
              src="/ad2.png"
              className="d-block w-100"
              alt="slide2"
              style={{ height: "350px", objectFit: "fill",borderRadius:"10px"}}
            />
          </div>

          <div className="carousel-item">
            <img
              src="/ad3.png"
              className="d-block w-100"
              alt="slide3"
              style={{ height: "350px", objectFit: "fill",borderRadius:"10px"}}
            />
          </div>

        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>

      </div>
    </div>
  );
}

export default HeroH;