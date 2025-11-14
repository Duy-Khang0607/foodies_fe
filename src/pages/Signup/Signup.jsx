import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signupUser } from "../../services/AuthServices";
import { StoreContext } from "../../context/StoreContext";

const Signup = () => {
  const navigate = useNavigate();
  const { token } = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    name: '',
    email: '',
    password: ''
  })

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (!data.name.trim()) {
      toast.error('Username is required');
      setIsLoading(false);
      return;
    }
    
    if (!data.email.trim()) {
      toast.error('Email is required');
      setIsLoading(false);
      return;
    }
    
    if (data.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await signupUser(data);
      
      if (response?.success) {
        toast.success(response?.message || "Account created successfully! Please login.");
        navigate("/login", { replace: true });
      } else {
        const errorMessage = response?.data?.message || response?.message || "Signup failed";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.message || 
                          error?.message || 
                          'Network error. Please try again.';
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }
  return (
    <div className="vh-100 d-flex align-items-center justify-content-center" style={{
      backgroundImage: 'url("/src/assets/bg_login_register.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Overlay for better readability */}
      <div className="position-absolute w-100 h-100" style={{
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1
      }}></div>
      
      {/* Animated Background Elements */}
      <div className="position-absolute w-100 h-100" style={{ zIndex: 2 }}>
        <div className="position-absolute" style={{
          top: '15%',
          left: '8%',
          width: '120px',
          height: '120px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div className="position-absolute" style={{
          top: '25%',
          right: '12%',
          width: '180px',
          height: '180px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>
        <div className="position-absolute" style={{
          bottom: '15%',
          left: '15%',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'float 7s ease-in-out infinite'
        }}></div>
        <div className="position-absolute" style={{
          bottom: '30%',
          right: '20%',
          width: '60px',
          height: '60px',
          background: 'rgba(255,255,255,0.12)',
          borderRadius: '50%',
          animation: 'float 5s ease-in-out infinite'
        }}></div>
      </div>

      <div className="container position-relative" style={{ zIndex: 3 }}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            {/* Additional background blur for form */}
            <div className="position-absolute w-100 h-100" style={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '20px',
              zIndex: -1
            }}></div>
            {/* Main Signup Card */}
            <div className="card shadow-lg border-0" style={{
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(15px)',
              animation: 'slideInUp 0.8s ease-out',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div className="card-body p-3 p-md-4">
                {/* Header */}
                <div className="text-center mb-3">
                  <div className="mb-2">
                    <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center" 
                         style={{ width: '60px', height: '60px' }}>
                      <i className="bi bi-person-add text-white fs-4"></i>
                    </div>
                  </div>
                  <h3 className="fw-bold text-dark mb-1">Create Account</h3>
                  <p className="text-muted small">Join us today</p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="needs-validation">
                  <div className="mb-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Enter your username"
                        required
                        name="name"
                        value={data?.name}
                        onChange={handleChange}
                        minLength={2}
                        maxLength={50}
                        style={{ borderRadius: '12px' }}
                      />
                      <label htmlFor="username">
                        <i className="fas fa-user me-2"></i>
                        Username
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter your email"
                        required
                        name="email"
                        value={data?.email}
                        onChange={handleChange}
                        autoComplete="email"
                        style={{ borderRadius: '12px' }}
                      />
                      <label htmlFor="email">
                        <i className="fas fa-envelope me-2"></i>
                        Email Address
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-floating">
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter your password"
                        required
                        name="password"
                        value={data?.password}
                        onChange={handleChange}
                        minLength={6}
                        maxLength={100}
                        style={{ borderRadius: '12px' }}
                      />
                      <label htmlFor="password">
                        <i className="fas fa-lock me-2"></i>
                        Password
                      </label>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="terms"
                        required
                        style={{ transform: 'scale(1.1)' }}
                      />
                      <label className="form-check-label small" htmlFor="terms">
                        I agree to the <a href="#" className="text-primary">Terms</a> and <a href="#" className="text-primary">Privacy Policy</a>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg py-2"
                      disabled={isLoading}
                      style={{
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        border: 'none',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(240, 147, 251, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(240, 147, 251, 0.3)';
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          <i className="fas fa-user-plus me-2"></i>
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus me-2"></i>
                          Create Account
                        </>
                      )}
                    </button>
                  </div>

                  {/* Navigation to Login */}
                  <div className="text-center">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <hr className="flex-grow-1" style={{ borderColor: '#dee2e6' }} />
                      <span className="mx-2 text-muted small">Already have an account?</span>
                      <hr className="flex-grow-1" style={{ borderColor: '#dee2e6' }} />
                    </div>
                    
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm px-3 py-1"
                      onClick={() => navigate('/login')}
                      style={{
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        borderWidth: '1px'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 2px 8px rgba(25, 135, 84, 0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
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
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
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
          color: #f093fb;
        }
        
        .form-control:focus {
          border-color: #f093fb;
          box-shadow: 0 0 0 0.2rem rgba(240, 147, 251, 0.25);
        }
        
        .form-check-input:checked {
          background-color: #f093fb;
          border-color: #f093fb;
        }
      `}</style>
    </div>
  );
};

export default Signup;
