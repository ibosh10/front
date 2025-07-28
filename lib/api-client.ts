import axios from "axios"

export const apiClient = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if (token && typeof window !== "undefined") {
            config.headers.Authorization = `Bearer ${token}`
            console.log("🔑 Adding auth token to request:", config.url)
        } else {
            console.log("🔓 No auth token for request:", config.url)
            // Remove Authorization header if no token
            delete config.headers.Authorization
        }
        return config
    },
    (error) => {
        console.error("❌ Request interceptor error:", error)
        return Promise.reject(error)
    },
)

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        console.log("✅ API Response:", response.config.url, response.status)
        return response
    },
    (error) => {
        console.error("❌ API Error:", error.config?.url, error.response?.status, error.message)

        // Log detailed error information
        if (error.response) {
            console.error("Error Response Data:", error.response.data)
            console.error("Error Response Status:", error.response.status)
            console.error("Error Response Headers:", error.response.headers)
        }

        // Handle network errors
        if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
            console.error("🔌 Backend server is not running or not accessible")
            return Promise.reject(new Error("Unable to connect to server. Please check if the backend is running."))
        }

        // Handle timeout errors
        if (error.code === "ECONNABORTED") {
            console.error("⏰ Request timeout")
            return Promise.reject(new Error("Request timeout. Please try again."))
        }

        // Handle authentication errors
        if (error.response?.status === 401) {
            console.error("🚫 Authentication failed")
            const isAuthRoute = error.config?.url?.includes("/auth/")
            if (!isAuthRoute) {
                console.log("🔄 Removing invalid token and redirecting to login")
                localStorage.removeItem("token")
                if (typeof window !== "undefined") {
                    window.location.href = "/auth/login"
                }
            }
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
            console.error("🚫 Access forbidden")
        }

        // Handle 500 Internal Server Error
        if (error.response?.status === 500) {
            console.error("💥 Internal server error")
        }

        return Promise.reject(error)
    },
)
