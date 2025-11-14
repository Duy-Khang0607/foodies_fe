import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Sidebar = ({ isSidebar }) => {
  const { pathname } = useLocation();
  return (
    <div className={`border-end bg-white ${isSidebar ? 'closed' : ''}`} id="sidebar-wrapper">
      <div className="list-group list-group-flush">
        <div className="sidebar-heading border-bottom bg-light">
          <Link to="/" className='text-decoration-none text-dark'>
            <img src={assets?.checkout} alt="logo" className='img-fluid object-fit-cover w-auto h-auto' />
          </Link>
        </div>
        <div className="list-group list-group-flush">
          <Link
            className={`nav-link list-group-item list-group-item-action list-group-item-light p-3 ${pathname === "/admin/list-food" ? "active" : ""
              }`}
            to="/admin/list-food"
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-list me-2"></i>
              <span>List Food</span>
            </div>
          </Link>
          <Link
            className={`nav-link list-group-item list-group-item-action list-group-item-light p-3 ${pathname === "/admin/add-food" ? "active" : ""
              }`}
            to="/admin/add-food"
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-bag-plus-fill me-2"></i>
              <span>Add Food</span>
            </div>
          </Link>
          <Link
            className={`nav-link list-group-item list-group-item-action list-group-item-light p-3 ${pathname === "/admin/order-food" ? "active" : ""
              }`}
            to="/admin/order-food"
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-cart-check-fill me-2"></i>
              <span>Order Food</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar