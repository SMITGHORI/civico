import React, { useEffect, useState } from "react";
import Topheader from "../components/topheader";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GrCart } from "react-icons/gr";
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
const SubcategoryProuct = () => {
  const { id } = useParams();
  const [products, setproducts] = useState([]);
  const [categories, setcategories] = useState();
  const navigate = useNavigate();
  const apiurl = import.meta.env.VITE_API_URL;
  const fetchsucategory = async () => {
    try {
      const Response = await axios.post(
        `${apiurl}/product/getproductbysubcategory?id=${id}`,
        { withCredentials: true }
      );

      console.log("API Response:", Response.data);

      if (Response.data.success) {
        const productData = Response.data.product;

        // Ensure productData is always an array
        setproducts(
          Array.isArray(productData)
            ? productData
            : productData
            ? [productData]
            : []
        );
      }
    } catch (error) {
      console.log(error);
      setproducts([]); // Handle errors by setting an empty array
    }
  };

  const fetchcates = async () => {
    try {
      const Response = await axios.get(`${apiurl}/category/all-category`, {
        withCredentials: true,
      });
      if (Response.data.success) {
        setcategories(Response.data.category);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchsucategory();
    fetchcates();
  }, [id]);
  const handleCart = async (id, price) => {
    let obj = {
      productId: id,
      price: price,
    };
    try {
      let Response = await axios.post(`${apiurl}/cart/addcart`, obj, {
        withCredentials: true,
      });
      console.log(Response.data.cart);
      if (Response.data.success) {
        alert("Product Added to Cart");
      }
    } catch (error) {
      if (
        error.response.data.message ==
        "You need to log in to access this resource."
      ) {
        alert("Please Login to add product to cart");
        navigate("/signup");
      }
      console.log(error);
    }
  };
  const [loading, setLoading] = useState(true);

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
      <div className="container">
        <div className="row mt-5">
          <div className="col-12 col-md-9">
            <div className="title-cate">
              <h2>Products</h2>
            </div>  
            <div className="row mt-4 ">
             <div className="col-3 d-flex">
             {products.map((product) => {
                return (
                  <div className="product-box" key={product._id}>
                    <Link to={`/productview/${product._id}`}>
                      <div className="product-img">
                        <img src={`${product.image}`} alt={product.name} />
                      </div>
                      <div className="product-name mt-2 d-flex justify-content-between mb-2">
                        <h5 className="main-text">{product.name}</h5>
                      </div>
                      <div className="product-part d-flex justify-content-between">
                        <div className="pro-price">
                          <p className="m-0 main-text">₹{product.price}</p>
                          <del>₹{product.productDiscountPrice}</del>
                        </div>
                        <div className="add-to-cart-btn d-flex">
                          <Link
                            onClick={() =>
                              handleCart(product._id, product.price)
                            }
                            className="px-2"
                          >
                            <GrCart className="me-1" />
                            <span>Add</span>
                          </Link>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
             </div>
              {/* {
                products && products.map((val,i)=>{
                    return(
            <div className="col-6 mt-4 col-md-3 col-lg-3" key={++i} >
              <Link to={`/productview/${val._id}`}>
                <div className="product-box">
                  <div className="product-img">
                    <img src={`${val.image}?t=${new Date().getTime()}`} alt="" />
                  </div>
                  <div className="product-name mt-2 d-flex justify-content-center mb-2">
                    <h5 className='main-text'>{val.name}</h5>
                    
                  </div>
                
                </div>
                </Link>
              </div>
                    )
                })
              } */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SubcategoryProuct;
