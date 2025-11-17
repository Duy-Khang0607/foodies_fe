import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.DEV ? `${import.meta.env.VITE_API_URL}` : '/api',
    // withCredentials: true,
});

// Flag để tránh multiple refresh token calls đồng thời
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// REQUEST INTERCEPTOR: Gắn access token vào header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// RESPONSE INTERCEPTOR: Auto refresh token khi token hết hạn (401)
// CHỈ áp dụng cho token hết hạn, KHÔNG áp dụng cho login/register fail
api.interceptors.response.use(
    (response) => {
        // Response thành công, return luôn
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Danh sách các auth endpoints không nên trigger auto refresh token
        // Vì các endpoint này trả 401 khi credentials sai, không phải token hết hạn
        const authEndpoints = [
            '/auth/login',
            '/auth/register',
            '/auth/forgot-password',
            '/auth/reset-password',
            '/auth/refresh-token'
        ];

        // Kiểm tra xem request có phải là auth endpoint không
        const isAuthEndpoint = authEndpoints.some(endpoint => 
            originalRequest.url?.includes(endpoint)
        );

        // Nếu lỗi 401 và chưa retry và KHÔNG phải auth endpoint
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            // Kiểm tra có refresh token không
            const refreshTokenValue = localStorage.getItem('refreshToken');
            
            if (!refreshTokenValue) {
                // Không có refresh token, không thể refresh
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // Nếu đang refresh, đưa request vào queue
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Gọi API refresh token
                const response = await axios.post(
                    `${api.defaults.baseURL}/auth/refresh-token`,
                    { refreshToken: refreshTokenValue }
                );

                if (response.data?.success) {
                    const tokens = response.data?.data?.tokens;
                    const newAccessToken = tokens?.accessToken;
                    const newRefreshToken = tokens?.refreshToken || refreshTokenValue;
                    const expiryTime = tokens?.expiryTime || (Date.now() + (30 * 60 * 1000));

                    // Lưu token mới
                    localStorage.setItem('token', newAccessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);
                    localStorage.setItem('tokenExpiry', expiryTime.toString());

                    // Update header cho original request
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                   
                    // Process queue
                    processQueue(null, newAccessToken);
                    isRefreshing = false;

                    // Trigger storage event để StoreContext cập nhật
                    window.dispatchEvent(new StorageEvent('storage', {
                        key: 'token',
                        newValue: newAccessToken,
                        oldValue: null,
                        storageArea: localStorage
                    }));

                    // Retry original request
                    return api(originalRequest);
                } else {
                    throw new Error('Refresh token failed');
                }
            } catch (refreshError) {
                // Refresh token thất bại, clear auth data
                processQueue(refreshError, null);
                isRefreshing = false;
               
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('tokenExpiry');
                localStorage.removeItem('user');
               
                // Redirect to login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Lỗi khác 401, hoặc đã retry rồi, hoặc là auth endpoint
        return Promise.reject(error);
    }
);
