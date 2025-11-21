import React, { useEffect, useState } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import { formatDate } from '../../utils/formatDate';
import { assets } from '../../assets/assets';
import { convertToBase64 } from '../../utils/convertToBase64';
import { toast } from 'react-toastify';
import { updateProfile } from '../../services/AuthServices';

const EditAccount = ({ isOpen, onClose, userData, fetchUser }) => {
    const [isAnimating, setIsAnimating] = useState(false)
    const [isCancel, setIsCancel] = useState(false)
    const [loading, setLoading] = useState(false)
    const [avatarUploadSuccess, setAvatarUploadSuccess] = useState(false);
    const [error, setError] = useState({
        name: "",
        email: "",
        avatar: "",
        role: "",
        createdAt: "",
        updatedAt: "",
        isActive: "",
        isEmailVerified: "",
    });
    const [data, setData] = useState({
        _id: "",
        name: "",
        email: "",
        role: "",
        avatar: "",
        createdAt: "",
        updatedAt: "",
        isActive: false,
        isEmailVerified: false,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError({
            name: "",
            email: "",
            avatar: "",
            role: "",
            createdAt: "",
            updatedAt: "",
            isActive: "",
            isEmailVerified: "",
        });

        try {
            const response = await updateProfile(data);
            console.log({ response })
            if (response?.success) {
                toast.success(response?.message);
                setAvatarUploadSuccess(false);
                onClose();
                await fetchUser();
            } else {
                toast.error(response?.message);
                // Xử lý lỗi từ API
                const errorMessage = response?.message || "Có lỗi xảy ra";
                
                // Parse lỗi dựa trên message từ API để xác định field bị lỗi
                if (errorMessage.toLowerCase().includes('email')) {
                    setError(prev => ({ ...prev, email: errorMessage }));
                } else if (errorMessage.toLowerCase().includes('tên') || errorMessage.toLowerCase().includes('name')) {
                    setError(prev => ({ ...prev, name: errorMessage }));
                } else if (errorMessage.toLowerCase().includes('avatar')) {
                    setError(prev => ({ ...prev, avatar: errorMessage }));
                } else if (errorMessage.toLowerCase().includes('role') || errorMessage.toLowerCase().includes('vai trò')) {
                    setError(prev => ({ ...prev, role: errorMessage }));
                } else {
                    // Nếu không xác định được field cụ thể, hiển thị toast
                    toast.error(errorMessage);
                }
            }
        } catch (error) {
            toast.error(error?.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    }

    const handleChange = async (e) => {
        const { name, value, type, checked, files } = e.target;

        setError((prevError) => ({
            ...prevError,
            [name]: "",
        }));

        if (type === "file" && files && files[0]) {
            setLoading(true);
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
                setError((prevError) => ({
                    ...prevError,
                    avatar: error?.message || "Lỗi khi upload file!",
                }));
            } finally {
                setLoading(false);
            }
        } else {
            setData((prevData) => ({
                ...prevData,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleCancel = () => {
        setIsCancel(true)
        // Đợi animation hoàn thành (500ms) trước khi đóng modal
        setTimeout(() => {
            onClose()
            setIsCancel(false)
        }, 500)
    }
    
    useEffect(() => {
        if (userData) {
            setData({
                _id: userData?._id || "",
                name: userData?.name || "",
                email: userData?.email || "",
                role: userData?.role || "",
                avatar: userData?.avatar || "",
                createdAt: userData?.createdAt || "",
                updatedAt: userData?.updatedAt || "",
                isActive: userData?.isActive || false,
                isEmailVerified: userData?.isEmailVerified || false,
            });
        }

        if (isOpen) {
            setIsCancel(false) // Reset isCancel khi mở modal
            setTimeout(() => setIsAnimating(true), 10);
            setError({
                name: "",
                email: "",
                avatar: "",
                role: "",
                createdAt: "",
                updatedAt: "",
                isActive: "",
                isEmailVerified: "",
            });
            setAvatarUploadSuccess(false);
        }

        return () => setIsAnimating(false)

    }, [isOpen, userData])

    if (!isOpen) return null

    return (
        <>
            <div
                className={`position-fixed top-0 start-0 w-100 h-100 bg-dark`}
                style={{
                    zIndex: 999,
                    opacity: isCancel ? 0 : isAnimating ? 0.5 : 0,
                    transition: 'opacity 0.5s ease-in-out'
                }}
                onClick={handleCancel}
            />

            {/* Modal */}
            <div
                className="modal d-block"
                tabIndex="-1"
                role="dialog"
            >
                <div
                    className="modal-dialog modal-xl modal-dialog-centered"
                    role="document"
                    style={{
                        transform: isCancel ? 'translateY(-100%)' : isAnimating ? 'translateY(0)' : 'translateY(-100%)',
                        opacity: isCancel ? 0 : isAnimating ? 1 : 0,
                        transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.5s ease-in-out'
                    }}>
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Account</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleCancel}
                                aria-label="Close"
                                style={{ cursor: 'pointer', transform: isCancel ? 'translateY(-100%)' : !isAnimating ? 'translateY(-100%)' : 'translateY(0)' }}
                            ></button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body">
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
                                                    src={data?.avatar || assets?.profile}
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
                                                            src={data?.avatar || assets?.profile}
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
                                            {data?.name}
                                        </h4>

                                        <div className="d-flex align-items-center mb-3">
                                            <span className={`badge px-3 py-2 rounded-pill ${data?.role === 'admin' ? 'bg-danger' : 'bg-primary'
                                                }`} style={{ fontSize: '0.9rem' }}>
                                                <i className={`fas ${data?.role === 'admin' ? 'fa-crown' : 'fa-user'} me-1`}></i>
                                                {data?.role?.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="d-flex gap-2 justify-content-center align-items-center">
                                            <button className="btn btn-light btn-sm rounded-pill px-3">
                                                <i className="fas fa-heart me-1"></i>
                                                Follow
                                            </button>
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

                                        <form>
                                            <div className="row g-3">
                                                <div className="col-12 col-lg-6">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="name"
                                                            name="name"
                                                            value={data?.name}
                                                            onChange={handleChange}
                                                            style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}
                                                        />
                                                        <label htmlFor="name">
                                                            <i className="fas fa-user me-2"></i>
                                                            Name
                                                        </label>
                                                        {error?.name && (
                                                            <p className='text-danger fs-6'>{error?.name}</p>
                                                        )}
                                                    </div>

                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            id="email"
                                                            name="email"
                                                            value={data?.email}
                                                            onChange={handleChange}
                                                            style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}
                                                        />
                                                        <label htmlFor="email">
                                                            <i className="fas fa-envelope me-2"></i>
                                                            Email Address
                                                        </label>
                                                        {error?.email && (
                                                            <p className="alert alert-danger mt-2 py-2 fs-6" style={{ borderRadius: '10px' }}>
                                                                <i className="bi bi-exclamation-triangle me-2"></i>
                                                                {error?.email}
                                                            </p>
                                                        )}
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
                                                        {loading && (
                                                            <p className="alert alert-info mt-2 py-2 fs-6" style={{ borderRadius: '10px' }}>
                                                                <i className="bi bi-arrow-repeat me-2"></i>
                                                                Processing image...
                                                            </p>
                                                        )}
                                                        {error?.avatar && (
                                                            <p className="alert alert-danger mt-2 py-2 fs-6" style={{ borderRadius: '10px' }}>
                                                                <i className="bi bi-exclamation-triangle me-2"></i>
                                                                {error?.avatar}
                                                            </p>
                                                        )}
                                                    </div>


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
                                                        {error?.role && (
                                                            <p className="alert alert-danger mt-2 py-2 fs-6" style={{ borderRadius: '10px' }}>
                                                                <i className="bi bi-exclamation-triangle me-2"></i>
                                                                {error?.role}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-12 col-lg-6">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="createdAt"
                                                            value={formatDate(data?.createdAt)}
                                                            readOnly
                                                            disabled
                                                            style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}
                                                        />
                                                        <label htmlFor="createdAt">
                                                            <i className="fas fa-calendar-plus me-2"></i>
                                                            Created Date
                                                        </label>
                                                        {error?.createdAt && (
                                                            <p className="alert alert-danger mt-2 py-2 fs-6" style={{ borderRadius: '10px' }}>
                                                                <i className="bi bi-exclamation-triangle me-2"></i>
                                                                {error?.createdAt}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="updatedAt"
                                                            value={formatDate(data?.updatedAt)}
                                                            readOnly
                                                            disabled
                                                            style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}
                                                        />
                                                        <label htmlFor="updatedAt">
                                                            <i className="fas fa-calendar-check me-2"></i>
                                                            Last Updated
                                                        </label>
                                                        {error?.updatedAt && (
                                                            <p className="alert alert-danger mt-2 py-2 fs-6" style={{ borderRadius: '10px' }}>
                                                                <i className="bi bi-exclamation-triangle me-2"></i>
                                                                {error?.updatedAt}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="card mb-3" style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
                                                        <div className="card-body py-3">
                                                            <div className="form-check form-switch">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    name="isActive"
                                                                    id="isActive"
                                                                    checked={data?.isActive}
                                                                    onChange={handleChange}
                                                                    style={{ transform: 'scale(1.2)' }}
                                                                />
                                                                <label className="form-check-label fw-semibold" htmlFor="isActive">
                                                                    <i className="fas fa-toggle-on me-2 text-success"></i>
                                                                    Account Active
                                                                </label>
                                                            </div>
                                                            {error?.isActive && (
                                                                <p className="alert alert-danger mt-2 py-2 fs-6" style={{ borderRadius: '10px' }}>
                                                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                                                    {error?.isActive}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="card mb-3" style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
                                                        <div className="card-body py-3">
                                                            <div className="form-check form-switch">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    name="isEmailVerified"
                                                                    id="isEmailVerified"
                                                                    checked={data?.isEmailVerified}
                                                                    onChange={handleChange}
                                                                    style={{ transform: 'scale(1.2)' }}
                                                                />
                                                                <label className="form-check-label fw-semibold" htmlFor="isEmailVerified">
                                                                    <i className="fas fa-envelope-open-text me-2 text-primary"></i>
                                                                    Email Verified
                                                                </label>
                                                            </div>
                                                            {error?.isEmailVerified && (
                                                                <p className="alert alert-danger mt-2 py-2 fs-6" style={{ borderRadius: '10px' }}>
                                                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                                                    {error?.isEmailVerified}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSubmit}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditAccount