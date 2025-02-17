import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Topheader from "../components/topheader";
import "../styles/Registersentotp.css";
import { FaArrowRight } from "react-icons/fa6";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BeatLoader from "react-spinners/BeatLoader";
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
const Forgotpasswordsentotp = () => {
  const [mobileNumber, setmobilenumber] = useState("");
  const [error,seterror] = useState("")
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const apiurl = import.meta.env.VITE_API_URL
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await axios.get(`${apiurl}/seller/check-auth`, {
//           withCredentials: true, // Ensure cookies are sent
//         });
//         if (response.data.success) {
//           // If seller is authenticated, redirect to dashboard
//           navigate('/seller');
//         } else {
//           setIsAuthenticated(false); // Seller not logged in
//         }
//       } catch (error) {
//         console.log(error);
        
//         setIsAuthenticated(false); // Error handling if auth fails
//       }
//     };
//     checkAuth();
//   }, [navigate]);
  const handlesubmit = async (e) => {
    e.preventDefault();
    console.log(mobileNumber);
    
    
    try {
      let res = await axios.post(`${apiurl}/seller/signup/sent-otp`,{mobileNumber},{withCredentials : true})
      console.log(res.data);
      if(res.data.success){
        navigate('/sellerverify')
      } 
    } catch (error) {
      console.log(error);
      seterror(error.response?.data?.message || 'Something went wrong.')
    }
  };
//   if (isAuthenticated === null) {
//     return <div>Loading...</div>;
//   }
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
      
      <section>
        <ToastContainer/>
        <div className="container mt-3">
          <div className="row justify-content-center align-items-center my-auto">
            <div className="col-md-8">
              <div className="card card-big d-flex justify-content-center text-center">
                <div className="card-title-signup text-center">
                  <h2>Recover Your Account</h2>
                </div>
                {/* Form needs the button inside it */}
                <form
                  className="d-flex flex-column justify-content-center align-items-center mt-4"
                  onSubmit={handlesubmit}
                >
                  <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Enter Your Mobile Number"
                    maxLength={10}
                    onChange={(e) => setmobilenumber(e.target.value)}
                    value={mobileNumber}
                  />
                  {/* Move button inside the form */}
                  <div className="signup-btn mt-3 w-100 text-center">
                    <button
                      type="submit"
                      className="btn main-bg w-50 text-white"
                    >
                      Continue
                      <FaArrowRight className="ms-2" />
                    </button>
                  </div>
                  <div className="error-msg mt-4">
                      <span className="" style={{color : "red"}}>{error}</span>
                  </div>
                 
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    
    </div>
  );
};

export default Forgotpasswordsentotp;
