import { Suspense } from "react"
import HeroSection from "@/components/hero-section"
import FeaturedPerfumes from "@/components/featured-perfumes"
import Brands from "@/components/brands"
import Categories from "@/components/categories"
import BestSellers from "@/components/bestsellers"
import LoadingSpinner from "@/components/loading-spinner"

export default function HomePage() {
    return (
        <div className="min-h-screen">
            <HeroSection />

            <Suspense fallback={<LoadingSpinner />}>
                <FeaturedPerfumes />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
                <Brands />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
                <Categories />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
                <BestSellers />
            </Suspense>
        </div>
    )
}
