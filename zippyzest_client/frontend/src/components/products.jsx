  import "../styles/style.css";
  import "../styles/products.css";
  import { Link, useNavigate } from 'react-router-dom';
  import { GrCart } from "react-icons/gr";
  import { useEffect, useState, useRef } from "react";
  import axios from 'axios';
  import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

  const Products = () => {
    const [categories, setCategories] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const scrollRefs = useRef({});
    const [isScrollable, setIsScrollable] = useState({});
    const [hasScrolledRight, setHasScrolledRight] = useState({}); // New state to track scroll position
    const productBoxWidth = 250; // Adjust based on your CSS
    const apiurl = import.meta.env.VITE_API_URL
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiurl}/product/products`, {
          withCredentials: true
        });
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching products", error);
        setError("Error fetching products");
      }
    };

    useEffect(() => {
      fetchProducts();
    }, []);

    const checkIfScrollable = () => {
      const updatedIsScrollable = {};
      Object.keys(categories).forEach((category) => {
        const scrollRow = scrollRefs.current[category];
        if (scrollRow) {
          updatedIsScrollable[category] = scrollRow.scrollWidth > scrollRow.clientWidth;
        }
      });
      setIsScrollable(updatedIsScrollable);
    };

    useEffect(() => {
      if (Object.keys(categories).length) {
        checkIfScrollable();
        window.addEventListener('resize', checkIfScrollable);
      }

      return () => {
        window.removeEventListener('resize', checkIfScrollable);
      };
    }, [categories]);

    const handleCart = async(id, price) => {
      let obj = {
        productId: id,
        price: price
      };
      try {
        let response = await axios.post(`${apiurl}/cart/addcart`, obj, {withCredentials: true});
        if (response.data.success) {
          alert("Product Added to Cart");
        }
      } catch (error) {
        if (error.response.data.message === "You need to log in to access this resource.") {
          alert("Please Login to add product to cart");
          navigate('/signup');
        }
        console.error(error);
      }
    };

    const handleScroll = (category, direction) => {
      const scrollRow = scrollRefs.current[category];
      const scrollAmount = productBoxWidth + 20; // Product width + margin
      if (direction === 'left') {
        scrollRow.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        // Reset scrolled status when scrolling left
        setHasScrolledRight(prev => ({ ...prev, [category]: false }));
      } else {
        scrollRow.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        // Set scrolled status when scrolling right
        setHasScrolledRight(prev => ({ ...prev, [category]: true }));
      }
    };

    const handleViewAll = (categoryId) => {
      navigate(`/products/viewallproduct/${categoryId}`);
    };

    return (
      <section className="pt-70">
        <div className="container">
          {error && <p>{error}</p>}
          {Object.keys(categories).map((category) => (
            <div key={category}>
              <div className="title-section mt-4 d-flex justify-content-between align-items-center position-relative">
                <h4>{category}</h4>
                {isScrollable[category] && (
                  <div className="arrow-buttons me-3">
                    {hasScrolledRight[category] && ( // Show left arrow if scrolled right
                      <button className="arrow-left" onClick={() => handleScroll(category, 'left')}><FaArrowLeft /></button>
                    )}
                    {isScrollable[category] && ( // Always show right arrow if scrollable
                      <button className="arrow-right" onClick={() => handleScroll(category, 'right')}><FaArrowRight /></button>
                    )}
                  </div>
                )}
                <div className="category-actions d-flex align-items-center">
                  {isScrollable[category] && (
                    <div className="view-all-container">
                      <button className="view-all-btn" onClick={() => handleViewAll(categories[category][0].category._id)}>View All<span className="arrow-icon">→</span></button>
                    </div>
                  )}
                </div>
              </div>
              <div className="product-row mt-4" style={{height:"300px", overflowY: "auto",overflowx: "hidden"}} ref={el => scrollRefs.current[category] = el}>
                {categories[category].map((product) => (
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
                          <Link onClick={() => handleCart(product._id, product.price)} className="px-2">
                            <GrCart className="me-1" /><span>Add</span>
                          </Link>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  export default Products;
