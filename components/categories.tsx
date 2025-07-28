"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent } from "@/components/ui/card"
import LoadingSpinner from "./loading-spinner"

interface Category {
  id: number
  name: string
  description: string
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      // Don't send auth headers for public endpoints
      const response = await apiClient.get("/api/categories", {
        headers: {}
      })
      setCategories(response.data || [])
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      setCategories([]) // Only set empty array, no fallback data
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (categories.length === 0) {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                🎯 Shop by Category
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-800 to-purple-900 bg-clip-text text-transparent">
                Fragrance Categories
              </h2>
              <p className="text-gray-600">No categories available at the moment.</p>
            </div>
          </div>
        </section>
    )
  }

  return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              🎯 Shop by Category
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-800 to-purple-900 bg-clip-text text-transparent">
              Fragrance Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Explore our diverse range of fragrance categories to find your perfect match
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
                <Link key={category.id} href={`/products?category=${category.id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-200 bg-gradient-to-br from-white to-blue-50/30">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Image
                              src={`/placeholder.svg?height=50&width=50&query=${category.name} perfume category icon`}
                              alt={category.name}
                              width={50}
                              height={50}
                              className="rounded-full"
                          />
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-800 transition-colors text-sm mb-2">
                        {category.name}
                      </h3>
                      {category.description && <p className="text-xs text-gray-500 line-clamp-2">{category.description}</p>}
                    </CardContent>
                  </Card>
                </Link>
            ))}
          </div>
        </div>
      </section>
  )
}
