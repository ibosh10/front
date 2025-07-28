"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "./auth-context"

interface CartItem {
  id: number
  perfume: {
    id: number
    name: string
    price: number
    discountedPrice?: number
    imageUrl: string
    brand: { name: string }
  }
  quantity: number
  subtotal: number
}

interface Cart {
  id: number
  items: CartItem[]
  totalPrice: number
  totalItems: number
}

interface CartContextType {
  cart: Cart | null
  addToCart: (perfumeId: number, quantity: number) => Promise<void>
  updateCartItem: (perfumeId: number, quantity: number) => Promise<void>
  removeFromCart: (perfumeId: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  loading: boolean
  error: string | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token, user } = useAuth()

  useEffect(() => {
    if (token && user) {
      refreshCart()
    }
  }, [token, user])

  const refreshCart = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get("/carts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCart(response.data)
    } catch (error: any) {
      console.error("Failed to fetch cart:", error)
      setError("Failed to load cart")
      // Don't throw error, just set empty cart
      setCart(null)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (perfumeId: number, quantity: number) => {
    if (!token) throw new Error("Not authenticated")

    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(
          "/carts/add",
          { perfumeId, quantity },
          { headers: { Authorization: `Bearer ${token}` } },
      )
      setCart(response.data)
    } catch (error: any) {
      console.error("Failed to add to cart:", error)
      const errorMessage = error.response?.data?.message || "Failed to add to cart"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateCartItem = async (perfumeId: number, quantity: number) => {
    if (!token) throw new Error("Not authenticated")

    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(
          `/carts/update?perfumeId=${perfumeId}&quantity=${quantity}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
      )
      setCart(response.data)
    } catch (error: any) {
      console.error("Failed to update cart:", error)
      const errorMessage = error.response?.data?.message || "Failed to update cart"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (perfumeId: number) => {
    if (!token) throw new Error("Not authenticated")

    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.delete(`/carts/remove/${perfumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCart(response.data)
    } catch (error: any) {
      console.error("Failed to remove from cart:", error)
      const errorMessage = error.response?.data?.message || "Failed to remove from cart"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    if (!token) throw new Error("Not authenticated")

    try {
      setLoading(true)
      setError(null)
      await apiClient.delete("/carts/clear", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCart(null)
    } catch (error: any) {
      console.error("Failed to clear cart:", error)
      const errorMessage = error.response?.data?.message || "Failed to clear cart"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
      <CartContext.Provider
          value={{
            cart,
            addToCart,
            updateCartItem,
            removeFromCart,
            clearCart,
            refreshCart,
            loading,
            error,
          }}
      >
        {children}
      </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
