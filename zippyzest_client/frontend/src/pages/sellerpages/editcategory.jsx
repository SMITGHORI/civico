import React, { useEffect, useState } from "react";
import SellerSidebar from "../../components/sellercomponents/sellersidebar";
import "../../styles/style.css"
import axios from 'axios'
import { useLocation, useNavigate } from "react-router-dom";
const Editcategory = () => {
  const [name,setname] = useState("")
  const [description,setdescription] = useState("")
  const [image, setimage] = useState(null);
  const location  = useLocation()
  const navigate = useNavigate()
  console.log(location.state);
  const apiurl = import.meta.env.VITE_API_URL
  useEffect(()=>{
    setname(location?.state?.name)
    setdescription(location?.state?.description)
    setimage(location?.state?.image)
  },[location?.state])
  const handlesubmit = async(e) =>  {
    e.preventDefault();
    const obj = {
      name:name,
      description:description,
      image:image
    }
    console.log(obj);
    
    
    try {
      const response = await axios.post(`${apiurl}/category/update-category?id=${location?.state?._id}`, obj, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials : true
      })

      if (response.data.success) {
        alert("Category Update successfully!");
        console.log(response.data.categoryupdate)
        navigate('/seller/showcategory')
        setname("")
        setdescription("")
        setimage("")
      } 
    } catch (error) {
      console.error(error);
      
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
                <h3 className="fs-24 p-2">Edit Category</h3>
                <div className="side-box-admin">
                    <div className="col-4">
                    <form className="form-admin d-flex flex-column" onSubmit={handlesubmit}>
                        <label className="fw-500 me-2">Category Name</label>
                        <input type="text" className="p-1 mt-1"placeholder="Name" onChange={(e) => setname(e.target.value)} value={name} />
                        <label className="fw-500 me-2 mt-2">Category Description</label>
                        <textarea placeholder="Description" className="p-1 mt-1"  onChange={(e) => setdescription(e.target.value)} value={description}></textarea>
                        <label className="fw-500 me-2 mt-2">Category Image</label>
                        <input type="file" className="p-1 mt-1 form-control" onChange={(e) => setimage(e.target.files[0])} placeholder="image" />
                        <p className="text-danger"></p>

                        <input type="submit" className="btn btn-success" value="Update Category" />
                    </form>
                    </div>
                </div>
              </div>

        </div>
      </div>
    </div>
  );
};

export default Editcategory;
