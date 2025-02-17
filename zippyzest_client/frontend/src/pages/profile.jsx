import Navbar from "../components/navbar";
import Topheader from "../components/topheader";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import "../styles/style.css";
import "../styles/profile.css";
import { FaCartArrowDown } from "react-icons/fa6";
import Profilesidebar from "../components/profilesidebar";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";
import BeatLoader from "react-spinners/BeatLoader";
import { useEffect, useState } from "react";
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
const Profile = () => {
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
      <section>
        <div className="container-fluid m-0 p-0">
          <div className="profile-img d-flex justify-content-center align-items-center">
            <h2 className="text-white fw-500">My Account</h2>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <Profilesidebar />
            <div className="col-12 col-lg-9">
              <div className="profile-box ">
                <div className="pro-order-main">
                  <h5>Hello John duo</h5>
                  <p className="color-secondary">
                    From your account dashboard you can view your recent orders,
                    manage your shipping and billing addresses, and edit your
                    password and account details.
                  </p>
                </div>
                <div className="pro-order-boxes d-flex ">
                  <div className="col-12 col-md-4 me-2 mt-3">
                    <div className="pro-order-box p-4"style={{border:"1px solid #e5ddd9",borderRadius : "8px"}}>
                        <div className="icon-img-pro p-2 d-flex justify-content-center align-items-center"style={{border:"1px solid #e5ddd9",width:"20%",borderRadius : "8px",backgroundColor : "#ffffff"}}>
                        <FaCartArrowDown className="fs-24 green-text"/>
                        </div>
                        <div className="pro-order-mini-box-main mt-2">
                        <span className="fs-24 fw-600">Total Orders</span>
                        <h3 style={{fontSize : "30px"}}>10</h3>
                        </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4 me-2 mt-3">
                    <div className="pro-order-box p-4"style={{border:"1px solid #e5ddd9",borderRadius : "8px"}}>
                        <div className="icon-img-pro p-2 d-flex justify-content-center align-items-center"style={{border:"1px solid #e5ddd9",width:"20%",borderRadius : "8px",backgroundColor : "#ffffff"}}>
                        <MdOutlinePendingActions className="fs-24 green-text"/>
                        </div>
                        <div className="pro-order-mini-box-main mt-2">
                        <span className="fs-24 fw-600">Total Pending Orders</span>
                        <h3 style={{fontSize : "30px"}}>10</h3>
                        </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4 mt-3">
                    <div className="pro-order-box p-4"style={{border:"1px solid #e5ddd9",borderRadius : "8px"}}>
                        <div className="icon-img-pro p-2 d-flex justify-content-center align-items-center"style={{border:"1px solid #e5ddd9",width:"20%",borderRadius : "8px",backgroundColor : "#ffffff"}}>
                        <FaUserCog className="fs-24 green-text"/>
                        </div>
                        <div className="pro-order-mini-box-main mt-2">
                        <span className="fs-24 fw-600">Total Wishlist</span>
                        <h3 style={{fontSize : "30px"}}>10</h3>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Profile;
