import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "../../services/AuthServices";
import { StoreContext } from "../../context/StoreContext";

const ForgotPassword = () => {
  const { token } = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await forgotPassword(data);
      if (response?.success) {
        toast.success(
          response?.message || "Password reset email sent successfully!"
        );
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Password reset email failed!"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: 'url("/src/assets/bg_login_register.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Overlay for better readability */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      ></div>

      {/* Animated Background Elements */}
      <div className="position-absolute w-100 h-100" style={{ zIndex: 2 }}>
        <div
          className="position-absolute"
          style={{
            top: "10%",
            left: "10%",
            width: "100px",
            height: "100px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite",
          }}
        ></div>
        <div
          className="position-absolute"
          style={{
            top: "20%",
            right: "15%",
            width: "150px",
            height: "150px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "50%",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        ></div>
        <div
          className="position-absolute"
          style={{
            bottom: "20%",
            left: "20%",
            width: "80px",
            height: "80px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "50%",
            animation: "float 7s ease-in-out infinite",
          }}
        ></div>
      </div>

      <div className="container position-relative" style={{ zIndex: 3 }}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            {/* Additional background blur for form */}
            <div
              className="position-absolute w-100 h-100"
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                borderRadius: "20px",
                zIndex: -1,
              }}
            ></div>
            {/* Main Login Card */}
            <div
              className="card shadow-lg border-0"
              style={{
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(15px)",
                animation: "slideInUp 0.8s ease-out",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <div className="card-body p-3 p-md-4">
                {/* Login Form */}
                <form onSubmit={handleSubmit} className="needs-validation">
                  <div className="mb-3">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter your email"
                        required
                        name="email"
                        onChange={handleChange}
                        value={data.email}
                        autoComplete="email"
                        style={{ borderRadius: "12px" }}
                      />
                      <label htmlFor="email">
                        <i className="bi bi-envelope me-2"></i>
                        Email
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg py-2"
                      disabled={isLoading}
                      style={{
                        borderRadius: "12px",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 6px 20px rgba(102, 126, 234, 0.4)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow =
                          "0 4px 15px rgba(102, 126, 234, 0.3)";
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          <i class="bi bi-box-arrow-in-right me-2"></i>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i class="bi bi-box-arrow-in-right me-2"></i>
                          Submit
                        </>
                      )}
                    </button>
                  </div>
                  {/* Login Button */}
                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm px-3 py-1"
                      onClick={() => navigate("/login")}
                      style={{
                        borderRadius: "12px",
                        transition: "all 0.3s ease",
                        borderWidth: "1px",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = "translateY(-1px)";
                        e.target.style.boxShadow =
                          "0 2px 8px rgba(13, 110, 253, 0.3)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      <i className="fas fa-sign-in-alt me-1"></i>
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-floating > .form-control:focus ~ label,
        .form-floating > .form-control:not(:placeholder-shown) ~ label {
          color: #667eea;
        }

        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
