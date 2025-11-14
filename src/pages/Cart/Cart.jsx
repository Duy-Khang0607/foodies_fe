import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { StoreContext } from '../../context/StoreContext'
import { createPayment } from '../../services/VnpayServices'
import { formatCurrency } from '../../HOC/formatCurrency'
import './cart.css'

const Cart = () => {
    const navigate = useNavigate()
    const { foodList, increaseQuantity, decreaseQuantity, removeFromCart, cart, clearCart } = useContext(StoreContext)
    
    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    // Utility function để xử lý tiền tệ chính xác
    const roundCurrency = (amount) => {
        return Math.round((amount + Number.EPSILON) * 100) / 100;
    }

    // Cart items
    const cartItems = cart.filter(food => food.quantity > 0)
    // Total items
    const totalItems = cartItems.reduce((acc, food) => acc + Number(food.quantity), 0)

    const getCurrentProduct = (id) => {
        // Tìm product từ foodList bằng _id (từ API) hoặc id  
        return foodList?.find(food => food._id === id || food.id === id)
    }

    // Total price - sử dụng utility function để tính chính xác
    const totalPrice = roundCurrency(
        cartItems.reduce((acc, food) => {
            const product = getCurrentProduct(food.id || food._id);
            const price = Number(product?.price) || 0;
            const quantity = Number(food.quantity) || 0;
            return acc + (price * quantity);
        }, 0)
    );

    // Total tax (10%) - làm tròn chính xác
    const totalTax = roundCurrency(totalPrice * 0.1);

    // Total shipping - miễn phí nếu đơn hàng > 1,000,000 VND
    const totalShipping = totalPrice > 100 ? 0 : 10;

    // Total discount
    const totalDiscount = 0;

    // Total payment - tính tổng cuối cùng
    const totalPayment = roundCurrency(totalPrice + totalTax + totalShipping - totalDiscount);

    return (
        <div className="container-fluid py-5 mt-5">
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex align-items-center mb-4">
                        <Link to="/" className="btn btn-outline-secondary me-3 rounded-circle">
                            <i className="bi bi-arrow-left"></i>
                        </Link>
                        <div className="flex-grow-1">
                            <h1 className="mb-1 fw-bold text-primary">
                                <i className="bi bi-cart3 me-2"></i>
                                Giỏ hàng của bạn
                            </h1>
                            <p className="text-muted mb-0 small">
                                {totalItems > 0 ? `${totalItems} sản phẩm trong giỏ hàng` : 'Giỏ hàng trống'}
                            </p>
                        </div>
                        {totalItems > 0 && (
                            <span className="badge bg-primary rounded-pill fs-6 px-3 py-2">
                                {totalItems} {totalItems === 1 ? 'sản phẩm' : 'sản phẩm'}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Cart Items Section */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-header bg-white border-0 py-4 rounded-top">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-bold text-dark">
                                    <i className="bi bi-basket me-2 text-primary"></i>
                                    Sản phẩm trong giỏ hàng
                                </h5>
                                {cartItems.length > 0 && (
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => {
                                            if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
                                                clearCart()
                                                toast.success('Đã xóa tất cả sản phẩm!')
                                            }
                                        }}
                                    >
                                        <i className="bi bi-trash me-1"></i>
                                        Xóa tất cả
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {cartItems?.length > 0 ? (
                                <div className="cart-items-container">
                                    {cartItems?.map((food, index) => {
                                        const product = getCurrentProduct(food.id || food._id);
                                        const price = Number(product?.price) || 0;
                                        const quantity = Number(food.quantity) || 0;
                                        const itemTotal = price * quantity;

                                        return (
                                            <div className="cart-item p-4 border-bottom" key={index}>
                                                <div className="row align-items-center g-3">
                                                    {/* Product Image */}
                                                    <div className="col-md-2 col-4">
                                                        <div className="position-relative">
                                                            <img
                                                                src={product?.file || food?.file || '/placeholder.jpg'}
                                                                alt={product?.name || food?.name}
                                                                className="img-fluid rounded-3 shadow-sm cart-item-image"
                                                                style={{ 
                                                                    width: '100%', 
                                                                    height: '120px', 
                                                                    objectFit: 'cover' 
                                                                }}
                                                            />
                                                            <div className="position-absolute top-0 end-0 translate-middle">
                                                                <span className="badge bg-primary rounded-pill fs-6 px-2 py-1">
                                                                    {quantity}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Product Info */}
                                                    <div className="col-md-4 col-8">
                                                        <h6 className="fw-bold mb-2 text-dark">
                                                            {product?.name || food?.name}
                                                        </h6>
                                                        <p className="text-muted mb-2 small">
                                                            <i className="bi bi-tag me-1"></i>
                                                            {product?.category || food?.category || 'Không phân loại'}
                                                        </p>
                                                        <p className="text-success fw-bold mb-0 fs-5">
                                                            {formatCurrency(price)}
                                                        </p>
                                                    </div>
                                                    
                                                    {/* Quantity Controls */}
                                                    <div className="col-md-3 col-6">
                                                        <div className="d-flex align-items-center justify-content-center gap-2">
                                                            <button
                                                                className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                                                style={{ width: '38px', height: '38px' }}
                                                                onClick={() => decreaseQuantity(food.id || food._id)}
                                                                disabled={quantity <= 1}
                                                            >
                                                                <i className="bi bi-dash"></i>
                                                            </button>
                                                            <div className="bg-light rounded-3 px-3 py-2">
                                                                <span className="fw-bold text-dark">{quantity}</span>
                                                            </div>
                                                            <button
                                                                className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                                                style={{ width: '38px', height: '38px' }}
                                                                onClick={() => increaseQuantity(food.id || food._id)}
                                                            >
                                                                <i className="bi bi-plus"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Item Total & Remove */}
                                                    <div className="col-md-3 col-6">
                                                        <div className="d-flex flex-column align-items-md-end gap-2">
                                                            <p className="fw-bold text-primary mb-0 fs-5">
                                                                {formatCurrency(itemTotal)}
                                                            </p>
                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => {
                                                                    removeFromCart(food.id || food._id)
                                                                    toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
                                                                }}
                                                                title="Xóa sản phẩm"
                                                            >
                                                                <i className="bi bi-trash me-1"></i>
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="bi bi-cart-x display-1 text-muted mb-3"></i>
                                    <h4 className="text-muted mb-2">Giỏ hàng trống</h4>
                                    <p className="text-muted mb-4">Thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm!</p>
                                    <Link to="/" className="btn btn-primary btn-lg rounded-pill px-4">
                                        <i className="bi bi-shop me-2"></i>
                                        Tiếp tục mua sắm
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {cartItems?.length > 0 && (
                        <div className="mt-4 d-flex gap-3">
                            <Link to="/" className="btn btn-outline-primary btn-lg rounded-pill px-4">
                                <i className="bi bi-arrow-left me-2"></i>
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    )}
                </div>

                {/* Order Summary Section */}
                <div className="col-lg-4">
                    <div className="sticky-top" style={{ top: '20px' }}>
                        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                            <div className="card-header bg-gradient-primary text-white border-0 py-4">
                                <h5 className="mb-0 fw-bold">
                                    <i className="bi bi-receipt-cutoff me-2"></i>
                                    Tóm tắt đơn hàng
                                </h5>
                            </div>
                            <div className="card-body p-4">
                                {/* Order Details */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                        <span className="text-muted">
                                            <i className="bi bi-box-seam me-1"></i>
                                            Tạm tính ({totalItems} {totalItems === 1 ? 'sản phẩm' : 'sản phẩm'})
                                        </span>
                                        <span className="fw-semibold text-dark">{formatCurrency(totalPrice)}</span>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                        <span className="text-muted">
                                            <i className="bi bi-truck me-1"></i>
                                            Phí vận chuyển
                                        </span>
                                        <span className="fw-semibold">
                                            {totalShipping === 0 ? (
                                                <span className="text-success">
                                                    <i className="bi bi-check-circle me-1"></i>
                                                    Miễn phí
                                                </span>
                                            ) : (
                                                formatCurrency(totalShipping)
                                            )}
                                        </span>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                        <span className="text-muted">
                                            <i className="bi bi-percent me-1"></i>
                                            Thuế VAT (10%)
                                        </span>
                                        <span className="fw-semibold text-dark">{formatCurrency(totalTax)}</span>
                                    </div>

                                    {totalDiscount > 0 && (
                                        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                            <span className="text-success">
                                                <i className="bi bi-tag me-1"></i>
                                                Giảm giá
                                            </span>
                                            <span className="fw-semibold text-success">-{formatCurrency(totalDiscount)}</span>
                                        </div>
                                    )}
                                </div>

                                <hr className="my-3" />

                                {/* Total */}
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="mb-0 fw-bold text-dark">Tổng cộng</h5>
                                    <h4 className="mb-0 fw-bold text-primary">{formatCurrency(totalPayment)}</h4>
                                </div>

                                {/* Checkout Button */}
                                <Link to="/checkout" className="text-decoration-none">
                                    <button
                                        className="btn btn-primary w-100 btn-lg fw-bold rounded-pill py-3"
                                        disabled={cartItems.length === 0}
                                    >
                                        <i className="bi bi-credit-card-2-front me-2"></i>
                                        Thanh toán
                                    </button>
                                </Link>

                                {/* Free Shipping Notice */}
                                {totalPrice > 1000000 && (
                                    <div className="alert alert-success mt-3 mb-0 text-center rounded-pill">
                                        <i className="bi bi-gift me-1"></i>
                                        <small className="fw-semibold">Miễn phí vận chuyển cho đơn hàng trên 1,000,000đ!</small>
                                    </div>
                                )}

                                {totalPrice < 100 && totalPrice > 0 && (
                                    <div className="alert alert-info mt-3 mb-0 text-center rounded-pill">
                                        <i className="bi bi-info-circle me-1"></i>
                                        <small>
                                            Mua thêm <strong>{formatCurrency(100 - totalPrice)}</strong> để được miễn phí vận chuyển!
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Promo Code Card */}
                        {cartItems.length > 0 && (
                            <div className="card shadow-sm border-0 rounded-4 mt-4">
                                <div className="card-header bg-light border-0 py-3">
                                    <h6 className="mb-0 fw-semibold">
                                        <i className="bi bi-ticket-perforated me-2 text-primary"></i>
                                        Mã giảm giá
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control rounded-start-pill"
                                            placeholder="Nhập mã giảm giá"
                                        />
                                        <button className="btn btn-outline-primary rounded-end-pill" type="button">
                                            Áp dụng
                                        </button>
                                    </div>
                                    <small className="text-muted mt-2 d-block">
                                        <i className="bi bi-info-circle me-1"></i>
                                        Nhập mã giảm giá hợp lệ để nhận ưu đãi
                                    </small>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
