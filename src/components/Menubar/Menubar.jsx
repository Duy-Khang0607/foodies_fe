import React, { useContext, useCallback } from "react";
import { assets } from "../../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const dropdownStyle = `
  @keyframes slideDown {
    0% {
      opacity: 0;
      transform: translateY(-15px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = dropdownStyle;
  document.head.appendChild(style);
}
const Menubar = () => {
  const { token, user,logout,quantity,cart } = useContext(StoreContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Đăng xuất thành công");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light fixed-top h-auto w-100 shadow-sm bg-light"
    >
      <div className="container-fluid mx-5">
        <Link to="/">
          <img
            src={assets?.checkout}
            alt="logo"
            width={80}
            height={80}
            className="object-fit-cover"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className={`nav-item`}>
              <Link
                className={`nav-link ${pathname === "/" ? "active" : ""}`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className={`nav-item`}>
              <Link
                className={`nav-link ${pathname === "/explore" ? "active" : ""
                  }`}
                to="/explore"
              >
                Explore
              </Link>
            </li>
            <li className={`nav-item`}>
              <Link
                className={`nav-link ${pathname === "/contact" ? "active" : ""
                  }`}
                to="/contact"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="d-flex flex-row gap-3 justify-content-end align-items-center">
          <div className="position-relative">
            <Link to="/cart">
              <img
                src={assets.cart}
                alt="logo"
                width={30}
                height={30}
                className="object-fit-cover"
                number={quantity}
              />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cart?.length > 0
                  ? cart?.reduce((acc, curr) => acc + curr.quantity, 0)
                  : 0}
                <span className="visually-hidden">unread messages</span>
              </span>
            </Link>
          </div>
          {token && user !== null ? (
            <div className="dropdown">
              <button
                className="btn dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  border: "none",
                  background: "transparent",
                  padding: "6px",
                  borderRadius: "50%",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(0,0,0,0.05)";
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <img
                  src={assets?.profile}
                  alt="profile"
                  width={36}
                  height={36}
                  className="object-fit-cover rounded-circle"
                  style={{
                    border: "2px solid #e5e7eb",
                    transition: "all 0.3s ease"
                  }}
                />
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end shadow-lg border-0"
                aria-labelledby="dropdownMenuButton"
                style={{
                  minWidth: '220px',
                  borderRadius: '12px',
                  padding: '12px 8px',
                  backgroundColor: '#fff',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  animation: 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transformOrigin: 'top',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {/* User Info Header */}
                <li className="px-3 py-2 mb-2">
                  <div
                    className="d-flex align-items-center p-2 rounded"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white'
                    }}
                  >
                    <img
                      src={assets?.profile}
                      alt="profile"
                      width={40}
                      height={40}
                      className="object-fit-cover rounded-circle me-3"
                      style={{ border: '2px solid rgba(255,255,255,0.3)' }}
                    />
                    <div>
                      <div className="fw-semibold" style={{ fontSize: '14px' }}>
                        {user?.name || 'User'}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>
                        {user?.email || 'user@example.com'}
                      </div>
                    </div>
                  </div>
                </li>

                <li><hr className="dropdown-divider my-2" style={{ margin: '8px 0' }} /></li>

                {/* Quản lý admin */}
                {user?.role === "admin" && (
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center py-2 px-3"
                      to="/admin"
                      style={{
                        borderRadius: '8px',
                        margin: '2px 4px',
                        transition: 'all 0.2s ease',
                        color: '#374151',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f3f4f6';
                        e.target.style.color = '#1f2937';
                        e.target.style.transform = 'translateX(4px)';
                        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        const icon = e.target.querySelector('i');
                        if (icon) icon.style.color = '#3b82f6';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#374151';
                        e.target.style.transform = 'translateX(0)';
                        e.target.style.boxShadow = 'none';
                        const icon = e.target.querySelector('i');
                        if (icon) icon.style.color = '#6b7280';
                      }}
                    >
                      <i className="fas fa-user me-3" style={{ width: '16px', color: '#6b7280' }}></i>
                      <span className="fw-medium">Management</span>
                    </Link>
                  </li>
                )}

                {/* Profile Link */}
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center py-2 px-3"
                    to="/profile"
                    style={{
                      borderRadius: '8px',
                      margin: '2px 4px',
                      transition: 'all 0.2s ease',
                      color: '#374151',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f3f4f6';
                      e.target.style.color = '#1f2937';
                      e.target.style.transform = 'translateX(4px)';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      const icon = e.target.querySelector('i');
                      if (icon) icon.style.color = '#3b82f6';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#374151';
                      e.target.style.transform = 'translateX(0)';
                      e.target.style.boxShadow = 'none';
                      const icon = e.target.querySelector('i');
                      if (icon) icon.style.color = '#6b7280';
                    }}
                  >
                    <i className="fas fa-user me-3" style={{ width: '16px', color: '#6b7280' }}></i>
                    <span className="fw-medium">Profile</span>
                  </Link>
                </li>

                {/* Change Password Link */}
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center py-2 px-3"
                    to="/change-password"
                    style={{
                      borderRadius: '8px',
                      margin: '2px 4px',
                      transition: 'all 0.2s ease',
                      color: '#374151',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f3f4f6';
                      e.target.style.color = '#1f2937';
                      e.target.style.transform = 'translateX(4px)';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      const icon = e.target.querySelector('i');
                      if (icon) icon.style.color = '#3b82f6';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#374151';
                      e.target.style.transform = 'translateX(0)';
                      e.target.style.boxShadow = 'none';
                      const icon = e.target.querySelector('i');
                      if (icon) icon.style.color = '#6b7280';
                    }}
                  >
                    <i className="fas fa-key me-3" style={{ width: '16px', color: '#6b7280' }}></i>
                    <span className="fw-medium">Change Password</span>
                  </Link>
                </li>

                <li><hr className="dropdown-divider my-2" style={{ margin: '8px 0' }} /></li>

                {/* Logout Link */}
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center py-2 px-3 text-danger"
                    onClick={handleLogout}
                    style={{
                      borderRadius: '8px',
                      margin: '2px 4px',
                      transition: 'all 0.2s ease',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#fef2f2';
                      e.target.style.color = '#dc2626';
                      e.target.style.transform = 'translateX(4px)';
                      e.target.style.boxShadow = '0 2px 8px rgba(220,38,38,0.2)';
                      const icon = e.target.querySelector('i');
                      if (icon) icon.style.color = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#dc2626';
                      e.target.style.transform = 'translateX(0)';
                      e.target.style.boxShadow = 'none';
                      const icon = e.target.querySelector('i');
                      if (icon) icon.style.color = '#dc2626';
                    }}
                  >
                    <i className="fas fa-sign-out-alt me-3" style={{ width: '16px' }}></i>
                    <span className="fw-medium">Logout</span>
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="btn btn-outline-primary">Login</button>
              </Link>
              <Link to="/signup">
                <button className="btn btn-outline-success">Signup</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
