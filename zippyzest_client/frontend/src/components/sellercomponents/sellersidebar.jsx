import "../../styles/style.css";
import "../../styles/sellerstyle.css";
import { Link, useNavigate } from "react-router-dom";
import { FaRegDotCircle } from "react-icons/fa";
import axios from "axios";
const SellerSidebar = () => {
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
    <div className="sidebar main-bg-sidebar w-100">
      <div className="logo">
        <img src="../../TM.png"className="w-100 h-100" alt="Logo" />
      </div>
      <div className="sidebar-menu">
        <ul className="m-1 p-2">
          <li className="d-flex align-items-center py-2">
            <FaRegDotCircle className="main-white me-3" />
            <Link className="main-white" to={"/seller"}>
              Dashboard
            </Link>
          </li>
          <li className="d-flex align-items-center py-2">
            <FaRegDotCircle className="main-white me-3" />
            <Link className="main-white" to={"/seller/showorder"}>
              Orders
            </Link>
          </li>
          <li className="d-flex align-items-center py-2">
            <FaRegDotCircle className="main-white me-3" />
            <Link className="main-white" to={"/seller/addctegory"}>
              Add Category
            </Link>
          </li>
          <li className="d-flex align-items-center py-2">
            <FaRegDotCircle className="main-white me-3" />
            <Link className="main-white" to={"/seller/addsubcategory"}>
              Add SubCategory
            </Link>
          </li>
          <li className="d-flex align-items-center py-2">
            <FaRegDotCircle className="main-white me-3" />
            <Link className="main-white" to={"/seller/addproduct"}>
              Add product
            </Link>
          </li>
          <li className="d-flex align-items-center  py-2">
            <FaRegDotCircle className="main-white me-3" />
            <Link className="main-white" to={"/seller/showcategory"}>
              Categories
            </Link>
          </li>
          <li className="d-flex align-items-center py-2">
            <FaRegDotCircle className="main-white me-3" />
            <Link className="main-white" to={"/seller/showsubcategory"}>
              Subcategories
            </Link>
          </li>
          <li className="d-flex align-items-center py-2">
            <FaRegDotCircle className="main-white me-3" />
            <Link className="main-white" to={"/seller/showproduct"}>
              Products
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

export default SellerSidebar;
