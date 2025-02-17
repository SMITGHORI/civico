import { useEffect, useState } from "react";
import SellerSidebar from "../../components/sellercomponents/sellersidebar";
import "../../styles/style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShowsubCategory = () => {
  const [subcategory, setsubcategory] = useState([]);
  const navigate = useNavigate();
  const apiurl = import.meta.env.VITE_API_URL
  const FetchCat = async () => {
    try {
      const response = await axios.get(
        `${apiurl}/subcategory/getsellersubcategory`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log(response.data.subcategories);
        
        setsubcategory(response.data.subcategories);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    FetchCat();
  }, []);

  const deleteCat = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this category?");
    
    if (!isConfirmed) return;

    try {
      const response = await axios.delete(
        `${apiurl}/subcategory/delete-subcategory?id=${id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        FetchCat();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (subcategory) => {
    navigate('/seller/editsubcategory', { state: subcategory });
  };

  return (
    <div>
      <div className="d-flex">
        <div className="col-2 main-bg-sidebar">
          <SellerSidebar />
        </div>
        <div className="col-10">
          <div className="main-bg-admin p-5 h-100">
            <h3 className="fs-24 p-2">SubCategories</h3>
            <div className="side-box-admin">
              <div className="col-12">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">No</th>
                      <th scope="col">Name</th>
                      <th scope="col">Category</th>
                      <th scope="col">Description</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subcategory.map((val, index) => {
                      return (
                        <tr key={val._id}>
                          <th scope="row">{index + 1}</th>
                          <td>{val.name}</td>
                          <td>{val.categoryId.name}</td>
                          <td>{val.description}</td>
                          <td>
                            <button
                              className="btn btn-danger me-2"
                              onClick={() => deleteCat(val._id)}
                            >
                              Delete
                            </button>
                            <button className="btn btn-primary" onClick={() => handleEdit(val)}>
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowsubCategory;
