"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Brand {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
}

interface ProductFiltersProps {
  onFilterChange: (filters: any) => void
}

export default function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedGender, setSelectedGender] = useState("")
  const [selectedFragranceFamily, setSelectedFragranceFamily] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchBrands()
    fetchCategories()
  }, [])

  const fetchBrands = async () => {
    try {
      const response = await apiClient.get("/api/brands")
      setBrands(response.data || [])
    } catch (error) {
      console.error("Failed to fetch brands:", error)
      setBrands([]) // No fallback data
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/api/categories")
      setCategories(response.data || [])
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      setCategories([]) // No fallback data
    }
  }

  const applyFilters = () => {
    const filters = {
      brandId: selectedBrand,
      categoryId: selectedCategory,
      gender: selectedGender || undefined,
      fragranceFamily: selectedFragranceFamily || undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
    }

    // Remove undefined values
    const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null && value !== ""),
    )

    onFilterChange(cleanFilters)

    // Update URL
    const params = new URLSearchParams()
    Object.entries(cleanFilters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString())
    })

    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedBrand(null)
    setSelectedCategory(null)
    setSelectedGender("")
    setSelectedFragranceFamily("")
    setPriceRange([0, 1000])
    onFilterChange({})
    router.push("/products")
  }

  return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Price Range */}
            <div>
              <Label className="text-sm font-medium">Price Range</Label>
              <div className="mt-2">
                <Slider value={priceRange} onValueChange={setPriceRange} max={1000} step={10} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Gender */}
            <div>
              <Label className="text-sm font-medium">Gender</Label>
              <RadioGroup value={selectedGender} onValueChange={setSelectedGender} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="all-gender" />
                  <Label htmlFor="all-gender">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MALE" id="male" />
                  <Label htmlFor="male">Men</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="FEMALE" id="female" />
                  <Label htmlFor="female">Women</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="UNISEX" id="unisex" />
                  <Label htmlFor="unisex">Unisex</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Fragrance Family */}
            <div>
              <Label className="text-sm font-medium">Fragrance Family</Label>
              <RadioGroup value={selectedFragranceFamily} onValueChange={setSelectedFragranceFamily} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="all-fragrance" />
                  <Label htmlFor="all-fragrance">All</Label>
                </div>
                {[
                  "FLORAL",
                  "ORIENTAL",
                  "WOODY",
                  "FRESH",
                  "FRUITY",
                  "SPICY",
                  "CITRUS",
                  "AQUATIC",
                  "GREEN",
                  "GOURMAND",
                ].map((family) => (
                    <div key={family} className="flex items-center space-x-2">
                      <RadioGroupItem value={family} id={family.toLowerCase()} />
                      <Label htmlFor={family.toLowerCase()}>{family.charAt(0) + family.slice(1).toLowerCase()}</Label>
                    </div>
                ))}
              </RadioGroup>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Brands</Label>
                  <RadioGroup
                      value={selectedBrand?.toString() || ""}
                      onValueChange={(value) => setSelectedBrand(value ? Number.parseInt(value) : null)}
                      className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="" id="all-brands" />
                      <Label htmlFor="all-brands">All Brands</Label>
                    </div>
                    {brands.map((brand) => (
                        <div key={brand.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={brand.id.toString()} id={`brand-${brand.id}`} />
                          <Label htmlFor={`brand-${brand.id}`} className="text-sm">
                            {brand.name}
                          </Label>
                        </div>
                    ))}
                  </RadioGroup>
                </div>
            )}

            {/* Categories */}
            {categories.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Categories</Label>
                  <RadioGroup
                      value={selectedCategory?.toString() || ""}
                      onValueChange={(value) => setSelectedCategory(value ? Number.parseInt(value) : null)}
                      className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="" id="all-categories" />
                      <Label htmlFor="all-categories">All Categories</Label>
                    </div>
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={category.id.toString()} id={`category-${category.id}`} />
                          <Label htmlFor={`category-${category.id}`} className="text-sm">
                            {category.name}
                          </Label>
                        </div>
                    ))}
                  </RadioGroup>
                </div>
            )}

            <div className="flex gap-2">
              <Button onClick={applyFilters} className="flex-1">
                Apply Filters
              </Button>
              <Button onClick={clearFilters} variant="outline" className="flex-1 bg-transparent">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
