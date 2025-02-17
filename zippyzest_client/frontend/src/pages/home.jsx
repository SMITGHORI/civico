import Categories from "../components/categories";
import Navbar from "../components/navbar";
import Topheader from "../components/topheader";
import { MdOutlineLocalShipping } from "react-icons/md";
import { GiReturnArrow } from "react-icons/gi";
import { MdOutlineSecurity } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import Products from "../components/products";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { MdOutlineEmail } from "react-icons/md";
import BannerSlider from "./banner";
import ContactSection from "./contact";

const override = {
  display: "block",
  margin: "auto auto",
  borderColor: "red",
};
const loaderContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh", 
};
const Home = () => {
  useEffect(() => {
    document.title = "CIVICO"; 
}, []);
const [loading, setLoading] = useState(true); 

useEffect(() => {
  const timer = setTimeout(() => {
    setLoading(false); 
  }, 3000);

  return () => clearTimeout(timer);
}, []);

if (loading) {

  return (
    <div className="loader-container" style={loaderContainerStyle}>
      <BeatLoader
        color={"#699c47"}
        loading={loading}
        cssOverride={override}
        size={15}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}
  return (
    <div>
      <Navbar />
      <BannerSlider/>
       
      <Categories />
      <section>
        <div className="container pt-70">
          <div className="row services" >
            <div className="col-12 col-md-6 col-lg-3 mt-4">
              <div className="service-box d-flex align-items-center justify-conten-center">
                <div className="col-4">
                  <a href="">
                    <MdOutlineLocalShipping
                      className="main-text"
                      style={{ fontSize: "32px" }}
                    />
                  </a>
                </div>
                <div className="col-8">
                  <h2 className="main-text fs-20 m-0">Free Shipping</h2>
                  <span className="color-secondary fs-16 m-0">
                    On All Order Over
                  </span>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3 mt-4">
              <div className="service-box d-flex align-items-center justify-conten-center">
                <div className="col-4">
                  <a href="">
                    <GiReturnArrow
                      className="main-text"
                      style={{ fontSize: "32px" }}
                    />
                  </a>
                </div>
                <div className="col-8">
                  <h2 className="main-text fs-20 m-0">Easy Returns</h2>
                  <span className="color-secondary fs-16 m-0">
                    Easy Returns 30 Day Returns Policy
                  </span>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3 mt-4">
              <div className="service-box d-flex align-items-center justify-conten-center">
                <div className="col-4">
                  <a href="">
                    <MdOutlineSecurity
                      className="main-text"
                      style={{ fontSize: "32px" }}
                    />
                  </a>
                </div>
                <div className="col-8">
                  <h2 className="main-text fs-20 m-0">Secure Payment</h2>
                  <span className="color-secondary fs-16 m-0">
                    100% Secure Gaurantee
                  </span>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3 mt-4">
              <div className="service-box d-flex align-items-center justify-conten-center">
                <div className="col-4">
                  <a href="">
                    <BiSupport
                      className="main-text"
                      style={{ fontSize: "32px" }}
                    />
                  </a>
                </div>
                <div className="col-8">
                  <h2 className="main-text fs-20 m-0">Special Support</h2>
                  <span className="color-secondary fs-16 m-0">
                    24/7 Dedicated Support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Products />
      <ContactSection/>
      <Footer />
    </div>
  );
};

export default Home;
