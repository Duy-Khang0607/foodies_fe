import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <section 
      className="position-relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '20vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Animated Background Elements */}
      <div className="position-absolute w-100 h-100" style={{ zIndex: 1 }}>
        <div className="position-absolute" style={{
          top: '10%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div className="position-absolute" style={{
          top: '20%',
          right: '15%',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>
        <div className="position-absolute" style={{
          bottom: '20%',
          left: '20%',
          width: '80px',
          height: '80px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'float 7s ease-in-out infinite'
        }}></div>
      </div>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row align-items-center lg:py-0 py-3">
          <div className="col-12 col-lg-8">
            <div className="text-white">
              <h1 className="display-3 fw-bold mb-4" style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                animation: 'slideInLeft 1s ease-out'
              }}>
                <i className="fas fa-utensils me-3"></i>
                Order Your Favorite Food
              </h1>
              <p className="lead mb-4 fs-4" style={{
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                animation: 'slideInLeft 1.2s ease-out'
              }}>
                Discover the best food and drinks in the city with our premium delivery service
              </p>
              <div className="d-flex flex-wrap gap-3" style={{
                animation: 'slideInLeft 1.4s ease-out'
              }}>
                <Link to="/explore">
                  <button 
                    className="btn btn-light md:btn-lg btn-sm px-4 py-3 rounded-pill"
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                    }}
                  >
                    <i className="fas fa-search me-2"></i>
                    Explore Now
                  </button>
                </Link>
                <Link to="/contact">
                  <button 
                    className="btn btn-outline-light md:btn-lg btn-sm px-4 py-3 rounded-pill"
                    style={{
                      borderWidth: '2px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <i className="fas fa-phone me-2"></i>
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4 d-none d-lg-block">
            <div className="text-center" style={{
              animation: 'slideInRight 1s ease-out'
            }}>
              <div className="position-relative">
                <div 
                  className="rounded-circle mx-auto"
                  style={{
                    width: '300px',
                    height: '300px',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="fas fa-hamburger text-white" style={{ fontSize: '4rem' }}></i>
                </div>
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                  <div 
                    className="rounded-circle"
                    style={{
                      width: '250px',
                      height: '250px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      animation: 'pulse 2s ease-in-out infinite'
                    }}
                  ></div>
                </div>
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
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
      `}</style>
    </section>
  );
};

export default Header;
