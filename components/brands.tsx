"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent } from "@/components/ui/card"
import LoadingSpinner from "./loading-spinner"

interface Brand {
    id: number
    name: string
    description: string
    logoUrl?: string
}

export default function Brands() {
    const [brands, setBrands] = useState<Brand[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBrands()
    }, [])

    const fetchBrands = async () => {
        try {
            setLoading(true)
            // Don't send auth headers for public endpoints
            const response = await apiClient.get("/api/brands", {
                headers: {}
            })
            setBrands(response.data || [])
        } catch (error) {
            console.error("Failed to fetch brands:", error)
            setBrands([]) // Only set empty array, no fallback data
        } finally {
            setLoading(false)
        }
    }

    if (brands.length === 0) {
        return (
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="inline-block px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-medium mb-4">
                            🏆 Premium Brands
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-800 to-purple-900 bg-clip-text text-transparent">
                            Shop by Brand
                        </h2>
                        <p className="text-gray-600">No brands available at the moment.</p>
                    </div>
                </div>
            </section>
        )
    }

    if (loading) return <LoadingSpinner />

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-medium mb-4">
                        🏆 Premium Brands
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-800 to-purple-900 bg-clip-text text-transparent">
                        Shop by Brand
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Explore fragrances from the world's most prestigious and beloved perfume houses
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
                    {brands.map((brand) => (
                        <Link key={brand.id} href={`/products?brand=${brand.id}`}>
                            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-200 bg-gradient-to-br from-white to-gray-50">
                                <CardContent className="p-6 text-center">
                                    <div className="mb-4 relative">
                                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Image
                                                src={brand.logoUrl || `/placeholder.svg?height=40&width=40&query=${brand.name} logo`}
                                                alt={brand.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-purple-800 transition-colors text-sm">
                                        {brand.name}
                                    </h3>
                                    {brand.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{brand.description}</p>}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}