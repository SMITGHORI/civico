import '../../styles/style.css'
import '../../styles/sellerstyle.css'

import Adminsidebar from '../../components/adminComponents/adminsidebar'
import { useEffect, useState } from 'react';
import axios from 'axios';
const AdminHome = () => {
  const [users,setusers] = useState([])
  const apiurl = import.meta.env.VITE_API_URL
  const FetchCat = async () => {
    try {
      const response = await axios.get(
        `${apiurl}/auth/alluser`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log(response.data.user);
        
        setusers(response.data.user);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    FetchCat();
  }, []);
  return (
    <div>
        <div className="d-flex">
            <div className="col-2 main-bg-sidebar">
                <Adminsidebar/>
            </div>
            <div className="col-10">
          <div className="main-bg-admin p-5 h-100">
            <h3 className="fs-24 p-2">Users</h3>
            <div className="side-box-admin">
              <div className="col-12">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">No</th>
                      <th scope="col">Name</th>
                      <th scope="col">email</th>
                      <th scope="col">mobileNumber</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((val, index) => {
                      return (
                        <tr key={val._id}>
                          <th scope="row">{index + 1}</th>
                          <td>{val.username}</td>
                          <td>{val.email}</td>
                          <td>{val.mobileNumber}</td>
                          
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
  )
}

export default AdminHome
