import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { StoreContext } from '../../context/StoreContext'
import { createOrder } from '../../services/OrderServices'
import { formatCurrency } from '../../utils/utils'
import './checkout.css'
import { createPayment } from '../../services/VnpayServices'

const Checkout = () => {
  const navigate = useNavigate()
  const { foodList, cart, user, clearCart } = useContext(StoreContext)
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  
  // Form state với đầy đủ các field của Order model
  const [formData, setFormData] = useState({
    customer: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    },
    shippingAddress: '',
    paymentMethod: 'cash',
    notes: ''
  })

  const handleOrder = async (cartItems) => {
    const payment = {
        amount: totalPayment,
        orderInfo: "Order " + Date.now(),
        cartItems: cartItems
    }
    try {
        const response = await createPayment(payment)
        if (response?.data?.success) {
            window.open(response?.data?.paymentUrl, '_blank')
        } else {
            toast.error(response?.message)
        }
    } catch (error) {
        toast.error(error?.message)
    }
}

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getCurrentProduct = (id) => {
    return foodList.find(food => food._id === id || food.id === id)
  }
  
  const cartItems = cart.filter(food => food.quantity > 0)
  const totalItems = cartItems.reduce((acc, food) => acc + Number(food.quantity), 0)
  
  // Utility function để xử lý tiền tệ chính xác
  const roundCurrency = (amount) => {
    return Math.round((amount + Number.EPSILON) * 100) / 100;
  }
  
  const totalPrice = roundCurrency(
    cartItems.reduce((acc, food) => {
      const product = getCurrentProduct(food.id || food._id)
      const price = Number(product?.price) || 0;
      const quantity = Number(food.quantity) || 0;
      return acc + (price * quantity);
    }, 0)
  );
  
  const totalTax = roundCurrency(totalPrice * 0.1);
  const totalShipping = totalPrice > 100 ? 0 : 10;
  const totalDiscount = 0;
  const totalPayment = roundCurrency(totalPrice + totalTax + totalShipping - totalDiscount);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('customer.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        customer: {
          ...prev.customer,
          [field]: value
        }
      }));
      // Clear error khi user nhập
      if (errors[`customer.${field}`]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[`customer.${field}`];
          return newErrors;
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      // Clear error khi user nhập
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate customer name
    if (!formData.customer.name || formData.customer.name.trim() === '') {
      newErrors['customer.name'] = 'Tên khách hàng là bắt buộc';
    }

    // Validate customer email
    if (!formData.customer.email || formData.customer.email.trim() === '') {
      newErrors['customer.email'] = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer.email)) {
      newErrors['customer.email'] = 'Email không hợp lệ';
    }

    // Validate customer phone
    if (!formData.customer.phone || formData.customer.phone.trim() === '') {
      newErrors['customer.phone'] = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9\-\+\s\(\)]+$/.test(formData.customer.phone)) {
      newErrors['customer.phone'] = 'Số điện thoại không hợp lệ';
    }

    // Validate shipping address
    if (!formData.shippingAddress || formData.shippingAddress.trim() === '') {
      newErrors['shippingAddress'] = 'Địa chỉ giao hàng là bắt buộc';
    }

    // Validate cart items
    if (cartItems.length === 0) {
      newErrors['cart'] = 'Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order items theo format của Order model
      const orderItems = cartItems.map(food => {
        const product = getCurrentProduct(food.id || food._id);
        const price = Number(product?.price) || 0;
        const quantity = Number(food.quantity) || 0;
        
        return {
          productId: product?._id || product?.id || null,
          name: product?.name || 'Unknown Product',
          price: price,
          quantity: quantity
        };
      });

      // Prepare order data theo format của Order model
      const orderData = {
        customer: {
          name: formData.customer.name.trim(),
          email: formData.customer.email.trim().toLowerCase(),
          phone: formData.customer.phone.trim()
        },
        items: orderItems,
        shippingAddress: formData.shippingAddress.trim(),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes ? formData.notes.trim() : undefined
      };

      const response = await createOrder(orderData);

      if (response?.success) {
        toast.success('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');
        
        // Clear cart sau khi đặt hàng thành công
        if (clearCart) {
          clearCart();
        }
      } else {
        toast.error(response?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.errors?.join(', ') ||
                          'Đặt hàng thất bại. Vui lòng thử lại.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nếu giỏ hàng trống, hiển thị thông báo
  if (cartItems?.length === 0) {
    return (
      <div className="container mt-5 py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-cart-x display-4 text-muted mb-3"></i>
                <h3 className="mb-3">Giỏ hàng trống</h3>
                <p className="text-muted mb-4">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/')}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container py-5 mt-5">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="h3 mb-0">
              <i className="bi bi-cart-check me-2"></i>
              Thanh toán đơn hàng
            </h1>
            <p className="text-muted">Vui lòng điền đầy đủ thông tin để hoàn tất đơn hàng</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Left Column - Form */}
            <div className="col-lg-8">
              {/* Customer Information */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-person-circle me-2"></i>
                    Thông tin khách hàng
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-12">
                      <label htmlFor="customer.name" className="form-label">
                        Họ và tên <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors['customer.name'] ? 'is-invalid' : ''}`}
                        id="customer.name"
                        name="customer.name"
                        value={formData.customer.name}
                        onChange={handleInputChange}
                        placeholder="Nhập họ và tên"
                        required
                      />
                      {errors['customer.name'] && (
                        <div className="invalid-feedback">{errors['customer.name']}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="customer.email" className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-control ${errors['customer.email'] ? 'is-invalid' : ''}`}
                        id="customer.email"
                        name="customer.email"
                        value={formData.customer.email}
                        onChange={handleInputChange}
                        placeholder="example@email.com"
                        required
                      />
                      {errors['customer.email'] && (
                        <div className="invalid-feedback">{errors['customer.email']}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="customer.phone" className="form-label">
                        Số điện thoại <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${errors['customer.phone'] ? 'is-invalid' : ''}`}
                        id="customer.phone"
                        name="customer.phone"
                        value={formData.customer.phone}
                        onChange={handleInputChange}
                        required
                      />
                      {errors['customer.phone'] && (
                        <div className="invalid-feedback">{errors['customer.phone']}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-info text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-geo-alt me-2"></i>
                    Địa chỉ giao hàng
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="shippingAddress" className="form-label">
                      Địa chỉ giao hàng <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className={`form-control ${errors['shippingAddress'] ? 'is-invalid' : ''}`}
                      id="shippingAddress"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Nhập địa chỉ giao hàng đầy đủ (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                      required
                    />
                    {errors['shippingAddress'] && (
                      <div className="invalid-feedback">{errors['shippingAddress']}</div>
                    )}
                    <small className="form-text text-muted">
                      Ví dụ: 123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh
                    </small>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-credit-card me-2"></i>
                    Phương thức thanh toán
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-check payment-option">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="paymentCash"
                          value="cash"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label w-100" htmlFor="paymentCash">
                          <div className="border rounded p-3">
                            <i className="bi bi-cash-coin fs-4 text-success me-2"></i>
                            <strong>Tiền mặt</strong>
                            <p className="small text-muted mb-0">Thanh toán khi nhận hàng</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-check payment-option">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="paymentVnpay"
                          value="vnpay"
                          checked={formData.paymentMethod === 'vnpay'}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label w-100" htmlFor="paymentVnpay">
                          <div className="border rounded p-3">
                            <i className="bi bi-wallet2 fs-4 text-primary me-2"></i>
                            <strong>VNPay</strong>
                            <p className="small text-muted mb-0">Thanh toán qua VNPay</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-check payment-option">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="paymentMomo"
                          value="momo"
                          checked={formData.paymentMethod === 'momo'}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label w-100" htmlFor="paymentMomo">
                          <div className="border rounded p-3">
                            <i className="bi bi-phone fs-4 text-danger me-2"></i>
                            <strong>MoMo</strong>
                            <p className="small text-muted mb-0">Thanh toán qua MoMo</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-check payment-option">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="paymentBank"
                          value="bank_transfer"
                          checked={formData.paymentMethod === 'bank_transfer'}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label w-100" htmlFor="paymentBank">
                          <div className="border rounded p-3">
                            <i className="bi bi-bank fs-4 text-info me-2"></i>
                            <strong>Chuyển khoản</strong>
                            <p className="small text-muted mb-0">Chuyển khoản ngân hàng</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-secondary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-chat-left-text me-2"></i>
                    Ghi chú đơn hàng (tùy chọn)
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">Ghi chú</label>
                    <textarea
                      className="form-control"
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Ghi chú thêm cho đơn hàng (ví dụ: thời gian giao hàng, hướng dẫn địa chỉ...)"
                      maxLength={500}
                    />
                    <small className="form-text text-muted">
                      {formData.notes.length}/500 ký tự
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="col-lg-4">
              <div className="card shadow-sm position-sticky top-0">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-receipt me-2"></i>
                    Tóm tắt đơn hàng
                  </h5>
                </div>
                <div className="card-body">
                  {/* Cart Items */}
                  <div className="mb-3">
                    <h6 className="mb-3">Sản phẩm ({totalItems})</h6>
                    <div className="cart-items">
                      {cartItems.map((food) => {
                        const product = getCurrentProduct(food.id || food._id);
                        const price = Number(product?.price) || 0;
                        const quantity = Number(food.quantity) || 0;
                        const subtotal = price * quantity;

                        return (
                          <div key={food.id || food._id} className="d-flex justify-content-between align-items-start mb-3 pb-3 border-bottom">
                            <div className="flex-grow-1">
                              <h6 className="mb-1 small">{product?.name || 'Unknown Product'}</h6>
                              <p className="text-muted small mb-0">
                                {formatCurrency(price)} x {quantity}
                              </p>
                            </div>
                            <div className="text-end">
                              <strong className="text-primary">{formatCurrency(subtotal)}</strong>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <hr />

                  {/* Order Summary */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tạm tính:</span>
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Thuế (10%):</span>
                      <span>{formatCurrency(totalTax)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Phí vận chuyển:</span>
                      <span>
                        {totalShipping === 0 ? (
                          <span className="text-success">Miễn phí</span>
                        ) : (
                          formatCurrency(totalShipping.toFixed(2))
                        )}
                      </span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-danger">
                        <span>Giảm giá:</span>
                        <span>-{formatCurrency(totalDiscount)}</span>
                      </div>
                    )}
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between mb-4">
                    <strong>Tổng cộng:</strong>
                    <strong className="text-primary fs-5">{formatCurrency(totalPayment)}</strong>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mb-3">
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="termsAccepted"
                        required
                      />
                      <label className="form-check-label small" htmlFor="termsAccepted">
                        Tôi đồng ý với{' '}
                        <a href="#" className="text-primary">điều khoản và điều kiện</a>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 btn-lg"
                    disabled={isSubmitting || cartItems.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Đặt hàng
                      </>
                    )}
                  </button>

                  <div className="mt-3 text-center">
                    <small className="text-muted">
                      <i className="bi bi-shield-check text-success me-1"></i>
                      Thanh toán an toàn và bảo mật
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
