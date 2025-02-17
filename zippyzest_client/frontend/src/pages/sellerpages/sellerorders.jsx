import { useEffect, useState } from "react";
import SellerSidebar from "../../components/sellercomponents/sellersidebar";
import "../../styles/style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const ShowOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]); // To track selected orders
  const [selectAll, setSelectAll] = useState(false); // To track 'Select All' state
  const navigate = useNavigate();
  const [downloadStatus, setDownloadStatus] = useState({});
  const [activeTab, setActiveTab] = useState("On Hold");
  const apiurl = import.meta.env.VITE_API_URL
  // Function to fetch seller's orders
  const FetchOrder = async () => {
    try {
      const response = await axios.get(
        `${apiurl}/seller/getorderforseller`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log(response.data.orders);
        
        setOrders(response.data.orders); // Set the fetched orders
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Function to fetch download status for a specific order
  const fetchstatus = async (orderId) => {
    try {
      let res = await axios.post(
        `${apiurl}/order/showstatus?id=${orderId}`
      );
      setDownloadStatus((prevStatus) => ({
        ...prevStatus,
        [orderId]: res.data.orderIds, // Track download status per order
      }));
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    FetchOrder();
  }, []);

  // Fetch download status whenever orders change
  useEffect(() => {
    if (orders.length > 0) {
      orders.forEach((order) => {
        fetchstatus(order._id);
      });
    }
  }, [orders]); // Added [orders] dependency to run only when orders change

  // Function to count orders by status
  const getStatusCount = (status) => {
    return orders.filter((order) => order.status === status).length;
  };

  // Handle Accept Action with Confirmation
  const handleAccept = async (orderId) => {
    const confirmAccept = window.confirm(
      "Are you sure you want to accept this order?"
    );
    if (!confirmAccept) return; // Exit if user cancels

    try {
      const response = await axios.post(
        `${apiurl}/order/updateorderstatus?id=${orderId}`,
        { status: "Ready to Ship" }, // Update status to "Ready to Ship"
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Update the orders state locally after successful status change
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, status: "Ready to Ship" }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Handle Pending Action with Confirmation
  const handlepending = async (orderId) => {
    const confirmPending = window.confirm(
      "Are you sure you want to set this order to Pending?"
    );
    if (!confirmPending) return; // Exit if user cancels

    try {
      const response = await axios.post(
        `${apiurl}/order/updateorderstatus?id=${orderId}`,
        { status: "Pending" }, // Update status to "Pending"
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Update the orders state locally after successful status change
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "Pending" } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Handle Cancel Action with Confirmation
  const handlecancel = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return; // Exit if user cancels

    try {
      const response = await axios.post(
        `${apiurl}/order/updateorderstatus?id=${orderId}`,
        { status: "Cancelled" }, // Update status to "Cancelled"
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Update the orders state locally after successful status change
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "Cancelled" } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Handle bulk status updates with confirmation
  const handleBulkUpdate = async (newStatus) => {
    const confirmBulk = window.confirm(
      `Are you sure you want to set selected orders to "${newStatus}"?`
    );
    if (!confirmBulk) return; // Exit if user cancels

    try {
      const response = await axios.post(
        `${apiurl}/order/updatebulkorderstatus`,
        {
          orderIds: selectedOrders,
          status: newStatus,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            selectedOrders.includes(order._id)
              ? { ...order, status: newStatus }
              : order
          )
        );
        setSelectedOrders([]);
      }
    } catch (error) {
      console.error(`Error updating orders to ${newStatus}:`, error);
    }
  };

  // Handle individual order selection
  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  };

  // Handle select all orders
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]); // Deselect all
    } else {
      setSelectedOrders(filteredOrders.map((order) => order._id)); // Select all orders
    }
    setSelectAll(!selectAll);
  };

  // Handle invoice download with status update
  const handleDownloadInvoice = async (orderId) => {
    window.open(`${apiurl}/order/genrateinvoice?id=${orderId}`);

    try {
      let res = await axios.post(
        `${apiurl}/order/showstatus?id=${orderId}`
      );
      setDownloadStatus((prevStatus) => ({
        ...prevStatus,
        [orderId]: res.data.orderIds, // Track download status per order
      }));
      console.log(downloadStatus);
    } catch (error) {
      console.log(error);
    }
  };

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => order.status === activeTab);

  return (
    <div>
      <div className="d-flex">
        <div className="col-2 main-bg-sidebar">
          <SellerSidebar />
        </div>
        <div className="col-10">
          <div className="main-bg-admin p-5 h-100">
            <h3 className="fs-24 p-2">Orders</h3>
            <div className="side-box-admin">
              <div className="order-status-tabs d-flex justify-content-between">
                <span
                  style={{ cursor: "pointer" }}
                  className={`tab ${activeTab === "Pending" ? "active" : ""}`}
                  onClick={() => setActiveTab("Pending")}
                >
                  Pending ({getStatusCount("Pending")})
                </span>
                <span
                  style={{ cursor: "pointer" }}
                  className={`tab ${
                    activeTab === "Ready to Ship" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("Ready to Ship")}
                >
                  Ready to Ship ({getStatusCount("Ready to Ship")})
                </span>
                <span
                  style={{ cursor: "pointer" }}
                  className={`tab ${activeTab === "Shipped" ? "active" : ""}`}
                  onClick={() => setActiveTab("Shipped")}
                >
                  Shipped ({getStatusCount("Shipped")})
                </span>
                <span
                  style={{ cursor: "pointer" }}
                  className={`tab ${
                    activeTab === "Cancelled" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("Cancelled")}
                >
                  Cancelled ({getStatusCount("Cancelled")})
                </span>
              </div>

              {/* Bulk Action Buttons for Pending Tab */}
              {activeTab === "Pending" && selectedOrders.length > 0 && (
                <div className="bulk-actions mt-3">
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleBulkUpdate("Ready to Ship")}
                  >
                    Accept Selected
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleBulkUpdate("Cancelled")}
                  >
                    Cancel Selected
                  </button>
                </div>
              )}

              {/* Orders Table */}
              <table className="table mt-4">
                <thead>
                  <tr>
                    {activeTab === "Pending" && (
                      <th scope="col">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                    )}
                    <th scope="col">Order Date</th>
                    <th scope="col">Order ID</th>
                    <th scope="col">Image</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Price</th>
                    <th scope="col">Unit</th>
                    <th scope="col">Payment Status</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) =>
                      order.items.map((item) => (
                        <tr key={item._id}>
                          {activeTab === "Pending" && (
                            <th scope="row">
                              <input
                                type="checkbox"
                                checked={selectedOrders.includes(order._id)}
                                onChange={() => handleSelectOrder(order._id)}
                              />
                            </th>
                          )}
                          <td>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td>{order._id}</td>
                          <td>
                            <img
                              src={`${item.product.image}`}
                              alt={item.product.name}
                              width="50"
                            />
                          </td>
                          <td>{item.product.name}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price}</td>
                          <td>{item.product.productUnit}</td>
                          <td>
                            {order.isCOD ? "COD" : "Online Payment"}
                          </td>
                          <td>{order.status}</td>
                          <td>
                            {order.status === "Ready to Ship" ? (
                              <div className="d-flex flex-column">
                                <button
                                  className="btn btn-info"
                                  onClick={() =>
                                    handleDownloadInvoice(order._id)
                                  }
                                >
                                  Invoice
                                </button>
                                <button
                                  className={`btn ${
                                    downloadStatus[order._id]
                                      ? "text-success"
                                      : "text-danger"
                                  } ms-2`}
                                >
                                  {downloadStatus[order._id]
                                    ? "Downloaded"
                                    : "Download"}
                                </button>
                                
                              </div>
                            ) : order.status === "Cancelled" ? (
                              <span>No Actions Available</span> // Display message for cancelled orders
                            ) : (
                              <>
                                <button
                                  className="btn btn-primary me-2"
                                  onClick={() => handleAccept(order._id)}
                                >
                                  Accept
                                </button>
                                <button
                                  className="btn btn-danger me-2 mt-2"
                                  onClick={() => handlecancel(order._id)}
                                >
                                  Cancel
                                </button>
                                
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center">
                        No orders found for this status.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowOrder;
