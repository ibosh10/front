"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import PerfumeCard from "./perfume-card"
import LoadingSpinner from "./loading-spinner"

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

export default function BestSellers() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBestSellers()
  }, [])

  const fetchBestSellers = async () => {
    try {
      setLoading(true)

      // Try bestsellers endpoint first
      let response
      try {
        // Don't send auth headers for public endpoints
        response = await apiClient.get("/api/perfumes/bestsellers", {
          headers: {}
        })
      } catch (bestsellerError) {
        console.log("Bestsellers endpoint failed, trying all perfumes:", bestsellerError)
        // Fallback to all perfumes
        response = await apiClient.get("/api/perfumes", {
          headers: {}
        })
      }

      const allPerfumes = response.data || []

      // Filter bestseller perfumes or take first 8
      const bestsellerPerfumes = allPerfumes.filter((p: Perfume) => p.bestseller)
      setPerfumes(bestsellerPerfumes.length > 0 ? bestsellerPerfumes.slice(0, 8) : allPerfumes.slice(0, 8))
    } catch (error) {
      console.error("Failed to fetch perfumes:", error)
      setPerfumes([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              🔥 Best Sellers
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-green-800 to-blue-800 bg-clip-text text-transparent">
              Customer Favorites
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our most popular fragrances loved by customers worldwide
            </p>
          </div>

          {perfumes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔥</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No bestsellers available</h3>
                <p className="text-gray-600">Please check back later or contact support if this persists.</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {perfumes.map((perfume) => (
                    <PerfumeCard key={perfume.id} perfume={perfume} />
                ))}
              </div>
          )}
        </div>
      </section>
  )
}
