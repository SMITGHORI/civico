import "../styles/style.css";
import "../styles/footer.css";
import { IoLocationOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";
import { MdOutlineFacebook } from "react-icons/md";
import { FaTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaDribbble } from "react-icons/fa6";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div>
      <section className="pt-70 pb-70">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 d-flex flex-column  align-items-center d-lg-block mt-5 col-md-3 px-5">
              <div
                className="footer-logo "
                style={{ width: "200px", height: "130px" }}
              >
                <Link to={"/"}>
                  <img
                    src="../../TM.png"
                    className="w-100 h-100"
                    alt="logo"
                  />
                </Link>
              </div>
              <div className="footer-p">
                <p className="green-text">
                  Shopping on products to crores of customers on Civico at 0%
                  commission
                </p>
              </div>
              <div className="add-to-cart-btn d-flex mt-4 pb-3">
                <a href="#cate" className="px-5 py-2">
                  <span>Shop Now</span>
                </a>
              </div>
            </div>
            <div className="col-6 mt-5 col-md-3 d-flex flex-column align-items-center">
              <div className="company-name me-5">
                <h4 className="">Company</h4>
              </div>
              <div className="company-ul">
                <ul className="p-0">
                  <li className="py-1">
                    <Link className="main-text">About Us</Link>
                  </li>
                  <li className="py-1">
                    <Link className="main-text">Delivery Information</Link>
                  </li>
                  <li className="py-1">
                    <Link className="main-text">Privacy Policy</Link>
                  </li>
                  <li className="py-1">
                    <Link className="main-text">Terms And Condition</Link>
                  </li>
                  <li className="py-1">
                    <Link className="main-text">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-6 mt-5 col-md-3 d-flex flex-column align-items-center">
              <div className="company-name me-2">
                <h4 className="">Pages</h4>
              </div>
              <div className="company-ul">
                <ul className="p-0">
                  <li className="py-1">
                    <Link className="main-text">Sign In</Link>
                  </li>
                  <li className="py-1">
                    <Link className="main-text">Sign Up</Link>
                  </li>
                  <li className="py-1">
                    <Link className="main-text">Cart</Link>
                  </li>
                  <li className="py-1">
                    <Link className="main-text">My Wishlist</Link>
                  </li>
                  <li className="py-1">
                    <Link className="main-text">Contact</Link>
                  </li>
                  <li className="py-1">
                    <Link className="main-text">About</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-6  mt-5 col-md-3 d-flex flex-column align-items-center">
              <div className="company-name">
                <h4 className="">Social Media</h4>
              </div>
              <div className="company-ul mt-3">
                <ul className="p-0 d-flex">
                  <li className="px-1">
                    <a className="main-text" href="">
                      <MdOutlineFacebook className="fs-20" />
                    </a>
                  </li>
                  <li className="px-1">
                    <a className="main-text">
                      <FaTwitter className="fs-20" />
                    </a>
                  </li>
                  <li className="px-1">
                    <a className="main-text" href="https://www.instagram.com/zippy_zest_/">
                      <FaInstagram className="fs-20" />
                    </a>
                  </li>
                  <li className="px-1">
                    <Link className="main-text">
                      <FaLinkedinIn className="fs-20" />
                    </Link>
                  </li>
                  <li className="px-1">
                    <Link className="main-text">
                      <FaDribbble className="fs-20" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
