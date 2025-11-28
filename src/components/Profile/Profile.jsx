import React, { useCallback, useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { getCurrentUser, updateProfile } from "../../services/AuthServices";
import { toast } from "react-toastify";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { convertToBase64,formatDate } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user, token, setUser } = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [avatarUploadSuccess, setAvatarUploadSuccess] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    role: "",
    avatar: "",
    isActive: false,
    isEmailVerified: false,
  });

  const fetchUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      if (response?.success) {
        setUser(response?.data?.user);
        toast.success(`${response?.message}`);
      } else {
        toast.error(`${response?.data?.message}`);
      }
    } catch (error) {
      toast.error(`${error?.response?.message}`);
    }
  }, []);

  const handleChange = async (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file" && files && files[0]) {
      setIsLoading(true);
      setAvatarUploadSuccess(false);
      try {
        const base64 = await convertToBase64(files[0], 200, 200, 0.7);
        setData((prevData) => ({
          ...prevData,
          [name]: base64,
        }));
        setAvatarUploadSuccess(true);
        toast.success("Avatar uploaded successfully!");
      } catch (error) {
        toast.error("Lỗi khi upload file!");
      } finally {
        setIsLoading(false);
      }
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleEdit = (e) => {
    if (user) {
      setData({
        name: user.name,
        email: user.email || "",
        role: user.role || "",
        avatar: user.avatar || "",
        createdAt: user.createdAt || "",
        updatedAt: user.updatedAt || "",
        isActive: user.isActive || false,
        isEmailVerified: user.isEmailVerified || false,
      });
    }
    setIsUpdate(!isUpdate);
  };

  const handleCancel = (e) => {
    setData({
      name: "",
      email: "",
      role: "",
      avatar: "",
      createdAt: "",
      updatedAt: "",
      isActive: false,
      isEmailVerified: false,
    });
    setAvatarUploadSuccess(false);
    setIsUpdate(!isUpdate);
  };

  const handleSubmit = async (e) => {
    console.log({ data })
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await updateProfile(data);
      if (response?.success) {
        toast.success(response?.message);
        setAvatarUploadSuccess(false);
        setIsUpdate(false);
        fetchUser();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  useEffect(() => {
    if (user && isUpdate) {
      setData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        avatar: user.avatar || "",
        createdAt: user.createdAt || "",
        updatedAt: user.updatedAt || "",
        isActive: user.isActive || false,
        isEmailVerified: user.isEmailVerified || false,
      });
    }
  }, [user, isUpdate]);



  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
      background: 'linear-gradient(135deg,rgb(188, 188, 184) 0%,rgb(199, 190, 190) 100%)',
      padding: '2rem 0'
    }}>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            {/* Header with Back Button */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <button
                className="btn btn-outline-light btn-sm d-flex align-items-center"
                onClick={() => navigate("/")}
                style={{
                  borderRadius: '25px',
                  padding: '0.5rem 1rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateX(-5px)';
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateX(0)';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back
              </button>
            </div>

            {/* Main Profile Card */}
            <div className="card shadow-lg border-0" style={{
              borderRadius: '20px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg,rgb(250, 250, 248) 0%,rgb(215, 208, 208) 100%)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="row g-0">
                {/* Profile Image Section */}
                <div className="col-12 col-md-4 d-flex flex-column align-items-center p-4" style={{
                  background: 'linear-gradient(135deg,rgb(250, 250, 248) 0%,rgb(215, 208, 208) 100%)',
                  color: 'white'
                }}>
                  <div className="position-relative mb-3">
                    <PhotoProvider>
                      <PhotoView
                        src={data?.avatar || user?.avatar || assets?.profile}
                        className="object-fit-cover w-100 h-100"
                      >
                        <div
                          className="rounded-circle shadow-lg overflow-hidden position-relative"
                          style={{
                            width: "180px",
                            height: "180px",
                            border: '4px solid rgba(255,255,255,0.3)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                          }}
                        >
                          <img
                            src={data?.avatar || user?.avatar || assets?.profile}
                            alt="profile"
                            className="w-100 h-100"
                            style={{
                              objectFit: "cover",
                            }}
                          />
                          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                            style={{
                              background: 'rgba(0,0,0,0.3)',
                              opacity: 0,
                              transition: 'opacity 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.opacity = '1'}
                            onMouseOut={(e) => e.target.style.opacity = '0'}
                          >
                            <i className="fas fa-camera text-white fs-4"></i>
                          </div>
                        </div>
                      </PhotoView>
                    </PhotoProvider>
                  </div>

                  <h4 className="fw-bold mb-2 text-center">
                    {user?.name}
                  </h4>

                  <div className="d-flex align-items-center mb-3">
                    <span className={`badge px-3 py-2 rounded-pill ${user?.role === 'admin' ? 'bg-danger' : 'bg-primary'
                      }`} style={{ fontSize: '0.9rem' }}>
                      <i className={`fas ${user?.role === 'admin' ? 'fa-crown' : 'fa-user'} me-1`}></i>
                      {user?.role?.toUpperCase()}
                    </span>
                  </div>

                  <div className="d-flex gap-2 justify-content-center align-items-center">
                    <button className="btn btn-light btn-sm rounded-pill px-3">
                      <i className="fas fa-heart me-1"></i>
                      Follow
                    </button>
                    {isUpdate ? (
                      <button
                        className="btn btn-danger btn-sm rounded-pill px-3"
                        onClick={() => handleCancel()}
                        style={{ transition: 'all 0.3s ease' }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        <i className="fas fa-times me-1"></i>
                        Cancel
                      </button>
                    ) : (
                      <button
                        className="btn btn-light btn-sm rounded-pill px-3"
                        onClick={() => handleEdit()}
                        style={{ transition: 'all 0.3s ease' }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        <i className="fas fa-edit me-1"></i>
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Information Section */}
                <div className="col-12 col-md-8 p-4">
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary rounded-circle p-2 me-3">
                      <i className="fas fa-user-cog text-white"></i>
                    </div>
                    <h3 className="mb-0 fw-bold text-dark">Profile Information</h3>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-12 col-lg-6">
                        {isUpdate ? (
                          <>
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={data?.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                style={{ borderRadius: '10px' }}
                              />
                              <label htmlFor="name">
                                <i className="fas fa-user me-2"></i>
                                Username
                              </label>
                            </div>

                            <div className="form-floating mb-3">
                              <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={data?.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                style={{ borderRadius: '10px' }}
                              />
                              <label htmlFor="email">
                                <i className="fas fa-envelope me-2"></i>
                                Email Address
                              </label>
                            </div>

                            <div className="mb-3">
                              <label htmlFor="avatar" className="form-label fw-semibold">
                                <i className="fas fa-image me-2"></i>
                                Profile Picture
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                id="avatar"
                                name="avatar"
                                accept="image/*"
                                onChange={handleChange}
                                style={{ borderRadius: '10px' }}
                              />
                              {avatarUploadSuccess && (
                                <p className="alert alert-success mt-2 py-2 fs-6" style={{ borderRadius: '10px' }}>
                                  <i className="bi bi-check-circle me-2"></i>
                                  Image uploaded successfully!
                                </p>
                              )}
                              {isLoading && (
                                <p className="alert alert-info mt-2 py-2 fs-6" style={{ borderRadius: '10px' }}>
                                  <i className="bi bi-arrow-repeat me-2"></i>
                                  Processing image...
                                </p>
                              )}
                            </div>

                            {user?.role === 'admin' && (
                              <div className="form-floating mb-3">
                                <select
                                  className="form-select"
                                  id="role"
                                  name="role"
                                  value={data?.role}
                                  onChange={handleChange}
                                  style={{ borderRadius: '10px' }}
                                >
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                </select>
                                <label htmlFor="role">
                                  <i className="fas fa-user-tag me-2"></i>
                                  User Role
                                </label>
                              </div>
                            )}

                          </>
                        ) : (
                          <>
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={user?.name}
                                readOnly
                                style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}
                              />
                              <label htmlFor="name">
                                <i className="fas fa-user me-2"></i>
                                Username
                              </label>
                            </div>

                            <div className="form-floating mb-3">
                              <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={user?.email || ""}
                                readOnly
                                style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}
                              />
                              <label htmlFor="email">
                                <i className="fas fa-envelope me-2"></i>
                                Email Address
                              </label>
                            </div>

                            <div className="mb-3">
                              <label htmlFor="avatar" className="form-label fw-semibold">
                                <i className="fas fa-image me-2"></i>
                                Profile Picture
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                id="avatar"
                                name="avatar"
                                accept="image/*"
                                onChange={handleChange}
                                style={{ borderRadius: '10px' }}
                                disabled
                              />
                              {avatarUploadSuccess && (
                                <p className="alert alert-success mt-2 py-2 fs-6" style={{ borderRadius: '10px' }}>
                                  <i className="bi bi-check-circle me-2"></i>
                                  Image uploaded successfully!
                                </p>
                              )}
                              {isLoading && (
                                <p className="alert alert-info mt-2 py-2 fs-6" style={{ borderRadius: '10px' }}>
                                  <i className="bi bi-arrow-repeat me-2"></i>
                                  Processing image...
                                </p>
                              )}
                            </div>

                            {user?.role === 'admin' && (
                              <div className="form-floating mb-3">
                                <select
                                  className="form-select"
                                  id="role"
                                  name="role"
                                  value={data?.role}
                                  onChange={handleChange}
                                  style={{ borderRadius: '10px' }}
                                >
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                </select>
                                <label htmlFor="role">
                                  <i className="fas fa-user-tag me-2"></i>
                                  User Role
                                </label>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <div className="col-12 col-lg-6">
                        {isUpdate ? (
                          <>
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="createdAt"
                                value={
                                  formatDate(data?.createdAt)
                                }
                                readOnly
                                disabled
                                style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}
                              />
                              <label htmlFor="createdAt">
                                <i className="fas fa-calendar-plus me-2"></i>
                                Created Date
                              </label>
                            </div>

                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="updatedAt"
                                value={
                                  formatDate(data?.updatedAt)
                                }
                                readOnly
                                disabled
                                style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}
                              />
                              <label htmlFor="updatedAt">
                                <i className="fas fa-calendar-check me-2"></i>
                                Last Updated
                              </label>
                            </div>

                            {user?.role === 'admin' && (
                              <div className="card mb-3" style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
                                <div className="card-body py-3">
                                  <div className="form-check form-switch">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name="isActive"
                                      id="isActive"
                                      defaultChecked={data?.isActive}
                                      onChange={handleChange}
                                      style={{ transform: 'scale(1.2)' }}
                                    />
                                    <label className="form-check-label fw-semibold" htmlFor="isActive">
                                      <i className="fas fa-toggle-on me-2 text-success"></i>
                                      Account Active
                                    </label>
                                  </div>
                                </div>
                              </div>
                            )}

                          </>
                        ) : (
                          <>
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="createdAt"
                                defaultValue={
                                  formatDate(user?.createdAt)
                                }
                                readOnly
                                disabled
                                style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}
                              />
                              <label htmlFor="createdAt">
                                <i className="fas fa-calendar-plus me-2"></i>
                                Created Date
                              </label>
                            </div>

                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="updatedAt"
                                defaultValue={
                                  formatDate(user?.updatedAt)
                                }
                                readOnly
                                disabled
                                style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}
                              />
                              <label htmlFor="updatedAt">
                                <i className="fas fa-calendar-check me-2"></i>
                                Last Updated
                              </label>
                            </div>

                            {user?.role === 'admin' && (
                              <div className="card mb-3" style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
                                <div className="card-body py-3">
                                  <div className="form-check form-switch">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      defaultValue={user?.isActive}
                                      name="isActive"
                                      id="isActive"
                                      defaultChecked={user?.isActive}
                                      onChange={handleChange}
                                      style={{ transform: 'scale(1.2)' }}
                                    />
                                    <label className="form-check-label fw-semibold" htmlFor="isActive">
                                      <i className="fas fa-toggle-on me-2 text-success"></i>
                                      Account Active
                                    </label>
                                  </div>
                                </div>
                              </div>
                            )}

                            {user?.role === 'admin' && (
                              <div className="card mb-3" style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
                                <div className="card-body py-3">
                                  <div className="form-check form-switch">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      defaultValue={user?.isEmailVerified}
                                      name="isEmailVerified"
                                      id="isEmailVerified"
                                      defaultChecked={user?.isEmailVerified}
                                      onChange={handleChange}
                                      style={{ transform: 'scale(1.2)' }}
                                    />
                                    <label className="form-check-label fw-semibold" htmlFor="isEmailVerified">
                                      <i className="fas fa-envelope-open-text me-2 text-primary"></i>
                                      Email Verified
                                    </label>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Submit Button with Animation */}
                    <div className="text-center mt-4" style={{
                      overflow: 'hidden',
                      transition: 'all 0.3s ease-in-out',
                      transform: isUpdate ? 'translateY(0)' : 'translateY(30px)'
                    }}>
                      <button
                        type="submit"
                        className={`btn btn-sm btn-primary px-3 py-2 ${isUpdate
                          ? 'btn-primary slide-up-animation'
                          : 'btn-outline-primary'
                          }`}
                        disabled={isLoading || !isUpdate}
                        style={{
                          borderRadius: '25px',
                          transition: 'all 0.3s ease',
                          boxShadow: isUpdate ? '0 4px 15px rgba(13, 110, 253, 0.3)' : 'none',
                          opacity: isUpdate ? 1 : 0,
                          transform: isUpdate ? 'translateY(0)' : 'translateY(30px)',
                          pointerEvents: isUpdate ? 'auto' : 'none'
                        }}
                        onMouseOver={(e) => {
                          if (isUpdate && !isLoading) {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(13, 110, 253, 0.4)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (isUpdate && !isLoading) {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(13, 110, 253, 0.3)';
                          }
                        }}
                      >
                        {isLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            <i className="bi bi-arrow-repeat"></i>
                            Updating Profile...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-arrow-repeat me-2"></i>
                            Update Profile
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
