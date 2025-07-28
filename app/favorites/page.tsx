"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Link from "next/link"
import PerfumeCard from "@/components/perfume-card"
import LoadingSpinner from "@/components/loading-spinner"

interface Favorite {
  id: number
  perfume: {
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
  createdAt: string
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user && token) {
      fetchFavorites()
    } else {
      setLoading(false)
    }
  }, [user, token])

  const fetchFavorites = async () => {
    try {
      const response = await apiClient.get("/api/favorites/my-favorites", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setFavorites(response.data)
    } catch (error) {
      console.error("Failed to fetch favorites:", error)
      toast({
        title: "Error",
        description: "Failed to load favorites",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your favorites</p>
        <Button asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
      </div>
    )
  }

  if (loading) return <LoadingSpinner />

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">No Favorites Yet</h1>
        <p className="text-muted-foreground mb-6">Start adding perfumes to your favorites to see them here</p>
        <Button asChild>
          <Link href="/products">Browse Perfumes</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
          <p className="text-muted-foreground">
            {favorites.length} perfume{favorites.length !== 1 ? "s" : ""} in your favorites
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((favorite) => (
          <PerfumeCard key={favorite.id} perfume={favorite.perfume} />
        ))}
      </div>
    </div>
  )
}
