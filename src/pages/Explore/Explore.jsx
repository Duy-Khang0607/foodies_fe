import React, { useRef } from "react";
import { categories } from "../../assets/assets";
import "./explore.css";

const Explore = ({ category, setCategory }) => {
  const ref = useRef(null);

  const clickLeft = () => {
    if (ref.current) {
      ref.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const clickRight = () => {
    if (ref.current) {
      ref.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      className="position-relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        padding: "4rem 0",
        marginTop: "2rem",
      }}
    >
      {/* Animated Background Elements */}
      <div className="position-absolute w-100 h-100" style={{ zIndex: 1 }}>
        <div
          className="position-absolute"
          style={{
            top: "15%",
            left: "8%",
            width: "120px",
            height: "120px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite",
          }}
        ></div>
        <div
          className="position-absolute"
          style={{
            top: "25%",
            right: "12%",
            width: "180px",
            height: "180px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "50%",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        ></div>
        <div
          className="position-absolute"
          style={{
            bottom: "15%",
            left: "15%",
            width: "100px",
            height: "100px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "50%",
            animation: "float 7s ease-in-out infinite",
          }}
        ></div>
      </div>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        {/* Header Section */}
        <div className="row align-items-center mb-5">
          <div className="col-12 col-lg-8">
            <div className="text-white">
              <h1
                className="display-4 fw-bold mb-3"
                style={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  animation: "slideInUp 0.8s ease-out",
                }}
              >
                <i className="fas fa-utensils me-3"></i>
                Explore Our Menu
              </h1>
              <p
                className="lead fs-4"
                style={{
                  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                  animation: "slideInUp 1s ease-out",
                }}
              >
                Discover the best food and drinks in the city
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div
              className="d-flex justify-content-lg-end justify-content-center gap-3"
              style={{
                animation: "slideInUp 1.2s ease-out",
              }}
            >
              <button
                className="btn btn-light btn-lg rounded-circle"
                onClick={clickLeft}
                style={{
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-3px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <i className="bi bi-caret-left"></i>
              </button>
              <button
                className="btn btn-light btn-lg rounded-circle"
                onClick={clickRight}
                style={{
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-3px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <i className="bi bi-caret-right"></i>
              </button> 
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="row">
          <div className="col-12">
            <div
              className="d-flex gap-4 overflow-auto pb-3"
              ref={ref}
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,255,255,0.3) transparent",
              }}
            >
              {categories?.map((item, index) => (
                <div
                  key={index}
                  className="text-center flex-shrink-0"
                  style={{
                    cursor: "pointer",
                    outline: "none",
                    border: "none",
                    WebkitTapHighlightColor: "transparent",
                    minWidth: "120px",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() =>
                    category === item?.catogory
                      ? setCategory("All")
                      : setCategory(item?.catogory)
                  }
                  tabIndex={-1}
                  onFocus={(e) => e.target.blur()}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div className="position-relative mb-3">
                    <img
                      src={item?.image}
                      alt={item?.name}
                      className={`img-fluid rounded-circle shadow-lg ${
                        item?.catogory === category ? "active" : ""
                      }`}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        border:
                          item?.catogory === category
                            ? "3px solid rgba(255,255,255,0.8)"
                            : "3px solid rgba(255,255,255,0.3)",
                        transition: "all 0.3s ease",
                        filter:
                          item?.catogory === category
                            ? "brightness(1.1)"
                            : "brightness(0.9)",
                      }}
                    />
                    {item?.catogory === category && (
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100 rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          background: "rgba(255,255,255,0.2)",
                          backdropFilter: "blur(5px)",
                          animation: "pulse 2s ease-in-out infinite",
                        }}
                      >
                        <i className="fas fa-check text-white fs-5"></i>
                      </div>
                    )}
                  </div>
                  <p
                    className="fw-bold text-white mb-0"
                    style={{
                      fontSize: "0.9rem",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                      opacity: item?.catogory === category ? "1" : "0.8",
                    }}
                  >
                    {item?.catogory}
                  </p>
                </div>
              ))}
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

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        .overflow-auto::-webkit-scrollbar {
          height: 6px;
        }

        .overflow-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .overflow-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        .overflow-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </section>
  );
};

export default Explore;
