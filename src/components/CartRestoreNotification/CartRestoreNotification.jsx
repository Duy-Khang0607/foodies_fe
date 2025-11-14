import React, { useState, useEffect } from 'react'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'

const CartRestoreNotification = () => {
    const { cart, user, token } = useContext(StoreContext)
    const [showNotification, setShowNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')

    useEffect(() => {
        // Chỉ hiển thị thông báo khi user đã login và có cart items
        if (token && user && cart.length > 0) {
            // Kiểm tra nếu cart được khôi phục từ localStorage
            const savedCart = localStorage.getItem('cart')
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart)
                if (parsedCart.length > 0) {
                    setNotificationMessage(`Welcome back! Your cart with ${cart.length} items has been restored.`)
                    setShowNotification(true)
                    
                    // Auto hide sau 5 giây
                    setTimeout(() => {
                        setShowNotification(false)
                    }, 5000)
                }
            }
        }
    }, [token, user, cart])

    const handleClose = () => {
        setShowNotification(false)
    }

    if (!showNotification) return null

    return (
        <div 
            className="position-fixed top-0 start-50 translate-middle-x p-3"
            style={{ 
                zIndex: 9999,
                animation: 'slideDown 0.5s ease-out'
            }}
        >
            <div 
                className="alert alert-success alert-dismissible fade show shadow-lg"
                style={{
                    minWidth: '300px',
                    border: 'none',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    color: 'white',
                    boxShadow: '0 8px 32px rgba(40, 167, 69, 0.3)'
                }}
                role="alert"
            >
                <div className="d-flex align-items-center">
                    <div className="me-3">
                        <i className="fas fa-shopping-cart fs-4"></i>
                    </div>
                    <div className="flex-grow-1">
                        <h6 className="alert-heading mb-1 fw-bold">
                            <i className="fas fa-check-circle me-2"></i>
                            Cart Restored!
                        </h6>
                        <p className="mb-0 small">
                            {notificationMessage}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={handleClose}
                        aria-label="Close"
                    ></button>
                </div>
            </div>

            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}

export default CartRestoreNotification
