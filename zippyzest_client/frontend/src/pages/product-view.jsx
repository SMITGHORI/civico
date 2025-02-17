import { HiShoppingCart } from "react-icons/hi";
import "../styles/style.css";
import "../styles/productview.css";
import Topheader from "../components/topheader";
import Navbar from "../components/navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GrCart } from "react-icons/gr";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Footer from "../components/footer";
import BeatLoader from "react-spinners/BeatLoader";

const ProductView = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiurl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.post(
          `${apiurl}/product/getproductfromproduct?id=${id}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setProduct(response.data.products);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="loader-container d-flex justify-center align-center vh-100">
        <BeatLoader color={"#699c47"} size={15} />
      </div>
    );
  }

  return (
    <div className="main-container">
      <Navbar />
      <section className="product-section container py-5">
        {product ? (
          <div className="product-view row align-items-center">
            <div className="col-md-6 text-center">
              <img
                src={`${product.image}`}
                alt={product.name}
                className="product-image img-fluid rounded shadow"
              />
            </div>
            <div className="col-md-6">
              <h2 className="product-title">{product.name}</h2>
              <p className="product-category text-muted">Category: {product.category.name}</p>
              <p className="product-price text-success fw-bold fs-4">₹{product.price}</p>
              <del className="product-price fs-4">₹{product.productDiscountPrice}</del>

              {
                product.productThickness ? (
                  <div className="product-thickness mt-3 fs-20">
                    <p className="product-thickness text-muted">Thickness: {product.productThickness}</p>
                    </div>
                ) : ""
              }
             {
                product.productWeight ? (
                  <div className="product-thickness mt-3 fs-20">
                    <p className="product-thickness text-muted">Weight: {product.productWeight}</p>
                    </div>
                ) : ""
              }
              {
                product.productSize ? (
                  <div className="product-thickness mt-3 fs-20">
                    <p className="product-thickness text-muted">Size: {product.productSize} Feet</p>
                    </div>
                ) : ""
              }
              <p className="product-description text-muted">{product.description}</p>
              <button
                className="btn main-bg  text-white d-flex align-items-center"
                onClick={() => handleCart(product._id, product.price)}
              >
                <HiShoppingCart className="me-2" /> Add to Cart
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center">Product not found</p>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default ProductView;
