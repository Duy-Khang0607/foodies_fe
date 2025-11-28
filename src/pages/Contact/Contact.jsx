import React, { useState } from "react";
import "./contact.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { sendContactEmail } from "../../services/ContactService";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sendContactEmail(formData);
      if (response?.success) {
        toast.success(response?.message);
      }else{
        toast.error(response?.message);
      }
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white py-5">
        <div className="container">
          <div className="row flex flex-row justify-content-between align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">
                <i className="bi bi-chat-dots me-3"></i>
                Get in Touch
              </h1>
              <p className="lead mb-4">
                We'd love to hear from you. Send us a message and we'll respond
                as soon as possible.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-clock me-2"></i>
                  <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-telephone me-2"></i>
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6" style={{marginTop: "100px"}}>
              <PhotoProvider>
                <PhotoView src="https://www.evogennutrition.com/cdn/shop/articles/DSC06160_2_6c3b6f9b-784e-4129-8961-7de820b9a0a2.jpg?v=1741105755&width=500">
                  <img
                    src="https://www.evogennutrition.com/cdn/shop/articles/DSC06160_2_6c3b6f9b-784e-4129-8961-7de820b9a0a2.jpg?v=1741105755&width=500"
                    className="rounded-4 w-100 h-100 shadow-lg hero-image object-fit-cover"
                    alt="Contact us"
                  />
                </PhotoView>
              </PhotoProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row g-5">
          {/* Contact Form */}
          <div className="col-lg-8">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-white border-0 py-4">
                <h2 className="fw-bold text-dark mb-0">
                  <i className="bi bi-envelope-paper me-3 text-primary"></i>
                  Send us a Message
                </h2>
                <p className="text-muted mt-2">
                  Fill out the form below and we'll get back to you within 24
                  hours.
                </p>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="name">
                          <i className="bi bi-person me-2"></i>Full Name
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="email">
                          <i className="bi bi-envelope me-2 text-primary"></i>Email Address
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          name="phone"
                          placeholder="Your Phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="phone">
                          <i className="bi bi-telephone me-2 text-primary"></i>Phone Number
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select className="form-select" id="subject">
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="order">Order Support</option>
                          <option value="technical">Technical Support</option>
                          <option value="feedback">Feedback</option>
                        </select>
                        <label htmlFor="subject">
                          <i className="bi bi-tag me-2 text-primary"></i>Subject
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          className="form-control"
                          id="message"
                          name="message"
                          placeholder="Your Message"
                          style={{ height: "120px" }}
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                        <label htmlFor="message">
                          <i className="bi bi-chat-text me-2 text-primary"></i>Your Message
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="newsletter"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="newsletter"
                        >
                          Subscribe to our newsletter for updates and special
                          offers
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg px-5 py-3 fw-semibold"
                      >
                        <i className="bi bi-send me-2"></i>
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: "20px" }}>
              {/* Contact Info Cards */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-primary text-white border-0">
                  <h5 className="mb-0 fw-semibold">
                    <i className="bi bi-info-circle me-2"></i>
                    Contact Information
                  </h5>
                </div>
                <div className="card-body p-0">
                  <div className="contact-info-item p-4 border-bottom">
                    <div className="d-flex align-items-start">
                      <div className="contact-icon me-3">
                        <i className="bi bi-geo-alt-fill text-white"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">Address</h6>
                        <p className="text-muted mb-0">
                          Việt Nam
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="contact-info-item p-4 border-bottom">
                    <div className="d-flex align-items-start">
                      <div className="contact-icon me-3">
                        <i className="bi bi-telephone-fill text-white"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">Phone</h6>
                        <p className="text-muted mb-0">
                          <a
                            href="tel:+12515469442"
                            className="text-decoration-none"
                          >
                            0902926340
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="contact-info-item p-4">
                    <div className="d-flex align-items-start">
                      <div className="contact-icon me-3">
                        <i className="bi bi-envelope-fill text-white"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">Email</h6>
                        <p className="text-muted mb-0">
                          <a
                            href="mailto:nguyenhoangduykhang0607@gmail.com"
                            className="text-decoration-none"
                          >
                            nguyenhoangduykhang0607@gmail.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-light border-0">
                  <h6 className="mb-0 fw-semibold">
                    <i className="bi bi-clock me-2"></i>
                    Business Hours
                  </h6>
                </div>
                <div className="card-body">
                  <div className="business-hours">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Monday - Friday</span>
                      <span className="fw-semibold">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Saturday</span>
                      <span className="fw-semibold">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Sunday</span>
                      <span className="fw-semibold text-danger">Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="card shadow-sm border-0">
                <div className="card-header bg-light border-0">
                  <h6 className="mb-0 fw-semibold">
                    <i className="bi bi-share me-2"></i>
                    Follow Us
                  </h6>
                </div>
                <div className="card-body">
                  <div className="social-links d-flex gap-3">
                    <a href="#" className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#" className="btn btn-outline-info btn-sm">
                      <i className="bi bi-twitter"></i>
                    </a>
                    <a href="#" className="btn btn-outline-danger btn-sm">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#" className="btn btn-outline-success btn-sm">
                      <i className="bi bi-whatsapp"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-white border-0 py-4">
                <h3 className="fw-bold text-dark mb-0">
                  <i className="bi bi-geo-alt me-3 text-primary"></i>
                  Find Us
                </h3>
                <p className="text-muted mt-2">
                  Visit our location or get directions
                </p>
              </div>
              <div className="card-body p-0">
                <div className="map-container">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3304.5!2d-117.3!3d34.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDA2JzAwLjAiTiAxMTfCsDE4JzAwLjAiVw!5e0!3m2!1sen!2sus!4v1234567890"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Our Location"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
