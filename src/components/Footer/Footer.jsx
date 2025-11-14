import React from "react";

const Footer = () => {
  return (
    <footer className="bg-light">
      {/* Main Footer Content */}
      <div className="container py-3">
        <div className="row g-4">
          {/* Brand Section */}
          <div className="col-lg-3 col-md-6">
            <div className="mb-4">
              <h1 className="text-dark fw-bold mb-3" style={{letterSpacing: "0.2em", fontSize: "2.5rem"}}>
                Foodies
              </h1>
              <p className="text-muted mb-4 lh-lg">
                Subscribe to be the first to hear about our exclusive offers and
                latest arrivals.
              </p>
              
              {/* Newsletter Subscription */}
              <div className="input-group mb-3">
                <input 
                  type="email" 
                  className="form-control border-0 rounded-pill" 
                  placeholder="Enter your email"
                  style={{ backgroundColor: "#f8f9fa" }}
                />
                <button 
                  className="btn btn-primary rounded-pill px-4 fw-semibold" 
                  type="button"
                >
                  Subscribe
                </button>
              </div>
              
              {/* Social Media Links */}
              <div className="d-flex gap-3">
                <a href="#" className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-instagram" style={{color: 'red'}}></i>
                </a>
                <a href="#" className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-youtube" style={{color: 'red'}}></i>
                </a>
              </div>
            </div>
          </div>
          
          {/* Customer Care */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-dark fw-bold mb-4 t">Customer Care</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <p href="#" className="text-muted">EvoBucks Loyalty Program</p>
              </li>
              <li className="mb-2">
                <p href="#" className="text-muted">Military & First Responder Discounts</p>
              </li>
              <li className="mb-2">
                <p href="#" className="text-muted">Military APO/FPO Shipping</p>
              </li>
              <li className="mb-2">
                <p href="#" className="text-muted">Shipping FAQ</p>
              </li>
              <li className="mb-2">
                <p href="#" className="text-muted">Return Policy</p>
              </li>
              <li className="mb-2">
                <p href="#" className="text-muted">Accessibility Statement</p>
              </li>
              <li className="mb-2">
                <p href="#" className="text-muted">Where to Buy</p>
              </li>
              <li className="mb-2">
                <p href="#" className="text-muted">International Distributors</p>
              </li>
              <li className="mb-2">
                <p href="#" className="text-muted">International Products</p>
              </li>
              <li className="mb-2">
                <p href="#" className="text-muted">Privacy & Cookie Policy</p>
              </li>
              <li className="mb-2">
                <p href="#" className="text-muted">Careers</p>
              </li>
              <li className="mb-2">
                <p href="#" className="text-muted">Do not sell my personal information</p>
              </li>
              <li className="mb-2">
                <p href="#" className="text-muted">Terms of Service</p>
              </li>
              <li className="mb-2">
                <p href="#" className="text-muted">Refund policy</p>
              </li>
              <li className="mb-2">
                <p href="#" className="text-muted">Track My Order</p>
              </li>
            </ul>
          </div>
          
          {/* Disclaimer */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-dark fw-bold mb-4">Disclaimer</h5>
            <p className="text-muted lh-lg">
              The statements made within this website have not been evaluated by
              the Food and Drug Administration. These statements and the
              products of this company are not intended to diagnose, treat, cure
              or prevent any disease.
            </p>
          </div>
          
          {/* Contact Info */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-dark fw-bold mb-4">Get In Touch</h5>
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-envelope-fill text-primary me-3"></i>
                <a href="mailto:cs@evogennutrition.com" className="text-muted text-decoration-none">
                  cs@evogennutrition.com
                </a>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-telephone-fill text-primary me-3"></i>
                <a href="tel:408.364.1650" className="text-muted text-decoration-none">
                  408.364.1650
                </a>
              </div>
              <div className="d-flex align-items-start">
                <i className="bi bi-geo-alt-fill text-primary me-3 mt-1"></i>
                <span className="text-muted">
                  8550 Esters Blvd Irving Texas 75063 United States
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="border-top">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-muted mb-0">
                © 2025 Foodies. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex justify-content-md-end gap-3">
                <a href="#" className="text-muted text-decoration-none">Privacy Policy</a>
                <a href="#" className="text-muted text-decoration-none">Terms of Service</a>
                <a href="#" className="text-muted text-decoration-none">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
