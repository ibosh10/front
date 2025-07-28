"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

interface Perfume {
  id: number
  name: string
  description: string
  price: number
  discountedPrice?: number
  imageUrl: string
  brand: { name: string }
  category: { name: string }
  averageRating: number
  ratingCount: number
  favorite: boolean
  featured: boolean
  bestseller: boolean
}

interface PerfumeCardProps {
  perfume: Perfume
}

export default function PerfumeCard({ perfume }: PerfumeCardProps) {
  const [isFavorite, setIsFavorite] = useState(perfume.favorite)
  const [loading, setLoading] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const { addToCart } = useCart()
  const { user, token } = useAuth()
  const { toast } = useToast()

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to add items to cart",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await addToCart(perfume.id, 1)
      toast({
        title: "Added to cart",
        description: `${perfume.name} has been added to your cart`,
      })
    } catch (error: any) {
      console.error("Add to cart error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = async () => {
    if (!user || !token) {
      toast({
        title: "Authentication required",
        description: "Please login to add favorites",
        variant: "destructive",
      })
      return
    }

    try {
      setFavoriteLoading(true)
      await apiClient.post(
          `/api/favorites/toggle/${perfume.id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
      )
      setIsFavorite(!isFavorite)
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: `${perfume.name} has been ${isFavorite ? "removed from" : "added to"} your favorites`,
      })
    } catch (error: any) {
      console.error("Toggle favorite error:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update favorites",
        variant: "destructive",
      })
    } finally {
      setFavoriteLoading(false)
    }
  }

  const displayPrice = perfume.discountedPrice || perfume.price
  const discountPercent = perfume.discountedPrice
      ? Math.round(((perfume.price - perfume.discountedPrice) / perfume.price) * 100)
      : 0

  return (
      <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 bg-white rounded-2xl overflow-hidden hover:-translate-y-2">
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <Link href={`/products/${perfume.id}`}>
              <Image
                  src={perfume.imageUrl || "/placeholder.svg?height=300&width=300&query=luxury perfume bottle"}
                  alt={perfume.name}
                  width={300}
                  height={300}
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </Link>

            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {perfume.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg">
                    ⭐ Featured
                  </Badge>
              )}
              {perfume.bestseller && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg">
                    🔥 Bestseller
                  </Badge>
              )}
              {discountPercent > 0 && (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg">
                    -{discountPercent}% OFF
                  </Badge>
              )}
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 bg-white/90 hover:bg-white shadow-lg rounded-full"
                onClick={handleToggleFavorite}
                disabled={favoriteLoading}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </Button>

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="p-6">
            <div className="mb-3">
              <p className="text-sm text-purple-600 font-medium">{perfume.brand.name}</p>
              <Link href={`/products/${perfume.id}`}>
                <h3 className="font-bold text-lg hover:text-purple-800 transition-colors line-clamp-2 text-gray-900">
                  {perfume.name}
                </h3>
              </Link>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${
                            i < Math.floor(perfume.averageRating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                    />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">{(perfume.averageRating || 0).toFixed(1)}</span>
              <span className="text-sm text-gray-500">({perfume.ratingCount || 0})</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-gray-900">${displayPrice.toFixed(2)}</span>
              {perfume.discountedPrice && (
                  <span className="text-lg text-gray-500 line-through">${perfume.price.toFixed(2)}</span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
              onClick={handleAddToCart}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {loading ? "Adding..." : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
  )
}
