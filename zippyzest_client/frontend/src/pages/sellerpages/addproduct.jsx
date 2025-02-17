import React, { useEffect, useState } from "react";
import SellerSidebar from "../../components/sellercomponents/sellersidebar";
import "../../styles/style.css"
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const Addproduct = () => {
  const [category, setCategory] = useState([]); // Keep track of categories
  const [subcategory, setsubCategory] = useState([]);
  const navigate = useNavigate(); // Categories state
  const [name, setProductName] = useState("");
  const [description, setProductDescription] = useState("");
  const [image, setProductImage] = useState(null);
  const [price, setProductPrice] = useState("");
  const [productDiscountPrice, setProductDiscountPrice] = useState("");
  const [productUnit, setProductUnit] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productweight, setproductweight] = useState("");
  const [productSize, setproductSize] = useState("");
  const [productThickness, setProductThickness] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productsubCategory, setProductsubCategory] = useState("");
  const [productKeyFeatures, setProductKeyFeatures] = useState("");
  const [manufacturerDetails, setManufacturerDetails] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const apiurl = import.meta.env.VITE_API_URL
  useEffect(() => {
    const GetCategory = async () => {
      try {
        const response = await axios.get(`${apiurl}/category/getsellercategory`, {
          withCredentials: true, 
        });
        if (response.data.success) {
          setCategory(response.data.categories);  // Set the categories in state
        }
      } catch (error) {
        console.log(error);
      }
    };
    const getsubcategory = async() => {
      try {
        const response = await axios.get(`${apiurl}/subcategory/getsellersubcategory`, {
          withCredentials: true, 
        });
        if (response.data.success) {
          setsubCategory(response.data.subcategories);  // Set the categories in state
        }
      } catch (error) {
        console.log(error);
      }
    }
    GetCategory();
    getsubcategory()
  }, []);
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
     
      
      const obj = {
        name,
        description,
        image,
        price,
        productDiscountPrice,
        productUnit,
        productQuantity,
        productStock,
        category : productCategory,
        subcategory:productsubCategory,
        productKeyFeatures,
        manufacturerDetails,
        returnPolicy,
        countryOfOrigin,
        productThickness,
        productSize,
        productweight
      }
      console.log(obj);
      
      const response = await axios.post(`${apiurl}/product/create-product`, obj,{withCredentials : true, headers: {
        'Content-Type': 'multipart/form-data'
      }} )
      if (response.data.success) {
        alert("Product added succesfully")
        // navigate('/showproduct')
        setErrorMessage("");
        setProductName("")
        setProductDescription("");
        setProductPrice("")
        setProductDiscountPrice("");
        setProductUnit("");
        setProductQuantity("");
        setProductStock("");
        setProductCategory("");
        setProductKeyFeatures("");
        setManufacturerDetails("");
        setReturnPolicy("");
        setCountryOfOrigin("");
        setProductImage("");
        setProductsubCategory("")
        } else {
          setErrorMessage(response.data.message);
        }
      
    } catch (error) {
      console.log(error);
      setErrorMessage()
    }
  }

  return (
    <div>
      <div className="d-flex">
        <div className="col-2 main-bg-sidebar">
          <SellerSidebar />
        </div>
        <div className="col-10">
          <div className="main-bg-admin p-5 h-100">
            <h3 className="fs-24 p-2">Add Product</h3>
            <div className="side-box-admin">
              <form className="form-admin d-flex" onSubmit={handleSubmit}>
                <div className="col-5 d-flex flex-column">
                  <label className="fw-500 me-2">Product Name</label>
                  <input
                    type="text"
                    className="p-1 mt-1"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setProductName(e.target.value)}
                  />

                  <label className="fw-500 me-2 mt-2">Product Description</label>
                  <textarea
                    placeholder="Description"
                    className="p-1 mt-1"
                    value={description}
                    onChange={(e) => setProductDescription(e.target.value)}
                  ></textarea>

                  <label className="fw-500 me-2 mt-2">Product Image</label>
                  <input
                    type="file"
                    className="p-1 mt-1 form-control"
                    onChange={(e) => setProductImage(e.target.files[0])}
                  />

                  <label className="fw-500 me-2 mt-2">Product Price</label>
                  <input
                    type="text"
                    className="p-1 mt-1"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />

                  <label className="fw-500 me-2 mt-2">Product Discount Price</label>
                  <input
                    type="text"
                    className="p-1 mt-1"
                    placeholder="Discount Price"
                    value={productDiscountPrice}
                    onChange={(e) => setProductDiscountPrice(e.target.value)}
                  />

                  <label className="fw-500 me-2 mt-2">Product Unit</label>
                  <input
                    type="text"
                    className="p-1 mt-1"
                    placeholder="Unit"
                    value={productUnit}
                    onChange={(e) => setProductUnit(e.target.value)}
                  />

                  <label className="fw-500 me-2 mt-2">Product Quantity</label>
                  <input
                    type="text"
                    className="p-1 mt-1"
                    placeholder="Quantity"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                  />

                  <label className="fw-500 me-2 mt-2">Product Stock</label>
                  <input
                    type="text"
                    className="p-1 mt-1"
                    placeholder="Stock"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                  />

<label className="fw-500 me-2 mt-2">Product Category</label>
                  <select
                    className="form-control"
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {category.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <label className="fw-500 me-2 mt-2">Product SubCategory</label>
                  <select
                    className="form-control"
                    value={productsubCategory}
                    onChange={(e) => setProductsubCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {subcategory.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-5 ps-5 d-flex flex-column">
                  

                  <label className="fw-500 me-2 mt-2">Product Key Features</label>
                  <textarea
                    type="text"
                    className="p-1 mt-1"
                    placeholder="Key Features"
                    value={productKeyFeatures}
                    onChange={(e) => setProductKeyFeatures(e.target.value)}
                  />

               <label className="fw-500 me-2 mt-2">Product Size</label>
                  <textarea
                    type="text"
                    className="p-1 mt-1"
                    placeholder="Size"
                    value={productSize}
                    onChange={(e) => setproductSize(e.target.value)}
                  />
                   <label className="fw-500 me-2 mt-2">Product Weight</label>
                  <textarea
                    type="text"
                    className="p-1 mt-1"
                    placeholder="Weight"
                    value={productweight}
                    onChange={(e) => setproductweight(e.target.value)}
                  />

                <label className="fw-500 me-2 mt-2">Product Thickness</label>
                  <textarea
                    type="text"
                    className="p-1 mt-1"
                    placeholder="Thickness"
                    value={productThickness}
                    onChange={(e) => setProductThickness(e.target.value)}
                  />

                  <label className="fw-500 me-2 mt-2">Manufacturer Details</label>
                  <textarea
                    type="text"
                    className="p-1 mt-1"
                    placeholder="Details"
                    value={manufacturerDetails}
                    onChange={(e) => setManufacturerDetails(e.target.value)}
                  />

                  <label className="fw-500 me-2 mt-2">Return Policy</label>
                  <textarea
                    type="text"
                    className="p-1 mt-1"
                    placeholder="Policy"
                    value={returnPolicy}
                    onChange={(e) => setReturnPolicy(e.target.value)}
                  />

                  <label className="fw-500 me-2 mt-2">Country of Origin</label>
                  <input
                    type="text"
                    className="p-1 mt-1"
                    placeholder="Country Of Origin"
                    value={countryOfOrigin}
                    onChange={(e) => setCountryOfOrigin(e.target.value)}
                  />

                  <input type="submit" className="btn btn-success mt-5" value="Add Product" />
                </div>

                <p className="text-danger">{errorMessage}</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addproduct;
