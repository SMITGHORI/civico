import React, { useEffect, useState } from 'react'
import Topheader from '../components/topheader'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GrCart } from 'react-icons/gr'
import axios from 'axios'
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
const Categoryinproduct = () => {
    const {id} = useParams()
    const [products,setproducts] = useState([])
    const [categories,setcategories] = useState()
    const navigate = useNavigate()
    const apiurl = import.meta.env.VITE_API_URL
    const fetchsucategory = async() => {
        try {
            const Response = await axios.post(`${apiurl}/category/getproductincategory?id=${id}`,{
                withCredentials : true
            })
            if(Response.data.success) {
                setproducts(Response.data.subcategory)
                console.log(products);
                
            }
        } catch (error) {
            console.log(error);
        }
    }
    const fetchcates = async() => {
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
      fetchsucategory() 
        fetchcates()
    },[id])
    const handleCart = async(id,price) => {
      let obj = {
        productId : id,
        price : price
      }
      try {
        let Response = await axios.post(`${apiurl}/cart/addcart`,obj,{withCredentials : true})
        console.log(Response.data.cart);
        if(Response.data.success){
          alert("Product Added to Cart");
        }
      } catch (error) {
        if(error.response.data.message ==  "You need to log in to access this resource."){
          alert("Please Login to add product to cart");
          navigate('/signup')
        }
        console.log(error);
      }
    }
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
       <Navbar/>
       <div className="container">
        <div className="row mt-5">
            <div className="col-12 p-3 col-md-3">
            <h2>Categories</h2>
              <div className="catshow">
                <ul className='m-0 mt-5 p-0'>
                {
  categories && categories.map((category, index) => {
    return (
      <Link to={`/category/showcategory/${category._id}`} key={index}>
        <li className='cate-box p-3 d-flex'>
          <img src={`${category.image}?t=${new Date().getTime()}`} alt="category" className='cateimg' />
          <span className='green-text fs-16 ps-5'>{category.name}</span>
        </li>
      </Link>
    );
  })
}

                </ul>
              </div>
            </div>
            <div className="col-12 col-md-9">
              <div className="title-cate">
                  <h2>Subcategories</h2>
              </div>
            <div className="row mt-4">

              {
                products && products.map((val,i)=>{
                    return(
            <div className="col-6 mt-4 col-md-3 col-lg-3" key={++i} >
              <Link to={`/subcategorypeoduct/${val._id}`}>
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
              }
            
        </div>
            </div>
        </div>
       </div>
       <Footer/>
    </div>
  )
}

export default Categoryinproduct
