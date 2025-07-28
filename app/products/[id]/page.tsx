"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { apiClient } from "@/lib/api-client"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, ShoppingCart, Minus, Plus } from "lucide-react"
import LoadingSpinner from "@/components/loading-spinner"
import PerfumeCard from "@/components/perfume-card"
import RatingSection from "@/components/rating-section"

interface Perfume {
  id: number
  name: string
  description: string
  price: number
  discountedPrice?: number
  imageUrl: string
  stockQuantity: number
  brand: { id: number; name: string }
  category: { id: number; name: string }
  discountPercent: number
  fragranceFamily: string
  gender: string
  volume: string
  averageRating: number
  ratingCount: number
  canRating: boolean
  rating?: any
  favorite: boolean
  bestseller: boolean
  featured: boolean
}

export default function ProductDetailPage() {
  const params = useParams()
  const [perfume, setPerfume] = useState<Perfume | null>(null)
  const [similarPerfumes, setSimilarPerfumes] = useState<Perfume[]>([])
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)

  const { addToCart } = useCart()
  const { user, token } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (params.id) {
      fetchPerfume()
      fetchSimilarPerfumes()
    }
  }, [params.id])

  const fetchPerfume = async () => {
    try {
      const response = await apiClient.get(`/api/perfumes/${params.id}`)
      setPerfume(response.data)
      setIsFavorite(response.data.favorite)
    } catch (error) {
      console.error("Failed to fetch perfume:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSimilarPerfumes = async () => {
    try {
      const response = await apiClient.get(`/api/perfumes/${params.id}/similar`)
      setSimilarPerfumes(response.data)
    } catch (error) {
      console.error("Failed to fetch similar perfumes:", error)
    }
  }

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
      setAddingToCart(true)
      await addToCart(perfume!.id, quantity)
      toast({
        title: "Added to cart",
        description: `${perfume!.name} has been added to your cart`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setAddingToCart(false)
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
      await apiClient.post(
        `/api/favorites/toggle/${perfume!.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setIsFavorite(!isFavorite)
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: `${perfume!.name} has been ${isFavorite ? "removed from" : "added to"} your favorites`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      })
    }
  }

  if (loading) return <LoadingSpinner />
  if (!perfume) return <div>Perfume not found</div>

  const displayPrice = perfume.discountedPrice || perfume.price
  const volumeDisplay = perfume.volume.replace("ML_", "") + "ml"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative">
            <Image
              src={perfume.imageUrl || "/placeholder.svg?height=600&width=600&query=perfume bottle"}
              alt={perfume.name}
              width={600}
              height={600}
              className="w-full rounded-lg shadow-lg"
            />

            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {perfume.featured && <Badge className="bg-yellow-500 hover:bg-yellow-600">Featured</Badge>}
              {perfume.bestseller && <Badge className="bg-green-500 hover:bg-green-600">Bestseller</Badge>}
              {perfume.discountedPrice && <Badge variant="destructive">{perfume.discountPercent}% OFF</Badge>}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-2">{perfume.brand.name}</p>
            <h1 className="text-3xl font-bold mb-4">{perfume.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(perfume.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{perfume.averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({perfume.ratingCount} reviews)</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold">${displayPrice.toFixed(2)}</span>
              {perfume.discountedPrice && (
                <span className="text-xl text-muted-foreground line-through">${perfume.price.toFixed(2)}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{perfume.category.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Volume</p>
                <p className="font-medium">{volumeDisplay}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{perfume.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fragrance Family</p>
                <p className="font-medium">{perfume.fragranceFamily}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(perfume.stockQuantity, quantity + 1))}
                  disabled={quantity >= perfume.stockQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{perfume.stockQuantity} in stock</p>
            </div>

            <div className="flex gap-4 mb-6">
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart || perfume.stockQuantity === 0}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </Button>
              <Button variant="outline" size="lg" onClick={handleToggleFavorite}>
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>

            {perfume.stockQuantity === 0 && <p className="text-red-500 font-medium">Out of stock</p>}
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({perfume.ratingCount})</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                {perfume.description || "No description available for this perfume."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <RatingSection perfumeId={perfume.id} canRate={perfume.canRating} />
        </TabsContent>
      </Tabs>

      {/* Similar Products */}
      {similarPerfumes.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarPerfumes.map((similar) => (
              <PerfumeCard key={similar.id} perfume={similar} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
