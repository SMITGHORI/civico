import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const slides = [
  {
    image: "../../banner1.jpg",
    title: "Welcome to CIVICO – Your Trusted Construction Material Supplier",
    description: "Visit us today for the best deals on premium materials."
  },
  {
    image: "../../banner3.jpg",
    title: "Building Dreams With Precision & Excellence.",
    description: "Discover organic, sustainable food from our organic farm and fresh vegetable, and food."
  },
  {
    image: "../../banner2.jpg",
    title: "Express Delivery of Construction Materials",
    description: "Free 1-Day delivery of hardware, safety, wood, and more at your site, on time, at the best prices, and correct bills! Always!"
  },
  {
    image: "../../banner4.jpg",
    title: "Top-Quality Materials for Every Project",
    description: "Get premium-grade cement, steel, bricks, plumbing, and electrical supplies at unbeatable prices."
  }
];

const BannerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const prevSlide = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? slides.length - 1 : prevIndex - 1
      );
      setFade(false);
    }, 300);
  };

  const nextSlide = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
      setFade(false);
    }, 300);
  };

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [currentIndex]); // Runs every time currentIndex changes

  return (
    <section className="mt-3 position-relative">
      <button
        className="position-absolute top-50 start-0 translate-middle-y btn"
        onClick={prevSlide}
        style={{ zIndex: 10 }}
      >
        <FaChevronLeft />
      </button>
      <div className="container">
        <div className="row d-flex align-items-center">
          <div className="col-12 col-lg-6">
            <div className={`banner-text ${fade ? "fade-out" : "fade-in"}`}>
              <h1 style={{ fontSize: "40px" }} className="fw-600">
                {slides[currentIndex].title}
              </h1>
              <span className="color-secondary">
                {slides[currentIndex].description}
              </span>
              <div className="add-to-cart-btn d-flex mt-4 pb-3">
                <a href="#cate" className="px-5 py-2">
                  <span>Shop Now</span>
                </a>
              </div>
            </div>
          </div>
          <div className="col-6 d-none d-lg-flex d-flex justify-content-center">
            <div className="banner-img" style={{ height: "500px" }}>
              <img
                src={slides[currentIndex].image}
                className={`h-100 ${fade ? "fade-out" : "fade-in"}`}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <button
        className="position-absolute top-50 end-0 translate-middle-y btn"
        onClick={nextSlide}
        style={{ zIndex: 10 }}
      >
        <FaChevronRight />
      </button>

      {/* CSS Styles */}
      <style jsx>{`
        .fade-in {
          opacity: 1;
          transition: opacity 0.5s ease-in-out;
        }
        .fade-out {
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default BannerSlider;
