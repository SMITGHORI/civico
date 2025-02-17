import Navbar from "../components/navbar";
import Topheader from "../components/topheader";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
const Checkout = () => {
  const [username, setUsername] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Online Payment");
  const [cart, setCart] = useState({ cartitems: [], totalPrice: 0 });
  const [count, setCount] = useState({});
  const [isCOD, setIsCOD] = useState(false); // For Cash on Delivery
  const [qr,setqr] = useState("")
  const [user, setUser] = useState();
const navigate = useNavigate()
const apiurl = import.meta.env.VITE_API_URL
const FetchUser = async () => {
  try {
    let res = await axios.get(`${apiurl}/auth/getuser`, {
      withCredentials: true,
    });
    if (res.data.success) {
      setUser(res.data.user);
      setUsername(res.data.user.username || "");
      setMobileNumber(res.data.user.mobileNumber || "");
      setEmail(res.data.user.email || "");
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
        { quantity, price: cart.cartitems.find(item => item._id === id).price },
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
    setCount(prevCount => {
      const newCount = prevCount[id] + 1;
      updateCartItem(id, newCount);
      return { ...prevCount, [id]: newCount };
    });
  };

  const decrement = (id) => {
    setCount(prevCount => {
      if (prevCount[id] > 1) {
        const newCount = prevCount[id] - 1;
        updateCartItem(id, newCount);
        return { ...prevCount, [id]: newCount };
      }
      return prevCount;
    });
  };
  useEffect(() => {
    FetchCart();
    FetchUser()
  },[]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!username || !mobileNumber || !email || !addressLine1 || !city || !state || !postalCode || !country) {
      alert("Please fill out all required fields.");
      return; // Prevent form submission
    }
    const shippingAddress = {
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
    };

    try {
      const response = await axios.post(
        `${apiurl}/order/create-order`,
        {
          shippingAddress,
          paymentMethod,
          isCOD,
        },
        { withCredentials: true }
      );
      console.log(response.data);
      
      if (response.data.success) {
        alert("Order placed successfully!");
        setqr(response.data.qrCode)
        
        
        // Redirect to success or order summary page
      } else {
        alert("Order placement failed!");
      }
    } catch (error) {
      console.log(error);
      alert("There was an error placing the order.");
    }
  };
  const removeFromCart = async (id) => {
    try {
      const response = await axios.get(`${apiurl}/cart/deletecart?id=${id}`,{ withCredentials: true });
      if (response.data.success) {
        setCart(response.data.cart); // Update the cart after successful removal
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Navbar />
      <section className="mt-5">
        <div className="container">
          <div className="row">
            <div className="col-6">
              <div className="title-check">
                <h4>Billing Details</h4>
              </div>
              <div
                className="order-box-check p-3"
                style={{ border: "1px solid #e5ddd9", borderRadius: "8px" }}
              >
                <form className="" onSubmit={handlePlaceOrder}>
                  <div className="col-9">
                    <div className="bill-input  d-flex flex-column mt-3">
                      <label>Name</label>
                      <input
                        type="text"
                        className="form-control mt-2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="bill-input d-flex flex-column mt-3">
                      <label>Phone</label>
                      <input
                        type="text"
                        className="form-control mt-2"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                      />
                    </div>
                    <div className="bill-input d-flex flex-column mt-3">
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-control mt-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="bill-input d-flex flex-column mt-3">
                      <label>Address Line 1</label>
                      <textarea
                        className="form-control mt-2"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                      />
                    </div>
                    <div className="bill-input d-flex flex-column mt-3">
                      <label>Address Line 2</label>
                      <textarea
                        className="form-control mt-2"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bill-input d-flex flex-column mt-3">
                      <label>City</label>
                      <input
                        type="text"
                        className="form-control  mt-2"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="bill-input d-flex flex-column mt-3">
                      <label>State</label>
                      <input
                        type="text"
                        className="form-control mt-2"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>
                    <div className="bill-input d-flex flex-column mt-3">
                      <label>Postal Code</label>
                      <input
                        type="text"
                        className="form-control mt-2"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </div>
                    <div className="bill-input d-flex flex-column mt-3">
                      <label>Country</label>
                      <input
                        type="text"
                        className="form-control mt-2"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </div>
                    <div className="bill-input d-flex flex-column mt-3">
                      <label>Payment Methods</label>
                      <div className="mt-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            value="Online Payment"
                            checked={paymentMethod === "Online Payment"}
                            onChange={() => setPaymentMethod("Online Payment")}
                          />
                          <label className="form-check-label">
                            Online Payment
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            value="Cash On Delivery"
                            onChange={() => {
                              setPaymentMethod("Cash On Delivery");
                              setIsCOD(true); // Set COD flag
                            }}
                          />
                          <label className="form-check-label">
                            Cash On Delivery
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn main-bg text-white fw-600 mt-5">
                    Place Order ₹{cart.totalPrice + 10}
                  </button>
                </form>
              </div>
            </div>
            <div className="col-6">
              <div className="title-check">
                <h4>Order Summary</h4>
              </div>
              <div
                className="order-box-check p-3"
                style={{ border: "1px solid #e5ddd9", borderRadius: "8px" }}
              >
                <div className="summary-box">
                {cart.cartitems.map((item) => (
                <div className="product-items-cart align-items-center d-flex justify-content-between mt-4" key={item._id}>
                  <div className="col-3 d-flex justify-content-center">
                    <div
                      className="img-cart d-flex justify-content-center"
                      style={{ border: "1px solid #e5ddd9" }}
                    >
                      <img src={`${item.productId.image}?t=${new Date().getTime()}`} className="w-100" alt={item.productId.name} />
                    </div>
                  </div>
                  <div className="col-4 d-flex justify-content-center">
                    <div className="cart-name d-flex flex-column">
                      <span className="main-text fw-600">{item.productId.name}</span>
                      <span className="color-secondary">{count[item._id]} kg</span>
                      <span className="main-text fw-600"> ₹{item.price}</span>
                      <del className="color-secondary"></del>
                    </div>
                  </div>
                  <div className="col-3 d-flex">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <button onClick={() => decrement(item._id)} className="btn main-bg text-white px-3">
                        -
                      </button>
                      <span>{count[item._id]}</span>
                      <button onClick={() => increment(item._id)} className="btn main-bg text-white">
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-1 d-flex">
                    <div style={{ display: "flex", alignItems: "center",  }}>
                      <button  onClick={() => removeFromCart(item._id)} className="btn btn-danger text-white">
                      <FaTrash />
                      </button>
                      
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
                    <span className="main-text fw-500 ms-2">₹{cart.totalPrice}</span>
                  </div>
                </div>
                <div className="items-cart-bill d-flex justify-content-between pb-3" style={{ borderBottom: "1px solid #e5ddd9" }}>
                  <div className="main-cart-name main-text fw-500">
                    <span className="fs-16">Delivery Charge</span>
                  </div>
                  <div className="main-cart-price">
                    <span className="main-text fw-500 ms-2">₹10</span>
                  </div>
                </div>
                <div className="items-cart-bill d-flex justify-content-between mt-5">
                  <div className="main-cart-name main-text fw-500">
                    <span className="fs-16">Total Price</span>
                  </div>
                  <div className="main-cart-price">
                    <span className="green-text fw-600 ms-2">₹{cart.totalPrice + 10}</span>
                  </div>
                </div>
              </div>
              <div className="proceed-order mt-3">
                
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <img src={qr} alt="" />
      </section>
      <Footer />
    </div>
  );
};

export default Checkout;
