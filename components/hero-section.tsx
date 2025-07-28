import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HeroSection() {
  return (
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                  ✨ Premium Fragrance Collection
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Discover Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-300">
                  Perfect Scent
                </span>
                </h1>
                <p className="text-xl text-purple-100 max-w-lg leading-relaxed">
                  Explore our curated collection of premium fragrances from the world's most prestigious brands. Find your
                  signature scent today.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    size="lg"
                    asChild
                    className="bg-white text-purple-900 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/products">Shop Now</Link>
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent backdrop-blur-sm"
                >
                  View Collections
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-purple-200">Premium Fragrances</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-purple-200">Luxury Brands</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm text-purple-200">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-3xl blur-3xl"></div>
              <Image
                  src="/images/hero-perfume.png"
                  alt="Luxury Perfume Collection with Floral Background"
                  width={600}
                  height={700}
                  className="relative rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
                  priority
              />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full blur-xl opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-40"></div>
            </div>
          </div>
        </div>
      </section>
  )
}
