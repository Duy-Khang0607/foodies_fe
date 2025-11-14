# Authentication Flow Documentation

## Tổng quan

Hệ thống authentication đã được refactor hoàn toàn để tối ưu performance, loại bỏ polling, và tự động refresh token khi hết hạn.

## Kiến trúc

### 1. **Token Management (StoreContext.jsx)**

- Quản lý token, refreshToken, tokenExpiry, user trong localStorage
- Tự động kiểm tra token expiry mỗi 1 phút
- Proactive refresh token khi còn dưới 5 phút
- Đồng bộ state với localStorage qua storage events (multi-tab support)

### 2. **Axios Interceptors (axios.js)**

#### Request Interceptor
- Tự động gắn access token vào header Authorization cho mọi request
- Lấy token trực tiếp từ localStorage

#### Response Interceptor
- Bắt lỗi 401 (Unauthorized)
- Tự động gọi refresh token API
- Retry lại request với token mới
- Queue management để tránh multiple refresh calls đồng thời
- Auto logout và redirect nếu refresh token thất bại

### 3. **Service Layer**

Tất cả API services không còn cần truyền token parameter:

```javascript
// ❌ Cũ (WRONG)
const response = await getOrders(token)
const response = await createOrder(orderData, token)

// ✅ Mới (CORRECT)
const response = await getOrders()
const response = await createOrder(orderData)
```

Token được tự động gắn vào mọi request qua axios interceptor.

## Flow hoạt động

### A. Login Flow

```
User Login
    ↓
API /auth/login
    ↓
Nhận tokens (accessToken, refreshToken, expiryTime)
    ↓
StoreContext.saveAuthData()
    ↓
Lưu vào localStorage:
    - token
    - refreshToken
    - tokenExpiry
    - user
    ↓
Set state (token, user)
    ↓
Navigate to home
```

### B. API Call Flow (Token còn hạn)

```
Component gọi API service
    ↓
axios request interceptor
    ↓
Lấy token từ localStorage
    ↓
Gắn vào header: Authorization: Bearer {token}
    ↓
Gửi request
    ↓
Response thành công
    ↓
Return data
```

### C. API Call Flow (Token hết hạn - 401)

```
Component gọi API service
    ↓
axios request interceptor
    ↓
Gắn token (đã hết hạn) vào header
    ↓
Gửi request
    ↓
Server trả về 401 Unauthorized
    ↓
axios response interceptor bắt 401
    ↓
Kiểm tra: đang refresh? → Queue request
    ↓
Set isRefreshing = true
    ↓
Gọi API /auth/refresh-token
    ↓
Nhận tokens mới (accessToken, refreshToken, expiryTime)
    ↓
Lưu vào localStorage
    ↓
Dispatch storage event để sync StoreContext
    ↓
Retry original request với token mới
    ↓
Process queue (retry các requests khác)
    ↓
Response thành công
    ↓
Return data
```

### D. Refresh Token Failed Flow

```
axios response interceptor gặp 401
    ↓
Gọi API /auth/refresh-token
    ↓
Refresh token hết hạn hoặc invalid
    ↓
Clear localStorage:
    - token
    - refreshToken
    - tokenExpiry
    - user
    ↓
Redirect to /login
    ↓
StoreContext sync via storage event
    ↓
Clear state (token, user)
```

### E. Proactive Token Refresh (Background)

```
StoreContext useEffect (mỗi 1 phút)
    ↓
Kiểm tra tokenExpiry
    ↓
Token còn < 5 phút?
    ↓ Yes
refreshTokenFunction()
    ↓
Gọi API /auth/refresh-token
    ↓
Lưu tokens mới vào localStorage
    ↓
Update state
    ↓
Tiếp tục check sau 1 phút
```

## Storage Structure

### localStorage keys:

```javascript
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "tokenExpiry": "1762938548391",  // Timestamp (ms)
    "user": "{\"_id\":\"...\",\"name\":\"...\",\"email\":\"...\"}"
    "cart": "[{...}, {...}]"
}
```

## Xử lý Edge Cases

### 1. **localStorage bị xóa**
- Không còn redirect loop vô hạn
- StoreContext chỉ initialize 1 lần
- Authentication HOC check và redirect to login

### 2. **Multiple tabs**
- Storage event listener đồng bộ token/user giữa các tabs
- Logout ở tab này → tất cả tabs khác auto logout

### 3. **Token hết hạn trong khi đang gọi nhiều API**
- Chỉ refresh token 1 lần duy nhất
- Các requests khác được queue lại
- Sau khi refresh xong, retry tất cả requests trong queue

### 4. **Refresh token hết hạn**
- Clear tất cả auth data
- Redirect to login
- Không retry vô hạn

### 5. **Network error**
- Không trigger refresh token
- Throw error lên component để xử lý

## Best Practices

### ✅ DO:

```javascript
// Gọi API services trực tiếp
const orders = await getOrders()
const order = await createOrder(orderData)

// Dùng StoreContext để check authentication state
const { token, user } = useContext(StoreContext)
if (!token) {
    // Not logged in
}

// Dùng Authentication HOC để protect routes
<Authentication>
    <ProtectedComponent />
</Authentication>
```

### ❌ DON'T:

```javascript
// KHÔNG truyền token vào API services
const orders = await getOrders(token) // ❌

// KHÔNG manually gắn Authorization header
axios.get('/orders', {
    headers: { Authorization: `Bearer ${token}` } // ❌
})

// KHÔNG manually check token expiry trước mỗi API call
if (isTokenExpired()) {
    await refreshToken() // ❌
}
// Axios interceptor tự động xử lý

// KHÔNG dùng polling để sync localStorage
setInterval(() => {
    const token = localStorage.getItem('token')
    setToken(token) // ❌
}, 50)
// Dùng storage events thay vì
```

## Components cần Authentication

Tất cả protected routes đã được wrap trong `Authentication` HOC:

- `/` - Home
- `/explore` - Explore Food
- `/contact` - Contact
- `/cart` - Cart
- `/checkout` - Checkout
- `/food-detail/:id` - Food Details
- `/profile` - Profile
- `/orders` - Orders (Admin)
- `/manage-users` - Manage Users (Admin)
- `/manage-foods` - Manage Foods (Admin)

## API Endpoints

### Authentication APIs:
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `POST /auth/refresh-token` - Refresh access token
- `GET /auth/profile` - Get current user
- `PUT /auth/profile` - Update profile
- `PUT /auth/change-password` - Change password
- `POST /auth/forgot-password` - Forgot password
- `POST /auth/reset-password` - Reset password

### Protected APIs (cần token):
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (Admin)
- `PUT /products/:id` - Update product (Admin)
- `DELETE /products/:id` - Delete product (Admin)
- `GET /orders/get-all-orders` - Get all orders (Admin)
- `POST /orders/create-order` - Create order
- `PUT /orders/:id` - Update order status (Admin)
- `DELETE /orders/:id` - Delete order (Admin)
- `POST /vnpay/create-payment` - Create VNPay payment

## Debugging

### Check token trong console:

```javascript
// Check token
console.log('Token:', localStorage.getItem('token'))

// Check token expiry
const expiry = parseInt(localStorage.getItem('tokenExpiry'))
const now = Date.now()
const remaining = expiry - now
console.log('Token expires in:', Math.round(remaining / 1000 / 60), 'minutes')

// Check if token is expired
console.log('Token expired:', remaining <= 0)
```

### Common errors:

1. **"Access tokenExpiry"** → Token không được gắn vào header hoặc đã hết hạn
   - Check localStorage có token không
   - Check axios request interceptor
   
2. **Redirect loop** → ĐÃ FIX trong refactor này

3. **401 Unauthorized** → Token hết hạn hoặc invalid
   - Axios interceptor sẽ tự động refresh token
   - Nếu vẫn lỗi → check refresh token API

## Performance Improvements

### Trước refactor:
- ❌ Polling 50ms để sync localStorage (20 lần/giây)
- ❌ 7 useEffect với dependencies phức tạp
- ❌ Nhiều re-render không cần thiết
- ❌ Token check không hiệu quả

### Sau refactor:
- ✅ Storage events (chỉ trigger khi có thay đổi)
- ✅ 4 useEffect rõ ràng, tối ưu
- ✅ useCallback cho các functions
- ✅ Proactive token refresh (background)
- ✅ Queue management cho multiple concurrent requests
- ✅ Không còn redirect loop

## Migration Guide

Nếu có code cũ cần migrate:

### 1. Update API service calls:

```javascript
// Cũ
const response = await getOrders(token)

// Mới
const response = await getOrders()
```

### 2. Remove manual token management:

```javascript
// Cũ - KHÔNG CẦN NỮA
const token = localStorage.getItem('token')
const config = {
    headers: { Authorization: `Bearer ${token}` }
}
const response = await axios.get('/api/orders', config)

// Mới - TỰ ĐỘNG
const response = await api.get('/orders')
```

### 3. Remove manual refresh token calls:

```javascript
// Cũ - KHÔNG CẦN NỮA
try {
    const response = await getOrders(token)
} catch (error) {
    if (error.response?.status === 401) {
        await refreshToken()
        const response = await getOrders(token)
    }
}

// Mới - TỰ ĐỘNG XỬ LÝ
const response = await getOrders()
```

## Conclusion

Hệ thống authentication mới:
- ✅ Tự động và transparent
- ✅ Performance tốt hơn (không polling)
- ✅ Không còn bugs (redirect loop, memory leaks)
- ✅ Dễ maintain và extend
- ✅ Best practices theo React và Axios

