import React, { useEffect, useState } from "react";
import SellerSidebar from "../../components/sellercomponents/sellersidebar";
import "../../styles/style.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
const Editsubcategory = () => {
  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [image, setimage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [subcategorycategory, setsubcategoryCategory] = useState("");
  console.log(location.state);
  const apiurl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    setname(location?.state?.name);
    setdescription(location?.state?.description);
    setimage(location?.state?.image);
    setsubcategoryCategory(location?.state?.categoryId || ""); // Assuming categoryId is stored in state
  }, [location?.state]);

  const [category, setCategory] = useState([]);
  useEffect(() => {
    const GetCategory = async () => {
      try {
        const response = await axios.get(`${apiurl}/category/all-category`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setCategory(response.data.category); // Set the categories in state
        }
      } catch (error) {
        console.log(error);
      }
    };
    GetCategory();
  }, []);
  const handlesubmit = async (e) => {
    e.preventDefault();
    const obj = {
      name: name,
      description: description,
      image: image,
      category: subcategorycategory, // Ensure category ID is sent
    };

    console.log(obj);

    try {
      const response = await axios.post(
        `${apiurl}/subcategory/update-subcategory?id=${location?.state?._id}`,
        obj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("subCategory Update successfully!");
        console.log(response.data.categoryupdate);
        navigate("/seller/showcategory");
        setname("");
        setdescription("");
        setimage("");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <div className="d-flex">
        <div className="col-2 main-bg-sidebar">
          <SellerSidebar />
        </div>
        <div className="col-10">
          <div className="main-bg-admin p-5 h-100">
            <h3 className="fs-24 p-2">Edit SubCategory</h3>
            <div className="side-box-admin">
              <div className="col-4">
                <form
                  className="form-admin d-flex flex-column"
                  onSubmit={handlesubmit}
                >
                  <label className="fw-500 me-2">SubCategory Name</label>
                  <input
                    type="text"
                    className="p-1 mt-1"
                    placeholder="Name"
                    onChange={(e) => setname(e.target.value)}
                    value={name}
                  />
                  <label className="fw-500 me-2 mt-2">
                    SubCategory Description
                  </label>
                  <textarea
                    placeholder="Description"
                    className="p-1 mt-1"
                    onChange={(e) => setdescription(e.target.value)}
                    value={description}
                  ></textarea>
                  <label className="fw-500 me-2 mt-2">SubCategory Image</label>
                  <input
                    type="file"
                    className="p-1 mt-1 form-control"
                    onChange={(e) => setimage(e.target.files[0])}
                    placeholder="image"
                  />
                  <p className="text-danger"></p>
                  <div className="mb-4">
                    <label className="fw-500 me-2 mt-2">Select Category</label>
                    <select
                      className="form-control"
                      value={subcategorycategory}
                      onChange={(e) => setsubcategoryCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {category.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="submit"
                    className="btn btn-success"
                    value="Update SubCategory"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editsubcategory;
