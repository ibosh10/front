"use client"

import type React from "react"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import PerfumeCard from "@/components/perfume-card"
import LoadingSpinner from "@/components/loading-spinner"
import ProductFilters from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

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

function ProductsContent() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchPerfumes()
  }, [searchParams])

  const fetchPerfumes = async (filters?: any) => {
    try {
      setLoading(true)

      const search = searchParams.get("search")
      const category = searchParams.get("category") || searchParams.get("categoryId")
      const brand = searchParams.get("brand") || searchParams.get("brandId")
      const gender = searchParams.get("gender")
      const featured = searchParams.get("featured")
      const bestseller = searchParams.get("bestseller")

      let url = "/api/perfumes"
      let params: any = {}

      if (search) {
        url = `/api/perfumes/search`
        params.name = search
      } else if (category) {
        url = `/api/perfumes/category/${category}`
      } else if (brand) {
        url = `/api/perfumes/brand/${brand}`
      } else if (gender) {
        url = `/api/perfumes/gender/${gender}`
      } else if (featured === "true") {
        url = "/api/perfumes/featured"
      } else if (bestseller === "true") {
        url = "/api/perfumes/bestsellers"
      } else if (filters) {
        url = "/api/perfumes/filter"
        params = filters
      }

      const response = await apiClient.get(url, { params })
      setPerfumes(response.data || [])
    } catch (error: any) {
      console.error("Failed to fetch perfumes:", error)
      setPerfumes([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      const response = await apiClient.get(`/api/perfumes/search`, {
        params: { name: searchQuery },
      })
      setPerfumes(response.data || [])
    } catch (error: any) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filters: any) => {
    fetchPerfumes(filters)
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-900 to-pink-800 bg-clip-text text-transparent">
              All Perfumes
            </h1>

            <form onSubmit={handleSearch} className="flex gap-3 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                    type="search"
                    placeholder="Search perfumes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl"
                />
              </div>
              <Button
                  type="submit"
                  className="h-12 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Search
              </Button>
            </form>
          </div>

          <div className="flex gap-8">
            <aside className="w-80 hidden lg:block">
              <ProductFilters onFilterChange={handleFilterChange} />
            </aside>

            <main className="flex-1">
              {loading ? (
                  <LoadingSpinner />
              ) : (
                  <>
                    <div className="mb-6">
                      <p className="text-gray-600 text-lg">
                        {perfumes.length} product{perfumes.length !== 1 ? "s" : ""} found
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {perfumes.map((perfume) => (
                          <PerfumeCard key={perfume.id} perfume={perfume} />
                      ))}
                    </div>

                    {perfumes.length === 0 && !loading && (
                        <div className="text-center py-16">
                          <div className="text-6xl mb-4">🔍</div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">No perfumes found</h3>
                          <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                          <Button
                              onClick={() => {
                                setSearchQuery("")
                                fetchPerfumes()
                              }}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            Show All Products
                          </Button>
                        </div>
                    )}
                  </>
              )}
            </main>
          </div>
        </div>
      </div>
  )
}

export default function ProductsPage() {
  return (
      <Suspense fallback={<LoadingSpinner />}>
        <ProductsContent />
      </Suspense>
  )
}
