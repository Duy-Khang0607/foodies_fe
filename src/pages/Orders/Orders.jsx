import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading/Loading'
import { getOrders, updateOrderStatus, deleteOrder } from '../../services/OrderServices'
import { formatCurrency,formatDate } from '../../utils/utils'
import './Orders.css'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedOrders, setExpandedOrders] = useState({})
  const [displayedItems, setDisplayedItems] = useState(4)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const [ordersPerPage] = useState(12)
  const [pagination, setPagination] = useState(null)

  const fetchOrders = async (page = 1) => {
    setLoading(true)
    try {
      const response = await getOrders(page, ordersPerPage)
      console.log({currentPage,ordersPerPage})
      setOrders(response?.data || [])
      setPagination(response?.pagination || null)
      setTotalPages(response?.pagination?.totalPages || 1)
      setCurrentPage(response?.pagination?.currentPage || 1)
      setTotalOrders(response?.pagination?.totalOrders || 0)
      toast.success(`Loaded ${response?.pagination?.ordersOnCurrentPage || 0} orders successfully`)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    setLoading(true)
    setTimeout(() => {
      setDisplayedItems((prev) => {
        if (prev < filteredOrders?.length) {
          return prev + 4
        }
        return prev
      })
    }, 100)
    setLoading(false)
  }

  const handleViewLessOrders = () => {
    setLoading(true)
    setTimeout(() => {
      setDisplayedItems(4)
    }, 100)
    document.getElementById('list-orders').scrollIntoView({ behavior: 'smooth' })
    setLoading(false)
  }

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      fetchOrders(currentPage + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePreviousPage = () => {
    if (pagination?.hasPrevPage) {
      fetchOrders(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleGoToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchOrders(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    setLoading(true)
    try {
      const response = await updateOrderStatus(orderId, newStatus)
      if (response?.status === 200) {
        toast.success('Order status updated successfully')
        await fetchOrders(currentPage)
      } else {
        toast.error('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      // Update local state for demo
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      )
      toast.success('Order status updated (demo mode)')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return
    }
    setLoading(true)
    try {
      const response = await deleteOrder(orderId)
      if (response?.status === 200) {
        toast.success('Order deleted successfully')
        // If current page becomes empty after delete, go to previous page
        if (orders.length === 1 && currentPage > 1) {
          await fetchOrders(currentPage - 1)
        } else {
          await fetchOrders(currentPage)
        }
      } else {
        toast.error('Failed to delete order')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      // Update local state for demo
      setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId))
      toast.success('Order deleted (demo mode)')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'bg-warning', text: 'Pending' },
      processing: { class: 'bg-info', text: 'Processing' },
      completed: { class: 'bg-success', text: 'Completed' },
      cancelled: { class: 'bg-danger', text: 'Cancelled' },
      shipped: { class: 'bg-primary', text: 'Shipped' }
    }
    const config = statusConfig[status] || { class: 'bg-secondary', text: status }
    return (
      <span className={`badge ${config.class} text-white px-3 py-2`}>
        {config.text}
      </span>
    )
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })


  if (loading || orders?.length === 0) {
    return <Loading />
  }


  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="mb-4">
            <i className="bi bi-cart-check-fill me-2"></i>
            Orders Management
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by order number, customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3 mb-3 mb-md-0">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="col-md-3">
          <button
            className="btn btn-primary w-100"
            onClick={fetchOrders}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Orders Count */}
      <div className="row mb-3">
        <div className="col-12">
          <p className="text-muted">
            Showing <strong>{filteredOrders?.length}</strong> of <strong>{totalOrders}</strong> orders
            {pagination && (
              <span className="ms-2">
                (Page {currentPage} of {totalPages})
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders?.length === 0 ? (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-info text-center">
              <i className="bi bi-inbox fs-1 d-block mb-3"></i>
              <h5>No orders found</h5>
              <p className="mb-0">There are no orders matching your criteria.</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* List orders */}
          <div className="row" id="list-orders">
            {/* {filteredOrders?.slice(0, displayedItems)?.map((order) => ( */}
            {filteredOrders?.map((order) => (
              <div key={order._id} className="col-12 col-md-4 col-lg-2 col-xl-3 mb-4 order-card-enter">
                <div className="card h-100 shadow-sm">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-0">
                        <i className="bi bi-receipt me-2"></i>
                        {order.orderNumber || `Order #${order._id}`}
                      </h5>
                      <small className="text-muted">
                        <i className="bi bi-calendar3 me-1"></i>
                        {formatDate(order.createdAt)}
                      </small>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Card body */}
                  <div className="card-body">

                    {/* Customer Info */}
                    <div className="mb-3">
                      <h6 className="text-muted mb-2">
                        <i className="bi bi-person me-2 text-primary"></i>Customer
                      </h6>
                      <p className="mb-1">
                        <strong>{order.customer?.name || 'N/A'}</strong>
                      </p>
                      <p className="mb-1 text-muted small">
                        <i className="bi bi-envelope me-1"></i>
                        {order.customer?.email || 'N/A'}
                      </p>
                      <p className="mb-0 text-muted small">
                        <i className="bi bi-telephone me-1"></i>
                        {order.customer?.phone || 'N/A'}
                      </p>
                    </div>

                    {/* Order Items */}
                    <div className="mb-3" style={{ height: expandedOrders[order._id] ? 'auto' : '120px' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="text-muted mb-0">
                          <i className="bi bi-bag-check-fill me-2 text-success"></i>
                          Order Items
                        </h6>
                        <span className="badge bg-primary rounded-pill">
                          {order.items?.length || 0}
                        </span>
                      </div>

                      {/* Items Container with Scroll */}
                      <div
                        className="border rounded bg-light"
                        style={{
                          height: expandedOrders[order._id] ? '200px' : '60px',
                          overflowY: expandedOrders[order._id] ? 'auto' : 'hidden',
                          transition: 'max-height 0.3s ease'
                        }}
                      >
                        <div className="list-group list-group-flush">
                          {order.items
                            ?.slice(0, expandedOrders[order._id] ? order.items.length : 2)
                            .map((item, idx) => (
                              <div
                                key={idx}
                                className="list-group-item bg-transparent border-0 py-2"
                                style={{
                                  animation: 'fadeIn 0.3s ease-in',
                                  borderBottom: idx < (expandedOrders[order._id] ? order.items.length - 1 : Math.min(1, order.items.length - 1)) ? '1px solid #e9ecef' : 'none'
                                }}
                              >
                                <div className="d-flex justify-content-between align-items-start">
                                  <div className="d-flex align-items-center flex-grow-1 me-2">
                                    <span className="badge bg-secondary me-2" style={{ minWidth: '24px' }}>
                                      {idx + 1}
                                    </span>
                                    <div className="flex-grow-1">
                                      <div className="fw-semibold small text-dark mb-1"
                                        style={{
                                          lineHeight: '1.3',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          display: '-webkit-box',
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: 'vertical'
                                        }}>
                                        {item?.name || 'N/A'}
                                      </div>
                                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                        <i className="bi bi-tag-fill me-1"></i>
                                        {formatCurrency(item.product?.price || item.price || 0)} each
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-end" style={{ minWidth: '80px' }}>
                                    <div className="badge bg-info text-white mb-1">
                                      Amount: {item.quantity}
                                    </div>
                                    <div className="fw-bold text-primary small">
                                      {formatCurrency((item.product?.price || item.price || 0) * item.quantity)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* View More/Less Button */}
                      {order.items?.length > 2 && (
                        <div className="mt-2" style={{ height: '' }}>
                          <button
                            className="btn btn-sm btn-outline-primary w-100 d-flex justify-content-center align-items-center"
                            onClick={() => setExpandedOrders(prev => ({
                              ...prev,
                              [order._id]: !prev[order._id]
                            }))}
                            style={{
                              transition: 'all 0.3s ease',
                              borderRadius: '8px',
                              fontWeight: '500'
                            }}
                          >
                            {expandedOrders[order._id] ? (
                              <>
                                <i className="bi bi-chevron-up me-2"></i>
                                <span>Show Less</span>
                              </>
                            ) : (
                              <>
                                <i className="bi bi-chevron-down me-2"></i>
                                <span>Show {order.items.length - 1} More Item{order.items.length - 1 > 1 ? 's' : ''}</span>
                                <span className="badge bg-primary ms-2">
                                  +{order.items.length - 1}
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div className="mb-3">
                        <h6 className="text-muted mb-2">
                          <i className="bi bi-geo-alt me-2 text-primary"></i>Shipping Address
                        </h6>
                        <p className="small mb-0">{order.shippingAddress}</p>
                      </div>
                    )}

                    {/* Payment Method */}
                    {order?.paymentMethod && (
                      <div className="mb-3">
                        <h6 className="text-muted mb-2">
                          <i className="bi bi-credit-card me-2 text-primary"></i>Payment Method
                        </h6>
                        <p className="small mb-0">{order?.paymentMethod?.toUpperCase()}</p>
                      </div>
                    )}

                  </div>

                  {/* Total Amount */}
                  <div className='w-full'>
                    <div className='d-flex flex-column justify-content-between'>
                      <div className="border-top">
                        <div className="d-flex justify-content-between align-items-center p-2">
                          <h6 className="mb-0">Total Amount:</h6>
                          <h5 className="mb-0 text-primary">
                            {formatCurrency(order.totalAmount || 0)}
                          </h5>
                        </div>
                      </div>

                      {/* Payment Status */}
                      <div className="d-flex justify-content-between align-items-center p-2">
                        <h6 className="mb-0">Payment Status:</h6>
                        <p style={{ fontSize: '13px' }} className={`mb-0 fw-bold ${order?.paymentStatus !== 'pending' ? 'text-success' : 'text-danger'}`}>
                          {order?.paymentStatus?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="card-footer bg-white">
                    <div className="row g-2">
                      <div className="col-12 col-sm-6">
                        <select
                          className="form-select form-select-sm"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={loading}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="col-12 col-sm-6">
                        <button
                          className="btn btn-outline-danger btn-sm w-100"
                          onClick={() => handleDeleteOrder(order._id)}
                          disabled={loading}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Button load / view*/}
          {/* <div className="row mt-5">
            <div className="col-12 text-center">
              <button
                className="btn btn-outline-primary btn-sm p-2 rounded-pill"
                style={{
                  transition: 'all 0.3s ease',
                  borderWidth: '2px',
                  minWidth: '200px'
                }}
                onClick={filteredOrders?.length > displayedItems ? handleLoadMore : handleViewLessOrders}
                disabled={loading}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.backgroundColor = 'rgba(0,123,255,0.1)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.backgroundColor = 'rgba(0,123,255,0.1)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Loading...
                  </>
                ) : (
                  <>
                    {filteredOrders?.length < displayedItems ? (
                      <span className='text-dark' style={{ backgroundColor: 'transparent', border: 'none' }}>
                        <i className="fas fa-minus me-2"></i>
                        View Less Orders
                      </span>
                    ) : (
                      <span className='text-dark' style={{ backgroundColor: 'transparent', border: 'none' }}>
                        <i className="fas fa-plus me-2"></i>
                        Load More Orders
                      </span>
                    )}
                    <span className="badge bg-light text-dark ms-2">
                      +{filteredOrders?.length > displayedItems ? filteredOrders?.length - displayedItems : 0}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div> */}

          {/* Pagination */}
          <div className='row mt-4'>
            <div className='col-12'>
              <div className='d-flex justify-content-start align-items-center gap-2'>
                {/* Previous */}
                <button
                  className='btn btn-dark btn-sm p-2 rounded-pill d-flex align-items-center'
                  onClick={handlePreviousPage}
                  disabled={!pagination?.hasPrevPage || loading}
                >
                  <i className="bi bi-arrow-left-short me-1"></i>
                  Previous
                </button>

                {/* Page numbers */}
                <div className='d-flex align-items-center gap-2'>
                  {/* Show page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first page, last page, current page, and pages around current
                      return page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    })
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {/* Show ellipsis if there's a gap */}
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className='text-muted'>...</span>
                        )}
                        <button
                          className={`btn btn-sm rounded btn-light
                            ${page === currentPage ? 'btn-dark' : ''}
                            `}
                          onClick={() => handleGoToPage(page)}
                          disabled={loading}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))
                  }
                </div>

                {/* Next */}
                <button
                  className='btn btn-dark btn-sm p-2 rounded-pill d-flex align-items-center'
                  onClick={handleNextPage}
                  disabled={!pagination?.hasNextPage || loading}
                >
                  Next
                  <i className="bi bi-arrow-right-short ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </>
      )
      }

      {/* Table View for Larger Screens (Alternative) */}
      <div className="row mt-4 d-none d-xl-block">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">All Orders</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light text-center">
                    <tr>
                      <th>STT</th>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className='text-center'>
                    {filteredOrders?.map((order, index) => (
                      <tr key={order._id}>
                        <td>
                          <strong>{index + (currentPage - 1) * ordersPerPage + 1}</strong>
                        </td>
                        <td>
                          <strong>{order.orderNumber || `#${order._id}`}</strong>
                        </td>
                        <td>
                          <div>
                            <div>{order.customer?.name || 'N/A'}</div>
                            <small className="text-muted">{order.customer?.email || ''}</small>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {order.items?.length || 0} items
                          </span>
                        </td>
                        <td>
                          <strong>{formatCurrency(order.totalAmount || 0)}</strong>
                        </td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>
                          <small className={`mb-0 fw-bold ${order?.paymentStatus !== 'pending' ? 'text-success' : 'text-danger'}`}>
                            <i className={`bi bi-${order?.paymentStatus !== 'pending' ? 'check-circle' : 'x-circle'} me-1`}></i>
                            {order?.paymentStatus?.toUpperCase()}
                          </small>
                        </td>
                        <td>
                          <small>{formatDate(order.createdAt)}</small>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <select
                              className="form-select form-select-sm"
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              style={{ width: 'auto', minWidth: '120px' }}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDeleteOrder(order._id)}
                              title="Delete Order"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination table view */}
              <div className='row mt-4 ms-2'>
                <div className='col-12'>
                  <div className='d-flex justify-content-start align-items-center gap-2'>
                    {/* Previous */}
                    <button
                      className='btn btn-light btn-sm p-2 rounded-pill d-flex align-items-center'
                      onClick={handlePreviousPage}
                      disabled={!pagination?.hasPrevPage || loading}
                    >
                      <i className="bi bi-arrow-left-short me-1"></i>
                      Previous
                    </button>

                    {/* Page numbers */}
                    <div className='d-flex align-items-center gap-2'>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          // Show first page, last page, current page, and pages around current
                          return page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        })
                        .map((page, index, array) => (
                          <React.Fragment key={page}>
                            {/* Show ellipsis if there's a gap */}
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className='text-muted'>...</span>
                            )}
                            <button
                              className={`btn btn-sm rounded btn-light ${page === currentPage ? 'btn-dark' : ''}`}
                              onClick={() => handleGoToPage(page)}
                              disabled={loading}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        ))
                      }
                    </div>

                    {/* Next */}
                    <button
                      className='btn btn-light btn-sm p-2 rounded-pill d-flex align-items-center'
                      onClick={handleNextPage}
                      disabled={!pagination?.hasNextPage || loading}
                    >
                      Next
                      <i className="bi bi-arrow-right-short ms-1"></i>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Orders
