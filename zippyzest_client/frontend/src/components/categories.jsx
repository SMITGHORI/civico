import "../styles/style.css";
import "../styles/categories.css";
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";


const Categories = () => {
  const [categories,setcategories] = useState()
  const apiurl = import.meta.env.VITE_API_URL
    const fetchproducts = async() => {
        try {
            const Response = await axios.get(`${apiurl}/category/all-category`,{
                withCredentials : true
            })
            if(Response.data.success) {
                setcategories(Response.data.category)
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    useEffect(()=>{
        fetchproducts()
    })
  return (
    <section id="cate">
      <div className="container">
        <div className="title-section mt-4">
          <h2>Categories</h2>
        </div>
        <div className="row ">
        {categories && categories.map((val, index) => (
  <div className="col-6 col-md-4 col-lg-2 mt-5 d-flex justify-content-center" key={index}>
    <Link to={`/category/showcategory/${val._id}`} className="cat-box" style={{ textDecoration: 'none' }}>
      <div className="cat-image w-100 d-flex justify-content-center">
        <img className="w-50" src={`${val.image}`} alt={val.name} />
      </div>
      <div className="cat-name mt-2 d-flex justify-content-center">
        <span className="main-text">{val.name}</span>
      </div>
    </Link>
  </div>
))}

        </div>
      </div>
    </section>
  );
};

export default Categories;
