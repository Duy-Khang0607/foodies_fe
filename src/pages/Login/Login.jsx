import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../services/AuthServices";
import { StoreContext } from "../../context/StoreContext";
import { parseExpiryTime } from "../../utils/tokenUtils";

const Login = () => {
  const navigate = useNavigate();
  const { token, saveAuthData } = useContext(StoreContext);
  const [data, setData] = useState({
    name: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginUser(data);
      console.log({response});
      console.log({data})
      
      // Kiểm tra xem có phải login thành công không
      if (response?.success === true) {
        const tokens = response?.data?.tokens;
        const userData = response?.data?.user;

        // Prepare token data
        const tokenData = {
          accessToken: tokens?.accessToken,
          refreshToken: tokens?.refreshToken,
        };

        // Calculate expiry time if provided
        if (tokens?.expiresIn) {
          const expiryTimeMs = parseExpiryTime(tokens.expiresIn);
          tokenData.expiryTime = Date.now() + expiryTimeMs;
        }

        // Save all auth data using centralized function
        saveAuthData(tokenData, userData);

        toast.success(response?.message || "Login successful!");

        navigate("/", { replace: true });
      } else {
        // Xử lý khi login thất bại (sai username/password)
        const errorMessage =
          response?.message || 
          response?.data?.message || 
          "Invalid username or password";
        toast.error(errorMessage);
      }
    } catch (error) {
      // Xử lý các lỗi mạng hoặc lỗi không mong đợi
      console.error("Login error:", error);

      const errorMessage =
        error?.message ||
        "Network error. Please try again.";

      toast.error(errorMessage);
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
                {/* Header */}
                <div className="text-center mb-3">
                  <div className="mb-2">
                    <div
                      className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <i className="bi bi-person-check text-white fs-4"></i>
                    </div>
                  </div>
                  <h3 className="fw-bold text-dark mb-1">Welcome Back!</h3>
                  <p className="text-muted small">Sign in to continue</p>
                </div>

                {/* Login Form */}
                <form
                  onSubmit={handleSubmit}
                  className="needs-validation"
                >
                  <div className="mb-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter your username"
                        required
                        name="name"
                        onChange={handleChange}
                        value={data.name}
                        autoComplete="username"
                        style={{ borderRadius: "12px" }}
                      />
                      <label htmlFor="name">
                        <i className="bi bi-person me-2"></i>
                        Username
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-floating">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="password"
                        placeholder="Enter your password"
                        required
                        name="password"
                        onChange={handleChange}
                        value={data.password}
                        autoComplete="password"
                        style={{ borderRadius: "12px" }}
                      />
                      <label htmlFor="password">
                        <i className="bi bi-lock me-2"></i>
                        Password
                      </label>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={togglePasswordVisibility}
                        style={{
                          borderRadius: "0 12px 12px 0",
                          border: "none",
                          transition: "all 0.3s ease",
                          position: "absolute",
                          top: "0",
                          right: "0",
                          height: "100%",
                        }}
                      >
                        {showPassword ? (
                          <i className="bi bi-eye"></i>
                        ) : (
                          <i className="bi bi-eye-slash"></i>
                        )}
                      </button>
                    </div>
                    <Link className="small" to="/forgot-password">
                      Forgot password
                    </Link>
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
                            className="spinner-border spinner-border-sm me-2 flex flex-row align-items-center justify-content-center"
                            role="status"
                            aria-hidden="true"
                          >
                            <i className="fas fa-sign-in-alt"></i>
                          </span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Submit
                        </>
                      )}
                    </button>
                  </div>

                  {/* Navigation to Signup */}
                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm px-3 py-1"
                      onClick={() => navigate("/signup")}
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
                      <i className="fas fa-user-plus me-1"></i>
                      Create Account
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

export default Login;
