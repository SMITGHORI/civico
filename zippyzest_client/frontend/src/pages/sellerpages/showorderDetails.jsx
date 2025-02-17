import { useEffect, useState } from "react";
import SellerSidebar from "../../components/sellercomponents/sellersidebar";
import "../../styles/style.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const ShowOrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState(null); // Store order details
  const { id } = useParams(); // Get order ID from URL
  const apiurl = import.meta.env.VITE_API_URL
  // Fetch details of a specific order
  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `${apiurl}/seller/getorderdetails?id=${id}`, // Pass order ID
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log(response.data.order);
        
        setOrderDetails(response.data.order); // Set the fetched order details
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    fetchOrderDetails(); // Fetch order details when component loads
  }, [id]);

  // Check if order details are not available yet
  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  const { items, shippingAddress, user, totalAmount, status, isCOD } = orderDetails;

  return (
    <div>
      <div className="d-flex">
        <div className="col-2">
          <SellerSidebar />
        </div>
        <div className="col-10">
          <div className="main-bg-admin p-5 h-100">
            <h3 className="fs-24 p-2">Order Details</h3>
            <div className="side-box-admin">
              <div className="order-detail-box-img-main d-flex p-2 justify-content-center" style={{border : "1px solid #e5ddd9", width:"20%"}}>
                {/* Assuming the first item in the array has a product image */}
                <img src={`http://localhost:3000/uploads/${items[0].product.image}`} width={100} alt={items[0].product.name} />
              </div>

              {/* Displaying Order Details */}
              <div className="order-detail-box-text-main mt-3">
                <span className="color-secondary">OrderId : {orderDetails._id}</span>
              </div>

              {items.map((item, index) => (
                <div key={index}>
                  <div className="order-detail-box-name-main mt-3">
                    <span className="main-text fs-20 me-2 fw-500">Item : </span>
                    <span className="color-secondary">{item.product.name}</span>
                  </div>
                  <div className="order-detail-box-Address-main mt-3">
                    <span className="main-text fs-20 me-2 fw-500">Price : </span>
                    <span className="color-secondary">${item.price}</span>
                  </div>
                  <div className="order-detail-box-Address-main mt-3">
                    <span className="main-text fs-20 me-2 fw-500">Qty : </span>
                    <span className="color-secondary">{item.quantity}</span>
                  </div>
                  <div className="order-detail-box-Address-main mt-3">
                    <span className="main-text fs-20 me-2 fw-500">Unit : </span>
                    <span className="color-secondary">{item.product.productUnit}</span>
                  </div>
                </div>
              ))}

              {/* Shipping and Billing Details */}
              <div className="order-detail-box-Address-main mt-3">
                <span className="main-text fs-20 me-2 fw-500">Address 1 : </span>
                <span className="color-secondary">{shippingAddress.addressLine1}</span>
              </div>
              <div className="order-detail-box-Address-main mt-3">
                <span className="main-text fs-20 me-2 fw-500">Address 2 : </span>
                <span className="color-secondary">{shippingAddress.addressLine2}</span>
              </div>
              <div className="order-detail-box-Address-main mt-3">
                <span className="main-text fs-20 me-2 fw-500">City : </span>
                <span className="color-secondary">{shippingAddress.city}</span>
              </div>
              <div className="order-detail-box-Address-main mt-3">
                <span className="main-text fs-20 me-2 fw-500">State : </span>
                <span className="color-secondary">{shippingAddress.state}</span>
              </div>
              <div className="order-detail-box-Address-main mt-3">
                <span className="main-text fs-20 me-2 fw-500">Postal Code : </span>
                <span className="color-secondary">{shippingAddress.postalCode}</span>
              </div>

              {/* Displaying User Information */}
              <div className="order-detail-box-Address-main mt-3">
                <span className="main-text fs-20 me-2 fw-500">Mobile Number : </span>
                <span className="color-secondary">{user.mobileNumber}</span>
              </div>
              <div className="order-detail-box-Address-main mt-3">
                <span className="main-text fs-20 me-2 fw-500">Email : </span>
                <span className="color-secondary">{user.email}</span>
              </div>

              {/* Order Summary */}
              <div className="order-detail-box-Address-main mt-3">
                <span className="main-text fs-20 me-2 fw-500">Total Amount : </span>
                <span className="color-secondary">${totalAmount}</span>
              </div>
              <div className="order-detail-box-Address-main mt-3">
                <span className="main-text fs-20 me-2 fw-500">Payment Status : </span>
                <span className="color-secondary">{orderDetails.paymentStatus}</span>
              </div>
              <div className="order-detail-box-Address-main mt-3">
                <span className="main-text fs-20 me-2 fw-500">Order Status : </span>
                <span className="color-secondary">{status}</span>
              </div>
              <div className="order-detail-box-Address-main mt-3">
                <span className="main-text fs-20 me-2 fw-500">Is COD : </span>
                <span className="color-secondary">{isCOD ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowOrderDetails;
