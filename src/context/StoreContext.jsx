import { createContext, useEffect, useState, useRef, useCallback } from "react"
import { getFoods } from "../services/FoodServices"
import { refreshToken } from "../services/AuthServices"
import { isTokenExpired as checkTokenExpired } from "../utils/tokenUtils"

export const StoreContext = createContext(null)

// ============= STORAGE UTILITIES =============
const STORAGE_KEYS = {
    CART: 'cart',
    TOKEN: 'token',
    REFRESH_TOKEN: 'refreshToken',
    TOKEN_EXPIRY: 'tokenExpiry',
    USER: 'user'
}

// Safe localStorage operations với error handling
const storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : null
        } catch (error) {
            console.error(`Error reading ${key} from localStorage:`, error)
            return null
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
            return true
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error)
            return false
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key)
        } catch (error) {
            console.error(`Error removing ${key} from localStorage:`, error)
        }
    },
    getString: (key) => {
        try {
            return localStorage.getItem(key)
        } catch (error) {
            console.error(`Error reading ${key} from localStorage:`, error)
            return null
        }
    },
    setString: (key, value) => {
        try {
            localStorage.setItem(key, value)
            return true
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error)
            return false
        }
    }
}

// ============= INITIAL STATE GETTERS =============
const getInitialCart = () => {
    const cart = storage.get(STORAGE_KEYS.CART)
    return Array.isArray(cart) ? cart : []
}

export const StoreContextProvider = (props) => {
    // ============= STATE =============
    const [foodList, setFoodList] = useState([])
    const [cart, setCart] = useState(getInitialCart())
    const [token, setToken] = useState("")
    const [user, setUser] = useState(null)
    const [isTokenLoading, setIsTokenLoading] = useState(true)
    
    // Refs to prevent infinite loops
    const isInitializing = useRef(true)
    const tokenCheckInterval = useRef(null)

    // ============= FOOD LIST =============
    const fetchFoodList = async () => {
        try {
            const response = await getFoods()
            setFoodList(response?.data?.data || [])
        } catch (error) {
            console.error('Error fetching food list:', error)
            setFoodList([])
        }
    }

    // ============= CART OPERATIONS =============
    const increaseQuantity = useCallback((itemId) => {
        setCart(prevCart => 
            prevCart.map(cartItem => 
                cartItem.id === itemId
                    ? { ...cartItem, quantity: Number(cartItem.quantity) + 1 }
                    : cartItem
            )
        )
    }, [])

    const decreaseQuantity = useCallback((itemId) => {
        setCart(prevCart => 
            prevCart.map(cartItem => 
                cartItem.id === itemId
                    ? { ...cartItem, quantity: Math.max(1, Number(cartItem.quantity) - 1) }
                    : cartItem
            )
        )
    }, [])

    const addToCart = useCallback((item) => {
        setCart(prevCart => {
            const found = prevCart.find(cartItem => cartItem.id === item.id)
            if (found) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: Number(cartItem.quantity) + 1 }
                        : cartItem
                )
            } else {
                return [...prevCart, { ...item, quantity: 1 }]
            }
        })
    }, [])

    const removeFromCart = useCallback((id) => {
        setCart(prevCart => prevCart.filter(cartItem => cartItem.id !== id))
    }, [])

    const clearCart = useCallback(() => {
        setCart([])
        storage.remove(STORAGE_KEYS.CART)
    }, [])

    // ============= AUTHENTICATION =============
    const clearAuthData = useCallback(() => {
        // Clear localStorage
        storage.remove(STORAGE_KEYS.TOKEN)
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
        storage.remove(STORAGE_KEYS.TOKEN_EXPIRY)
        storage.remove(STORAGE_KEYS.USER)
        
        // Clear state
        setToken('')
        setUser(null)
        
        // Clear token check interval
        if (tokenCheckInterval.current) {
            clearInterval(tokenCheckInterval.current)
            tokenCheckInterval.current = null
        }
    }, [])

    const logout = useCallback(() => {
        clearAuthData()
    }, [clearAuthData])

    const saveAuthData = useCallback((tokenData, userData = null) => {
        // Save token data
        if (tokenData.accessToken) {
            storage.setString(STORAGE_KEYS.TOKEN, tokenData.accessToken)
            setToken(tokenData.accessToken)
        }
        
        if (tokenData.refreshToken) {
            storage.setString(STORAGE_KEYS.REFRESH_TOKEN, tokenData.refreshToken)
        }
        
        if (tokenData.expiryTime) {
            storage.setString(STORAGE_KEYS.TOKEN_EXPIRY, tokenData.expiryTime.toString())
        }
        
        // Save user data if provided
        if (userData) {
            storage.set(STORAGE_KEYS.USER, userData)
            setUser(userData)
        }
    }, [])

    const isTokenExpired = useCallback(() => {
        const tokenExpiry = storage.getString(STORAGE_KEYS.TOKEN_EXPIRY)
        return checkTokenExpired(tokenExpiry)
    }, [])

    const checkTokenExpiry = useCallback(() => {
        if (token && isTokenExpired()) {
            clearAuthData()
            return true
        }
        return false
    }, [token, isTokenExpired, clearAuthData])

    // Refresh token function
    const refreshTokenFunction = useCallback(async () => {
        try {
            const refreshTokenValue = storage.getString(STORAGE_KEYS.REFRESH_TOKEN)
            if (!refreshTokenValue) {
                clearAuthData()
                return false
            }

            // Gọi API refresh token
            const response = await refreshToken(refreshTokenValue)

            if (response?.success) {
                const tokens = response?.data?.tokens
                
                // Cập nhật token mới
                const newTokenData = {
                    accessToken: tokens?.accessToken,
                    refreshToken: tokens?.refreshToken || refreshTokenValue,
                    expiryTime: tokens?.expiryTime || (Date.now() + (30 * 60 * 1000))
                }
                
                saveAuthData(newTokenData)
                console.log('Token refreshed successfully')
                return true
            } else {
                console.log('Refresh token failed:', response?.message)
                clearAuthData()
                return false
            }
        } catch (error) {
            console.error('Refresh token error:', error)
            clearAuthData()
            return false
        }
    }, [clearAuthData, saveAuthData])

    // ============= CONTEXT VALUE =============
    const contextValue = {
        foodList,
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        token,
        setToken,
        user,
        setUser,
        isTokenLoading,
        logout,
        clearAuthData,
        saveAuthData,
        isTokenExpired,
        checkTokenExpiry,
        refreshTokenFunction
    }

    // ============= EFFECTS =============
    
    // 1. Initial load - chỉ chạy 1 lần khi mount
    useEffect(() => {
        const initializeContext = async () => {
            setIsTokenLoading(true)
            
            // Fetch food list
            await fetchFoodList()
            
            // Load auth data từ localStorage
            const storedToken = storage.getString(STORAGE_KEYS.TOKEN)
            const storedUser = storage.get(STORAGE_KEYS.USER)
            
            if (storedToken) {
                // Check if token is expired
                const tokenExpiry = storage.getString(STORAGE_KEYS.TOKEN_EXPIRY)
                if (checkTokenExpired(tokenExpiry)) {
                    // Token expired, clear all
                    clearAuthData()
                } else {
                    // Token valid, set state
                    setToken(storedToken)
                    setUser(storedUser)
                }
            }
            
            setIsTokenLoading(false)
            isInitializing.current = false
        }

        initializeContext()
    }, []) // Empty dependency array - chỉ chạy 1 lần

    // 2. Cart persistence - lưu cart khi thay đổi
    useEffect(() => {
        if (isInitializing.current) return
        
        if (cart.length > 0) {
            storage.set(STORAGE_KEYS.CART, cart)
        } else {
            storage.remove(STORAGE_KEYS.CART)
        }
    }, [cart])

    // 3. Listen for storage changes from other tabs/windows
    useEffect(() => {
        const handleStorageChange = (e) => {
            // Chỉ xử lý nếu không đang loading và không phải initial mount
            if (isTokenLoading || isInitializing.current) return

            // Token changed
            if (e.key === STORAGE_KEYS.TOKEN) {
                const newToken = e.newValue
                if (!newToken && token) {
                    // Token was removed, logout
                    clearAuthData()
                } else if (newToken && newToken !== token) {
                    setToken(newToken)
                }
            }
            
            // User changed
            if (e.key === STORAGE_KEYS.USER) {
                try {
                    const newUser = e.newValue ? JSON.parse(e.newValue) : null
                    if (JSON.stringify(newUser) !== JSON.stringify(user)) {
                        setUser(newUser)
                    }
                } catch (error) {
                    console.error('Error parsing user from storage event:', error)
                }
            }

            // Cart changed
            if (e.key === STORAGE_KEYS.CART) {
                try {
                    const newCart = e.newValue ? JSON.parse(e.newValue) : []
                    if (JSON.stringify(newCart) !== JSON.stringify(cart)) {
                        setCart(Array.isArray(newCart) ? newCart : [])
                    }
                } catch (error) {
                    console.error('Error parsing cart from storage event:', error)
                }
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [token, user, cart, isTokenLoading, clearAuthData])

    // 4. Auto check token expiry and proactively refresh if needed
    useEffect(() => {
        // Clear existing interval
        if (tokenCheckInterval.current) {
            clearInterval(tokenCheckInterval.current)
            tokenCheckInterval.current = null
        }

        // Nếu không có token hoặc đang loading, không check
        if (!token || isTokenLoading || isInitializing.current) return

        const checkAndRefreshToken = async () => {
            const tokenExpiry = storage.getString(STORAGE_KEYS.TOKEN_EXPIRY)
            if (!tokenExpiry) {
                console.warn('Token expiry not found, logging out...')
                clearAuthData()
                return
            }

            const remainingTime = parseInt(tokenExpiry) - Date.now()
            const fiveMinutes = 5 * 60 * 1000 // 5 phút
            
            // Nếu token đã hết hạn thì logout
            if (remainingTime <= 0) {
                console.log('Token đã hết hạn, logout user')
                clearAuthData()
                return
            }
            
            // Nếu token còn ít hơn 5 phút thì proactive refresh
            if (remainingTime < fiveMinutes) {
                console.log(`Token sắp hết hạn (còn ${Math.round(remainingTime / 1000 / 60)} phút), đang refresh...`)
                const success = await refreshTokenFunction()
                if (!success) {
                    console.log('Proactive refresh failed, user will need to login again')
                }
            }
        }

        // Check ngay lập tức
        checkAndRefreshToken()

        // Check mỗi 1 phút (tăng tần suất để catch expiry sớm hơn)
        tokenCheckInterval.current = setInterval(checkAndRefreshToken, 60 * 1000)
        
        return () => {
            if (tokenCheckInterval.current) {
                clearInterval(tokenCheckInterval.current)
                tokenCheckInterval.current = null
            }
        }
    }, [token, isTokenLoading, refreshTokenFunction, clearAuthData])

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
