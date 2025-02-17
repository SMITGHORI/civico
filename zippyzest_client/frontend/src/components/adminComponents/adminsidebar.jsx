import "../../styles/style.css";
import "../../styles/sellerstyle.css";
import { Link, useNavigate } from "react-router-dom";
import { FaRegDotCircle } from "react-icons/fa";
import axios from "axios";
const Adminsidebar = () => {
  const navigate = useNavigate();
  const apiurl = import.meta.env.VITE_API_URL
  const handlelogout = async (e) => {
    e.preventDefault();
    try {
      const Response = await axios.get(`${apiurl}/seller/logout`, {
        withCredentials: true,
      });
      if (Response.data.success) {
        alert("Logout Succesfully");
        navigate("/sellerlogin");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="sidebar main-bg-sidebar   w-100">
      <div className="logo p-4">
        <img src="../../Zippy zest  png.png" alt="Logo" />
      </div>
      <div className="sidebar-menu pt-5">
        <ul className="m-1 p-2">
          <li className="d-flex align-items-center py-2">
            <FaRegDotCircle className="main-white me-3" />
            <Link className="main-white" to={"/admin/adminhome"}>
              Dashboard
            </Link>
          </li>
          <li className="d-flex align-items-center py-2">
            <FaRegDotCircle className="main-white me-3" />
            <Link className="main-white" to={"/admin/TotalUserAdmin"}>
              Users
            </Link>
          </li>
          <li className="d-flex align-items-center py-2">
            <FaRegDotCircle className="main-white me-3" />
            <Link className="main-white" to={"/admin/TotalsellerAdmin"}>
              Sellers
            </Link>
          </li>
          
          <li className="d-flex align-items-center py-2">
            <FaRegDotCircle className="main-white me-3" />
            <Link className="main-white" onClick={handlelogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );    
};

export default Adminsidebar;
