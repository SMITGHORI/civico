import Navbar from "../components/navbar";
import Topheader from "../components/topheader";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import "../styles/style.css";
import "../styles/profile.css";

const Profilesidebar = () => {
  return (
    <div className="col-12 col-lg-3">
      <div className="profile-box" style={{ backgroundColor: "#f7f7f7" }}>
        <div
          className="profile-img-dash d-flex justify-content-center"
          style={{ backgroundColor: "#f7f7f7" }}
        >
          <img src="../../user.jpg" className="" style={{ width: "50px" }} />
        </div>
        <div className="profile-img-name d-flex justify-content-center mt-3">
          <h4 className="text-dark fw-500">John Doe</h4>
        </div>
        <div className="profile-ul mt-5">
          <ul className="m-0 p-0 d-flex justify-content-center align-items-center flex-column">
            <li className="p-3 w-100" style={{ borderBottom: "1px solid #e5ddd9" }}>
              <Link to="/profile" className="text-dark" style={{ textDecoration: 'none' }}>
                Dashboard
              </Link>
            </li>
            <li className="p-3 w-100" style={{ borderBottom: "1px solid #e5ddd9" }}>
              <Link to="/proflieshow" className="text-dark" style={{ textDecoration: 'none' }}>
                Profile
              </Link>
            </li>
            <li className="p-3 w-100" style={{ borderBottom: "1px solid #e5ddd9" }}>
              <Link to="/showorderuser" className="text-dark" style={{ textDecoration: 'none' }}>
                Orders
              </Link>
            </li>
            <li className="p-3 w-100">
              <Link to="/logout" className="text-dark" style={{ textDecoration: 'none' }}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profilesidebar;
