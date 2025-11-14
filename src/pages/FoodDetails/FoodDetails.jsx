import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getFoodById } from "../../services/FoodServices";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { StoreContext } from "../../context/StoreContext";
const FoodDetails = () => {
  const { id } = useParams();
  const [foodDetails, setFoodDetails] = useState({});
  const { increaseQuantity, decreaseQuantity, quantity, cart, addToCart } =
    useContext(StoreContext);

  // Video states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);
  const fetchFoodDetails = async () => {
    const response = await getFoodById(id);
    console.log({ response });
    setFoodDetails(response?.data?.data);
  };
  // Lấy quantity từ cart thay vì quantity state
  const getCurrentQuantity = (itemId) => {
    const cartItem = cart.find((item) => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (itemId) => {
    // Sử dụng addToCart thay vì increaseQuantity cho item chưa có trong cart
    addToCart({
      id: itemId,
      name: foodDetails?.name,
      price: foodDetails?.price,
      file: foodDetails?.file,
    });
  };

  // Video control functions
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoClick = () => {
    togglePlay();
  };

  const handleMouseEnter = () => {
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    setShowControls(true); // Keep controls visible for better UX
  };

  useEffect(() => {
    fetchFoodDetails();
  }, [id]);
  return (
    // Food Details
    <div className="container py-5 mt-5">
      <div className="row gx-4 gx-lg-5 align-items-center py-5">
        <div className="col-md-6">
          <PhotoProvider>
            <PhotoView
              src={foodDetails?.file}
              className="object-fit-cover w-100 h-100"
            >
              <img
                src={foodDetails?.file}
                className="card-img-top mb-5 mb-md-0 rounded"
                alt="Img detail"
                width={500}
                height={500}
                style={{ cursor: "pointer" }}
              />
            </PhotoView>
          </PhotoProvider>
        </div>
        <div className="col-md-6">
          <div className="badge bg-warning text-dark p-2 rounded-pill mb-3 text-uppercase">
            {foodDetails?.category}
          </div>
          <h1 className="display-5 fw-bolder">{foodDetails?.name}</h1>
          <div className="fs-5 mb-5">
            <span className="text-decoration-line-through">
              ${foodDetails?.price}
            </span>
            <span className="ms-2">${foodDetails?.price}</span>
          </div>
          <p className="lead">{foodDetails?.description}</p>
          <div className="d-flex">
            <input
              className="form-control text-center me-3"
              id="inputQuantity"
              type="num"
              value={getCurrentQuantity(id)}
              readOnly
              style={{ maxWidth: "3rem" }}
            />
            {getCurrentQuantity(id) > 0 ? (
              <div className="d-flex align-items-center gap-2 w-100">
                <button
                  className="btn btn-primary btn-sm h-auto fw-bold"
                  style={{ width: "50px", height: "50px" }}
                  onClick={() => decreaseQuantity(id)}
                >
                  -
                </button>
                <button
                  className="btn btn-primary btn-sm h-auto fw-bold"
                  style={{ width: "50px", height: "50px" }}
                  onClick={() => increaseQuantity(id)}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                className="btn btn-outline-dark flex-shrink-0"
                type="button"
                onClick={() => handleAddToCart(id)}
              >
                <i className="bi-cart-fill me-1"></i>
                Add to cart
              </button>
            )}
          </div>
        </div>
      </div>

      <h1 className="text-center mt-5">The Pre Your Workout Deserves.</h1>
      {/*Review product - Custom Video Player*/}
      <div className="row justify-content-center mt-5">
        <div className="col-12 col-md-8 col-lg-4">
          <div
            className="position-relative rounded-4 overflow-hidden shadow-lg"
            style={{ aspectRatio: "16/9" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-100 h-100 object-fit-cover"
              playsInline
              muted={isMuted}
              onClick={handleVideoClick}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              src="https://res.cloudinary.com/benovel/video/upload/f_webm,vc_vp9/q_auto/if_w_gt_h_mul_9_div_16/c_limit,w_w,ar_9:16/b_blurred:2000:-10,c_pad,h_w_div_9_mul_16,w_w/if_end/if_h_gt_w_mul_16_div_9/c_crop,ar_9:16,w_1.0/if_end/c_limit,h_640,w_480/e_accelerate:25/du_5/ac_none/v1751905057/68191a85448a6a0008d9a58c/videos/ic6yxgcr0cvuf2ghyywo.webm"
            />

            {/* Custom Play Button Overlay */}
            {!isPlaying && (
              <div
                className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center"
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  borderRadius: "50%",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={handleVideoClick}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
                  e.target.style.transform = "translate(-50%, -50%) scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                  e.target.style.transform = "translate(-50%, -50%) scale(1)";
                }}
              >
                <i
                  className="bi bi-play-fill text-white"
                  style={{ fontSize: "2rem", marginLeft: "4px" }}
                ></i>
              </div>
            )}

            {/* Custom Controls */}
            {showControls && (
              <div
                className="position-absolute bottom-0 start-0 end-0 p-3"
                style={{
                  background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                  transition: "opacity 0.3s ease",
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  {/* Play/Pause Button */}
                  <button
                    className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "45px", height: "45px" }}
                    onClick={togglePlay}
                  >
                    <i
                      className={`bi ${
                        isPlaying ? "bi-pause-fill" : "bi-play-fill"
                      }`}
                    ></i>
                  </button>

                  {/* Volume Control */}
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                      onClick={toggleMute}
                    >
                      <i
                        className={`bi ${
                          isMuted ? "bi-volume-mute-fill" : "bi-volume-up-fill"
                        }`}
                      ></i>
                    </button>

                    {/* Video Info */}
                    <span className="text-white small">
                      {isPlaying ? "Playing" : "Paused"} •{" "}
                      {isMuted ? "Muted" : "Unmuted"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-12 col-md-8 col-lg-4">
          <div
            className="position-relative rounded-4 overflow-hidden shadow-lg"
            style={{ aspectRatio: "16/9" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-100 h-100 object-fit-cover"
              playsInline
              muted={isMuted}
              onClick={handleVideoClick}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              src="https://res.cloudinary.com/benovel/video/upload/f_webm,vc_vp9/q_auto/if_w_gt_h_mul_9_div_16/c_limit,w_w,ar_9:16/b_blurred:2000:-10,c_pad,h_w_div_9_mul_16,w_w/if_end/if_h_gt_w_mul_16_div_9/c_crop,ar_9:16,w_1.0/if_end/c_limit,h_640,w_480/e_accelerate:25/du_5/ac_none/v1751549655/68191a85448a6a0008d9a58c/videos/u6qkvy2nesfanjoopigg.webm"
            />

            {/* Custom Play Button Overlay */}
            {!isPlaying && (
              <div
                className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center"
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  borderRadius: "50%",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={handleVideoClick}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
                  e.target.style.transform = "translate(-50%, -50%) scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                  e.target.style.transform = "translate(-50%, -50%) scale(1)";
                }}
              >
                <i
                  className="bi bi-play-fill text-white"
                  style={{ fontSize: "2rem", marginLeft: "4px" }}
                ></i>
              </div>
            )}

            {/* Custom Controls */}
            {showControls && (
              <div
                className="position-absolute bottom-0 start-0 end-0 p-3"
                style={{
                  background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                  transition: "opacity 0.3s ease",
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  {/* Play/Pause Button */}
                  <button
                    className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "45px", height: "45px" }}
                    onClick={togglePlay}
                  >
                    <i
                      className={`bi ${
                        isPlaying ? "bi-pause-fill" : "bi-play-fill"
                      }`}
                    ></i>
                  </button>

                  {/* Volume Control */}
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                      onClick={toggleMute}
                    >
                      <i
                        className={`bi ${
                          isMuted ? "bi-volume-mute-fill" : "bi-volume-up-fill"
                        }`}
                      ></i>
                    </button>

                    {/* Video Info */}
                    <span className="text-white small">
                      {isPlaying ? "Playing" : "Paused"} •{" "}
                      {isMuted ? "Muted" : "Unmuted"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-12 col-md-8 col-lg-4">
          <div
            className="position-relative rounded-4 overflow-hidden shadow-lg"
            style={{ aspectRatio: "16/9" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-100 h-100 object-fit-cover"
              playsInline
              muted={isMuted}
              onClick={handleVideoClick}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              src="https://res.cloudinary.com/benovel/video/upload/f_webm,vc_vp9/q_auto/if_w_gt_h_mul_9_div_16/c_limit,w_w,ar_9:16/b_blurred:2000:-10,c_pad,h_w_div_9_mul_16,w_w/if_end/if_h_gt_w_mul_16_div_9/c_crop,ar_9:16,w_1.0/if_end/c_limit,h_640,w_480/e_accelerate:25/du_5/ac_none/v1748958674/68191a85448a6a0008d9a58c/videos/ludllvlirt3ieuq0o76u.webm"
            />

            {/* Custom Play Button Overlay */}
            {!isPlaying && (
              <div
                className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center"
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  borderRadius: "50%",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={handleVideoClick}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
                  e.target.style.transform = "translate(-50%, -50%) scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                  e.target.style.transform = "translate(-50%, -50%) scale(1)";
                }}
              >
                <i
                  className="bi bi-play-fill text-white"
                  style={{ fontSize: "2rem", marginLeft: "4px" }}
                ></i>
              </div>
            )}

            {/* Custom Controls */}
            {showControls && (
              <div
                className="position-absolute bottom-0 start-0 end-0 p-3"
                style={{
                  background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                  transition: "opacity 0.3s ease",
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  {/* Play/Pause Button */}
                  <button
                    className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "45px", height: "45px" }}
                    onClick={togglePlay}
                  >
                    <i
                      className={`bi ${
                        isPlaying ? "bi-pause-fill" : "bi-play-fill"
                      }`}
                    ></i>
                  </button>

                  {/* Volume Control */}
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                      onClick={toggleMute}
                    >
                      <i
                        className={`bi ${
                          isMuted ? "bi-volume-mute-fill" : "bi-volume-up-fill"
                        }`}
                      ></i>
                    </button>

                    {/* Video Info */}
                    <span className="text-white small">
                      {isPlaying ? "Playing" : "Paused"} •{" "}
                      {isMuted ? "Muted" : "Unmuted"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
