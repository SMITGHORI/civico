import '../../styles/style.css'
import '../../styles/sellerstyle.css'
import SellerSidebar from '../../components/sellercomponents/sellersidebar'
import Sellerheader from './sellerHeader'
const SellerHome = () => {
  return (
    <div>
        <div className="d-flex">
            <div className="col-2 main-bg-sidebar">
                <SellerSidebar />
            </div>
            <div className="col-9">
                <div className="row">
                    <Sellerheader/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SellerHome
