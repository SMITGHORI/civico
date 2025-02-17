import { useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Topheader from "../components/topheader";
import "../styles/Registersentotp.css";
import { FaArrowRight } from "react-icons/fa6";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
const Username = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [error,seterror] = useState("")
  const navigate = useNavigate()
  const apiurl = import.meta.env.VITE_API_URL
  const handlesubmit = async (e) => {
    e.preventDefault();
    if(!username || !password) {
      seterror("All Fields Is Required")
      return false
    }
    let obj = {
        username,password
    }
    try {
      let res = await axios.post(`${apiurl}/seller/signup/setcrediantals`,obj,{withCredentials : true})
      console.log(res.data);
      if(res.data.success){
        navigate('/sellersigin')
      } 
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      
      <Navbar />
      <section>
        <div className="container mt-3">
          <div className="row justify-content-center align-items-center my-auto">
            <div className="col-md-8">
              <div className="card card-big d-flex justify-content-center text-center">
                <div className="card-title-signup text-center">
                  <h2>Username</h2>
                </div>
                {/* Form needs the button inside it */}
                <form
                  className="d-flex flex-column justify-content-center align-items-center mt-4"
                  onSubmit={handlesubmit}
                >
                  <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Enter Username"
                    maxLength={10}
                    onChange={(e) => setusername(e.target.value)}
                    value={username}
                  />
                  <input
                    type="password"
                    className="form-control w-50 mt-2"
                    placeholder="Enter Password"
                    onChange={(e) => setpassword(e.target.value)}
                    value={password}
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
      <Footer />
    </div>
  );
};

export default Username;
