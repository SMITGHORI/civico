import Navbar from "../components/navbar";
import Topheader from "../components/topheader";
import Footer from "../components/footer";
import Profilesidebar from "../components/profilesidebar";
import "../styles/style.css";
import "../styles/profile.css";
import { useEffect, useState } from "react";
import axios from "axios";
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
const Profileshow = () => {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [mobileNumber, setmobilenumber] = useState("");
  const [loading, setLoading] = useState(false);
  const apiurl = import.meta.env.VITE_API_URL
  
  // Fetch user details from the server
  const fetchuser = async () => {
    try {
      let res = await axios.get(`${apiurl}/auth/getuser`, { withCredentials: true });
      if (res.data.success) {
        console.log(res.data);
        
        setusername(res.data.user.username);
        setemail(res.data.user.email);
        setmobilenumber(res.data.user.mobileNumber);
        console.log(email);
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = { username, email, mobileNumber };
      let res = await axios.post(`${apiurl}/auth/update-user`, updatedUser, { withCredentials: true });
      if (res.data.success) {
        alert('User updated successfully');
      } else {
        alert('Update failed');
      }
    } catch (error) {
      console.log(error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchuser();
  }, []);
 

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
            <div className="col-9">
              <div className="profile-box-main p-5">
                <div className="profile-box-img-maon">
                  <img
                    src="../../user.jpg"
                    className="me-3"
                    style={{ width: "50px" }}
                    alt="Profile"
                  />
                  <span className="main-text fw-600">{username || "John Duo"}</span>
                </div>
                <div className="profile-main-form mt-4">
                  <form className="d-flex" onSubmit={handleSubmit}>
                    <div className="col-12 col-lg-6 me-2">
                      <div className="pro-main-form-inner mt-3 d-flex flex-column">
                        <label className="main-text fw-500">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={username}
                          onChange={(e) => setusername(e.target.value)}
                        />
                      </div>
                      <div className="pro-main-form-inner d-flex flex-column">
                        <label className="main-text mt-3 fw-500">Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          value={mobileNumber}
                          onChange={(e) => setmobilenumber(e.target.value)}
                        />
                      </div>
                      <div className="pro-main-form-inner d-flex flex-column">
                        <label className="main-text mt-3 fw-500">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setemail(e.target.value)}
                        />
                      </div>
                      <div className="pro-main-form-inner mt-4 d-flex flex-column">
                        <button
                          type="submit"
                          className="form-control main-bg text-white"
                          disabled={loading}
                        >
                          {loading ? 'Updating...' : 'Update'}
                        </button>
                      </div>
                    </div>
                  </form>
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

export default Profileshow;
