import { HiShoppingCart } from "react-icons/hi";
import "../styles/style.css";
import "../styles/navbar.css";
import { Link } from "react-router-dom";
import { GrCart } from "react-icons/gr";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaShoppingBag, FaTrash, FaUser } from "react-icons/fa";
import { IoMdList } from "react-icons/io";

const Navbar = () => {
  const [user, setUser] = useState();
  const [cart, setCart] = useState({ cartitems: [], totalPrice: 0 });
  const [count, setCount] = useState({});
  const apiurl = import.meta.env.VITE_API_URL;
  const FetchUser = async () => {
    try {
      let res = await axios.get(`${apiurl}/auth/getuser`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const FetchCart = async () => {
    try {
      const response = await axios.get(`${apiurl}/cart/getcart`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setCart(response.data.cart);
        console.log(response.data.cart);
        
        const initialCount = {};
        response.data.cart.cartitems.forEach((item) => {
          initialCount[item._id] = item.quantity;
        });
        setCount(initialCount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateCartItem = async (id, quantity) => {
    try {
      const response = await axios.post(
        `${apiurl}/cart/updatecart?id=${id}`,
        {
          quantity,
          price: cart.cartitems.find((item) => item._id === id).price,
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        setCart(response.data.cart);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const increment = (id) => {
    setCount((prevCount) => {
      const newCount = prevCount[id] + 1;
      updateCartItem(id, newCount);
      return { ...prevCount, [id]: newCount };
    });
  };

  const decrement = (id) => {
    setCount((prevCount) => {
      if (prevCount[id] > 1) {
        const newCount = prevCount[id] - 1;
        updateCartItem(id, newCount);
        return { ...prevCount, [id]: newCount };
      }
      return prevCount;
    });
  };
  const removeFromCart = async (id) => {
    try {
      const response = await axios.get(`${apiurl}/cart/deletecart?id=${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setCart(response.data.cart); // Update the cart after successful removal
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    FetchUser();
    FetchCart();
  }, []); // Added empty dependency array to prevent infinite re-renders

  return (
    <div>
       <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand d-flex align-items-center" href="#"style={{ height: "100px", overflow: "hidden" }}>
          <img
            src="../../TM.png"
            className="logo h-100 w-100"
            alt="logo"
          />
        </a>

        {/* Toggle Button for Mobile View */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Navigation Links */}
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
    <ul className="navbar-nav">
      {[
        { name: "Home", link: "/" },
        {
          name: "Product",
          dropdown: true,
          items: [
            { name: "Electronics", link: "/electronics" },
            { name: "Clothing", link: "/clothing" },
          ],
        },
        { name: "Shop", link: "/shop" },
        {
          name: "Blog",
          dropdown: true,
          items: [
            { name: "Latest Posts", link: "/latest" },
            { name: "Trending", link: "/trending" },
          ],
        },
        { name: "Contact", link: "/contact" },
      ].map((item) => (
        <li className="nav-item pe-4" key={item.name}>
          {item.dropdown ? (
            <div className="dropdown">
              <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                {item.name}
              </a>
              <ul className="dropdown-menu">
                {item.items.map((subItem) => (
                  <li key={subItem.name}>
                    <a className="dropdown-item" href={subItem.link}>
                      {subItem.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <a className="nav-link" href={item.link}>
              {item.name}
            </a>
          )}
        </li>
      ))}
    </ul>
  </div>


        {/* Icons Section */}
        <div className="d-flex align-items-center">
          {/* Search Icon */}
          <FaSearch className="nav-icon mx-2" />

          {/* User Profile/Login */}
          {/* {user ? (
            <div className="dropdown">
              <button
                className="btn border-0 dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img src="../../user.jpg"  alt="profile" className="profile-img" style={{height:"50px"}} />
              </button>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                <li><button className="dropdown-item">Logout</button></li>
              </ul>
            </div>
          ) : (
            <Link to="/signup" className="ms-3 btn main-bg-secondary text-white">
              Login
            </Link>
          )} */}

          {/* Cart Button */}
          <button
            className="btn main-bg text-white ms-3 d-flex align-items-center"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight"
          >
            <GrCart className="me-1" />
            <span>Cart</span>
          </button>
        </div>
      </div>
    </nav>
    <div
            className="offcanvas offcanvas-end"
            tabIndex={-1}
            id="offcanvasRight"
            aria-labelledby="offcanvasRightLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasRightLabel">
                Cart
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
            <div className="offcanvas-body px-3">
              {cart.cartitems.map((item) => (
                <div
                  className="product-items-cart mt-4 d-flex justify-content-between"
                  key={item._id}
                >
                  <div className="col-4 d-flex justify-content-center">
                    <div
                      className="img-cart d-flex justify-content-center"
                      style={{ border: "1px solid #e5ddd9" }}
                    >
                      <img
                        src={`${
                          item.productId.image
                        }?t=${new Date().getTime()}`}
                        className="w-100"
                        alt={item.productId.name}
                      />
                    </div>
                  </div>
                  <div className="col-7 d-flex flex-column justify-content-center">
                    <div className="cart-name d-flex flex-column">
                      <span className="main-text fw-600">
                        {item.productId.name}
                      </span>
                      
                      <span className="main-text fw-600 mt-4"> ₹{item.price}</span>
                      <del className="color-secondary"></del>
                    </div>
                    <div className="cart-quantity mt-4 d-flex">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() => decrement(item._id)}
                        className="btn main-bg text-white px-3"
                      >
                        -
                      </button>
                      <span>{count[item._id]}</span>
                      <button
                        onClick={() => increment(item._id)}
                        className="btn main-bg text-white"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="btn btn-danger text-white"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  </div>
                  
                </div>
              ))}
              <div className="bill-details-cart mt-4">
                <h1 className="fs-20">Bill Details</h1>
                <div className="items-cart-bill d-flex justify-content-between">
                  <div className="main-cart-name main-text fw-500">
                    <span>Item Price</span>
                  </div>
                  <div className="main-cart-price">
                    <span className="main-text fw-500 ms-2">
                      ₹{cart.totalPrice}
                    </span>
                  </div>
                </div>
                <div
                  className="items-cart-bill d-flex justify-content-between pb-3"
                  style={{ borderBottom: "1px solid #e5ddd9" }}
                >
                 
                </div>
                <div className="items-cart-bill d-flex justify-content-between mt-5">
                  <div className="main-cart-name main-text fw-500">
                    <span className="fs-16">Total Price</span>
                  </div>
                  <div className="main-cart-price">
                    <span className="green-text fw-600 ms-2">
                      ₹{cart.totalPrice}
                    </span>
                  </div>
                </div>
              </div>
              <div className="proceed-order mt-3">
                <Link
                  to={"/checkout"}
                  className="btn main-bg text-white fw-600"
                >
                  Place Order ₹{cart.totalPrice + 10}
                </Link>
              </div>
            </div>
          </div>
     
    </div>
  );
};

export default Navbar;
