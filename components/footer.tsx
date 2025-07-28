import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
              <span className="font-bold text-xl">PerfumeShop</span>
            </div>
            <p className="text-gray-400 mb-4">Your destination for premium fragrances and luxury perfumes.</p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 hover:text-purple-400 cursor-pointer" />
              <Instagram className="h-5 w-5 hover:text-purple-400 cursor-pointer" />
              <Twitter className="h-5 w-5 hover:text-purple-400 cursor-pointer" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/products" className="hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="hover:text-white">
                  Featured
                </Link>
              </li>
              <li>
                <Link href="/products?bestseller=true" className="hover:text-white">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/products?gender=MALE" className="hover:text-white">
                  Men's Fragrances
                </Link>
              </li>
              <li>
                <Link href="/products?gender=FEMALE" className="hover:text-white">
                  Women's Fragrances
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/profile" className="hover:text-white">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-white">
                  Favorites
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} PerfumeShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
