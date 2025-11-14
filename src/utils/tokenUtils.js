// Utility functions for token management

/**
 * Parse expiry time from various formats to milliseconds
 * @param {string|number} expiresIn - Time format like '15m', '2h', '30s', '1d' or seconds as number
 * @returns {number} Milliseconds
 */
export const parseExpiryTime = (expiresIn) => {
  if (typeof expiresIn === 'number') {
    // If it's already a number (seconds), convert to milliseconds
    return expiresIn * 1000
  }
  
  if (typeof expiresIn === 'string') {
    // Parse string formats like '15m', '2h', '30s', '1d'
    const timeValue = parseInt(expiresIn)
    const timeUnit = expiresIn.slice(-1).toLowerCase()
    
    switch (timeUnit) {
      case 's': // seconds
        return timeValue * 1000
      case 'm': // minutes
        return timeValue * 60 * 1000
      case 'h': // hours
        return timeValue * 60 * 60 * 1000
      case 'd': // days
        return timeValue * 24 * 60 * 60 * 1000
      default:
        // If no unit specified, assume it's in seconds
        return parseInt(expiresIn) * 1000
    }
  }
  
  // Default to 30 minutes if can't parse
  return 30 * 60 * 1000
}

/**
 * Check if token is expired
 * @param {string} tokenExpiry - Timestamp string from localStorage
 * @returns {boolean}
 */
export const isTokenExpired = (tokenExpiry) => {
  if (!tokenExpiry) return false
  return Date.now() > parseInt(tokenExpiry)
}

/**
 * Get remaining time until token expires
 * @param {string} tokenExpiry - Timestamp string from localStorage
 * @returns {number} Remaining milliseconds
 */
export const getTokenRemainingTime = (tokenExpiry) => {
  if (!tokenExpiry) return 0
  const remaining = parseInt(tokenExpiry) - Date.now()
  return Math.max(0, remaining)
}

/**
 * Format remaining time to human readable string
 * @param {number} remainingMs - Remaining milliseconds
 * @returns {string}
 */
export const formatRemainingTime = (remainingMs) => {
  if (remainingMs <= 0) return 'Expired'
  
  const minutes = Math.floor(remainingMs / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m`
  return 'Less than 1m'
}
