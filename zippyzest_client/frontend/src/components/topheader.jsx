import '../styles/style.css'
import '../styles/topheader.css'
import { MdOutlinePhone } from "react-icons/md";
import { ImLocation } from "react-icons/im";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaPinterestP } from "react-icons/fa";
const Topheader = () => {
  return (
    <div>
      <section>
        <div className="container-fluid">
            <div className="row ustify-content-center align-items-center">
                <div className="col-12 col-md-6 d-flex  align-items-center">
                    <div className="col-6 col-md-3 py-2">
                        <div className="tel-number d-flex justify-content-center align-items-center">
                            <div className="col-2">
                                <span className='fs-16 color-secondary'><MdOutlinePhone className='color-secondary' /></span>
                            </div>
                            <div className="col-10">
                                <p className='fs-16 color-secondary m-0'>+(02) 587 - 898 -250</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 d-flex  justify-content-center align-items-center py-2">
                        <div className="col-1">
                            <span><ImLocation  className='color-secondary'/></span>
                        </div>
                        <div className="col-10">
                            <p className='fs-16 color-secondary m-0'>Favicon, New York, USA - 254230</p>
                        </div>
                    </div>
                </div>
                <div className="col-12  col-md-6 d-none d-md-flex justify-content-start justify-content-md-end ">
                    <div className="col-12 col-md-6  d-flex justify-content-start justify-content-md-end align-items-center">
                        <ul className='d-flex align-items-center social-media-icons-topheader m-0'>
                            <li>
                                <span><FaFacebookF  className='color-secondary'/></span>
                            </li>
                            <li>
                                <span><FaTwitter className='color-secondary' /></span>
                            </li>
                            <li>
                                <span><FaInstagram className='color-secondary' /></span>
                            </li>
                            <li className='border-0 pe-0'>
                                <span><FaPinterestP className='color-secondary'/></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  )
}

export default Topheader
