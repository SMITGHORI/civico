import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import ProductView from "./pages/product-view";
import Registersentotp from "./pages/registersentotp";
import VerifyOtp from "./pages/verify-otp";
import SellerHome from "./pages/sellerpages/sellerHome";
import Addcategory from "./pages/sellerpages/addcategory";
import Addproduct from "./pages/sellerpages/addproduct";
import Sellerlogin from "./pages/sellerlogin";
import Sellerverify from "./pages/sellerverify";
import ShowCategory from "./pages/sellerpages/allcategoriesshow";
import SellerProtectedRoute from "./pages/protectedRoutes/sellerprotected";
import Editcategory from "./pages/sellerpages/editcategory";
import ShowProduct from "./pages/sellerpages/allproductshow";
import Editproduct from "./pages/sellerpages/editproduct";
import Categoryinproduct from "./pages/categoryinproduct";
import Checkout from "./pages/chekoutpage";
import Profile from "./pages/profile";
import Profileshow from "./pages/profileshow";
import Username from "./pages/usernametake";
import SellerSignin from "./pages/sellerssignin";
import UserProtected from "./pages/protectedRoutes/userProtecter";
import UserOrder from "./pages/userorder";
import ShowOrder from "./pages/sellerpages/sellerorders";
import ShowOrderDetails from "./pages/sellerpages/showorderDetails";
import AdminHome from "./pages/adminPages/adminhome";
import TotalUserAdmin from "./pages/adminPages/totaluser";
import TotalsellerAdmin from "./pages/adminPages/totalseller";
import AdminProtected from "./pages/protectedRoutes/adminprotectedroute";
import Forgotpasswordsentotp from "./pages/forgotpasswordsent-otp";
import Addsubcategory from "./pages/sellerpages/addsubcategory";
import ShowsubCategory from "./pages/sellerpages/allsubcategory";
import Editsubcategory from "./pages/sellerpages/editsubcategory";
import SubcategoryProuct from "./pages/subcategoryproduct";
function App() {
  return (
   <>
     <BrowserRouter>
         <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/productview/:id" element={<ProductView/>} />
          <Route path="/signup" element={<Registersentotp/>} />
          <Route path="/verifyOtp" element={<VerifyOtp/>} />
          <Route path="/category/showcategory/:id" element={<Categoryinproduct/>} />
          <Route path="/subcategorypeoduct/:id" element={<SubcategoryProuct/>} />
         
          <Route element={<UserProtected/>}>
          <Route path="/profile" element={<Profile/>} />  
          </Route>
          <Route element={<UserProtected/>}>
          <Route path="/showorderuser" element={<UserOrder/>} />  
          </Route>
          <Route element={<UserProtected/>}>
          <Route path="/proflieshow" element={<Profileshow/>} /> 
          </Route>
          <Route element={<UserProtected/>}>
          <Route path="/checkout" element={<Checkout/>} />
          </Route>
          
          <Route path="/usernametake" element={<Username/>} />
          <Route path="/sellerlogin" element={<Sellerlogin/>} />
          <Route path="/sellerverify" element={<Sellerverify/>} />  
          <Route path="/sellersigin" element={<SellerSignin/>} />  
          <Route path="/forgotpasswordsentotp" element={<Forgotpasswordsentotp/>} />  
          <Route element={<SellerProtectedRoute/>}>
              <Route path="/seller/showcategory" element={<ShowCategory/>} />
          </Route>
          <Route element={<SellerProtectedRoute/>}>
          <Route path="/seller" element={<SellerHome/>} />
          </Route>
          <Route element={<SellerProtectedRoute/>}>
          <Route path="/seller/addctegory" element={<Addcategory/>} />
          </Route>
          <Route element={<SellerProtectedRoute/>}>
          <Route path="/seller/addsubcategory" element={<Addsubcategory/>} />
          </Route>
          <Route element={<SellerProtectedRoute/>}>
            <Route path="/seller/addproduct" element={<Addproduct/>} />
          </Route>
          <Route element={<SellerProtectedRoute/>}>
          <Route path="/seller/editcategory" element={<Editcategory/>} />
          </Route>

          <Route element={<SellerProtectedRoute/>}>
          <Route path="/seller/editsubcategory" element={<Editsubcategory/>} />
          </Route>
          <Route element={<SellerProtectedRoute/>}>
          <Route path="/seller/showproduct" element={<ShowProduct/>} />
          </Route>
          <Route element={<SellerProtectedRoute/>}>
          <Route path="/seller/showsubcategory" element={<ShowsubCategory/>} />
          </Route>
          <Route element={<SellerProtectedRoute/>}>
          <Route path="/seller/editproduct" element={<Editproduct/>} />
          </Route>
          <Route element={<SellerProtectedRoute/>}>
          <Route path="/seller/showorder" element={<ShowOrder/>}></Route>
          </Route>
          <Route element={<SellerProtectedRoute/>}>
          <Route path="/seller/orderdetails/:id" element={<ShowOrderDetails/>}></Route>
          </Route>
          <Route element={<AdminProtected/>} >
              <Route path="/admin/adminhome" element={<AdminHome/>}></Route>
          </Route>
          <Route element={<AdminProtected/>} >
          <Route path="/admin/TotalUserAdmin" element={<TotalUserAdmin/>}></Route>
          </Route>
          <Route element={<AdminProtected/>} >
          <Route path="/admin/TotalsellerAdmin" element={<TotalsellerAdmin/>}></Route>
          </Route> 
          <Route path="/checkout" element={<Checkout/>}></Route>
         </Routes>
     </BrowserRouter>
   </>
  )
}
export default App