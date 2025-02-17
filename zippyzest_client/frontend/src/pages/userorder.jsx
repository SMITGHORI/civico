import Navbar from "../components/navbar";
import Topheader from "../components/topheader";
import Footer from "../components/footer";
import Profilesidebar from "../components/profilesidebar";
import "../styles/style.css";
import "../styles/profile.css";
import { useEffect, useState } from "react";
import axios from "axios";

const UserOrder = () => {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [mobileNumber, setmobilenumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setorder] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
  const apiurl = import.meta.env.VITE_API_URL
  // Fetch user details from the server 
  const fetchuser = async () => {
    try {
      let res = await axios.get(`${apiurl}/auth/getuser`, { withCredentials: true });
      if (res.data.success) {
        setusername(res.data.user.username);
        setemail(res.data.user.email);
        setmobilenumber(res.data.user.mobileNumber);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch orders from the server
  const fetchorder = async () => {
    try {
      let res = await axios.get(`${apiurl}/order/getorder`, { withCredentials: true });
      if (res.data.success) {
        console.log(res.data.orders);
        
        setorder(res.data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchuser();
    fetchorder();
  }, []);

  // Filter orders based on the search term
  const filteredOrders = order.filter(orderItem =>
    orderItem.items.some(item =>
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
              <div className="order-table mt-5">
              <h2 className="mb-3">Orders</h2>
                <div className="input-search-order mb-3">
                  <input
                    type="search"
                    placeholder="Search Order"
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {filteredOrders.length > 0 ? (
  filteredOrders.map((orderItem) => (
    <div
      key={orderItem._id}
      className="order-container mt-3 p-3"
      style={{
        border: "1px solid #e5ddd9",
        backgroundColor: "#fff",
        borderRadius: "8px",
      }}
    >
      <h5 className="mb-3">Order ID: {orderItem._id}</h5>
      <div className="order-items-container">
        {orderItem.items.map((item) => (
          <div
            key={item.product._id}
            className="order-item d-flex align-items-center mb-3"
            style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}
          >
            <div className="order-img col-2 text-center">
              <img
                src={`${item.product.image}`} 
                alt={item.product.name}
                className="w-100"
                style={{ maxWidth: "80px", borderRadius: "5px" }}
              />
            </div>
            <div className="order-name col-4">
              <strong>{item.product.name}</strong>
            </div>
            <div className="order-price col-2">
              <span>₹{item.price}</span>
            </div>
            <div className="order-quantity col-2">
              <span>Qty: {item.quantity}</span>
            </div>
            <div className="order-status col-2">
              <button className="btn btn-sm btn-primary">{orderItem.status}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ))
) : (
  <p>No orders found.</p>
)}

              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default UserOrder;
