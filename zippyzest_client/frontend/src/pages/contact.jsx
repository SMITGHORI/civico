import { MdOutlineEmail } from "react-icons/md";
import "../styles/contact.css"; // Ensure you add the updated CSS below

const ContactSection = () => {
  return (
    <section className="contact-section mt-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-md-6">
            <div className="support-content">
              <h2 className="support-title">CIVICO Customer Support Available 24/7</h2>
              <p className="support-text">
                We are here to solve all your doubts and issues before and after you start your online shopping on CIVICO.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="support-card d-flex align-items-center">
              <div className="support-icon">
                <MdOutlineEmail className="icon" />
              </div>
              <div className="support-info">
                <span className="support-label">You can reach out to</span>
                <a href="mailto:zippyzest@.com" className="support-email">civico@.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
