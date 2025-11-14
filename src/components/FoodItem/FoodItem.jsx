import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ file, name, description, price, id }) => {
  const { increaseQuantity, decreaseQuantity, addToCart, cart,removeFromCart } =
    useContext(StoreContext);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cartItem = cart?.find((item) => item.id === id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div
      className="card h-100 shadow-sm border-0 position-relative overflow-hidden"
      style={{
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 20px 40px rgba(0,0,0,0.15)"
          : "0 4px 15px rgba(0,0,0,0.1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div
        className="position-relative overflow-hidden"
        style={{ borderRadius: "20px 20px 0 0" }}
      >
        <Link to={`/food-detail/${id}`}>
          <img
            src={file}
            className="card-img-top img-fluid object-fit-cover"
            alt={name}
            style={{
              maxHeight: "250px",
              transition: "all 0.3s ease",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        </Link>

        {/* Overlay with Quick Actions */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: "rgba(0,0,0,0.4)",
            opacity: isHovered ? "1" : "0",
            transition: "all 0.3s ease",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <Link to={`/food-detail/${id}`}>
            <button
              className="btn btn-light btn-lg rounded-pill px-4 py-2"
              style={{
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
              }}
            >
              <i className="fas fa-eye me-2"></i>
              Quick View
            </button>
          </Link>
        </div>

        {/* Like Button */}
        <button
          className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle"
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            background: isLiked ? "#ff6b6b" : "rgba(255,255,255,0.9)",
            color: isLiked ? "white" : "#666",
          }}
          onClick={() => setIsLiked(!isLiked)}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
          }}
        >
          <i className={`fas ${isLiked ? "fa-heart" : "fa-heart"}`}></i>
        </button>

        {/* Price Badge */}
        <div
          className="position-absolute bottom-0 start-0 m-3"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
          }}
        >
          ${price}
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body p-2">
        <h5
          className="card-title fw-bold mb-2"
          style={{
            fontSize: "1.1rem",
            color: "#333",
            lineHeight: "1.3",
          }}
        >
          {name}
        </h5>

        <p
          className="card-text text-muted mb-3"
          style={{
            fontSize: "0.9rem",
            lineHeight: "1.4",
            minHeight: "40px",
          }}
        >
          {description.length > 60
            ? description.slice(0, 60) + "..."
            : description}
        </p>

        {/* Rating */}
        <div className="d-flex align-items-center mb-3">
          <div className="d-flex align-items-center me-2">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`bi bi-star-fill me-1 ${
                  i <= 5 ? "text-warning" : "text-muted"
                }`}
                style={{ fontSize: "0.8rem" }}
              ></i>
            ))}
          </div>
          <small className="text-muted">(4.5)</small>
        </div>
      </div>

      {/* Card Footer */}
      <div className="card-footer bg-transparent border-0 p-4 pt-0">
        {quantity > 0 ? (
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-outline-primary rounded-circle"
                style={{
                  width: "35px",
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => decreaseQuantity(id)}
              >
                <i className="bi bi-patch-minus"></i>
              </button>
              <span
                className="fw-bold fs-5"
                style={{ minWidth: "30px", textAlign: "center" }}
              >
                {quantity}
              </span>
              <button
                className="btn btn-outline-primary rounded-circle"
                style={{
                  width: "35px",
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => increaseQuantity(id)}
              >
                <i className="bi bi-patch-plus"></i>
              </button>
            </div>
            <button
              className="btn btn-outline-danger btn-sm rounded-pill"
              onClick={() => removeFromCart(id)}
              style={{ fontSize: "0.8rem" }}
            >
              <i className="fas fa-trash me-1"></i>
              Remove
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary w-100 py-2 rounded-pill"
            onClick={() => addToCart({ id, name, price, file })}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              transition: "all 0.3s ease",
              fontWeight: "600",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            <i className="fas fa-shopping-cart me-2"></i>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodItem;
