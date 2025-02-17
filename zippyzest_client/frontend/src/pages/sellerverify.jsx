import axios from "axios";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Topheader from "../components/topheader";
import "../styles/Registersentotp.css";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const Sellerverify = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate()
  const [error,seterror] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const apiurl = import.meta.env.VITE_API_URL
  useEffect(() => {
    const checkOtpInitiation = () => {
      const token = document.cookie.split("; ").find((row) => row.startsWith("verifytoken="));
      if (!token) {
        // Redirect to mobile number entry page if OTP process not initiated
        alert("Please enter your mobile number first.");
        navigate("/sellerlogin");
      }
    };

    checkOtpInitiation();
  }, [navigate]);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${apiurl}/seller/check-auth`, {
          withCredentials: true, // Ensure cookies are sent
        });
        if (response.data.success) {
          // If seller is authenticated, redirect to dashboard
          navigate('/seller');
        } else {
          setIsAuthenticated(false); // Seller not logged in
        }
      } catch (error) {
        console.log(error);
        
        setIsAuthenticated(false); // Error handling if auth fails
      }
    };
    checkAuth();
  }, [navigate]);
  const handlesubmit = async(e) => {
    e.preventDefault();
    if(!otp) {
      seterror("otp Is Required..")
      return false
    }
    try {
      let res =  await axios.post(`${apiurl}/seller/signup/verify-otp`,{otp},{withCredentials : true})
      console.log(res.data);
      if(res.data.success){
        alert("OTP verified successfully");
        navigate('/usernametake')
      }
    } catch (error) {
      console.log(error);
    }
  }
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      
      <Navbar />
      <section>
        <div className="container mt-3">
          <div className="row justify-content-center align-items-center my-auto">
            <div className="col-md-8">
              <div className="card card-big d-flex justify-content-center text-center">
                <div className="card-title-signup text-center">
                  <h2>Verify-otp</h2>
                </div>
                <form className="d-flex flex-column align-items-center justify-content-center mt-4"
                onSubmit={handlesubmit}>
                  <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Verify Otp"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                   <div className="signup-btn mt-3 w-100 text-center">
                    <button
                      type="submit"
                      className="btn main-bg w-50 text-white"
                    >
                      Verify
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
      <Footer />
    </div>
  );
};

export default Sellerverify;
