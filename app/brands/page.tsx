"use client"

import type React from "react"

import { useState, useEffect, useCallback, memo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  Star,
  Users,
  Award,
  Shield,
  Heart,
  ExternalLink,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Package,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Globe,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import Navbar from "@/components/navbar"
import { useCookieContext } from "@/context/cookieContext"

// Types
interface Brand {
  _id: string
  name: string
  logo?: string
  coverImage?: string
  description?: string
  isFeatured: boolean
  isVerified: boolean
  isActive: boolean
  totalOrders: number
  completedOrders: number
  returnPolicy?: string
  warrantyPolicy?: string
  socialMediaHandles?: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
    youtube?: string
  }
  rating?: number
  reviews?: number
  productCount?: number
}

// Memoized Brand Card Component
const BrandCard = memo(({ brand, index = 0 }: { brand: Brand; index?: number }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => setIsHovered(false), [])

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="h-4 w-4" />
      case "instagram":
        return <Instagram className="h-4 w-4" />
      case "twitter":
        return <Twitter className="h-4 w-4" />
      case "linkedin":
        return <Linkedin className="h-4 w-4" />
      case "youtube":
        return <Youtube className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  // Calculate success rate
  const successRate = brand.totalOrders > 0 ? Math.round((brand.completedOrders / brand.totalOrders) * 100) : 0

  return (
    <Card
      className="group overflow-hidden border-0 shadow-lg bg-white rounded-3xl will-change-transform transform-gpu hover-lift-smooth"
      style={{
        animationDelay: `${index * 150}ms`,
        animation: "smoothFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        opacity: 0,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cover Image Section */}
      <div className="relative overflow-hidden">
        <div className="aspect-[2/1] relative bg-gradient-to-br from-[#F2F2F2] to-white">
          <Image
            src={brand.coverImage || "/placeholder.svg?height=300&width=600&query=brand cover image"}
            alt={`${brand.name} cover`}
            fill
            className="object-cover transition-all duration-700 ease-out will-change-transform"
            style={{
              transform: isHovered ? "scale3d(1.05, 1.05, 1)" : "scale3d(1, 1, 1)",
            }}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />

          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-500 ease-out"
            style={{
              opacity: isHovered ? 1 : 0.7,
            }}
          />

          {/* Featured Badge */}
          {brand.isFeatured && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-gradient-to-r from-[#FF6F61] to-[#4FC3F7] text-white border-0 rounded-full px-3 py-1 text-xs font-semibold shadow-lg backdrop-blur-sm">
                <Award className="h-3 w-3 mr-1" />
                FEATURED
              </Badge>
            </div>
          )}

          {/* Verified Badge */}
          {brand.isVerified && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-[#33BF69] to-[#4FC3F7] text-white border-0 rounded-full px-3 py-1 text-xs font-semibold shadow-lg backdrop-blur-sm">
                <Shield className="h-3 w-3 mr-1" />
                VERIFIED
              </Badge>
            </div>
          )}

          {/* Brand Logo */}
          <div className="absolute bottom-4 left-4">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center border-2 border-white/20 backdrop-blur-sm">
              <Image
                src={brand.logo || "/placeholder.svg?height=48&width=48&query=brand logo"}
                alt={`${brand.name} logo`}
                width={48}
                height={48}
                className="rounded-xl object-cover"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {brand.rating && (
              <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-[#455A64] shadow-lg">
                <Star className="h-3 w-3 inline mr-1 text-yellow-400 fill-current" />
                {brand.rating}
              </div>
            )}
            {brand.productCount && (
              <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-[#455A64] shadow-lg">
                <Package className="h-3 w-3 inline mr-1 text-[#4FC3F7]" />
                {brand.productCount}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-6 space-y-4">
        {/* Brand Name & Rating */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-xl text-[#455A64] mb-1 group-hover:text-[#33BF69] transition-colors duration-300">
              {brand.name}
            </h3>
            {brand.rating && brand.reviews && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(brand.rating!) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">({brand.reviews} reviews)</span>
                </div>
              </div>
            )}
          </div>
          {/* <Button size="icon" variant="ghost" className="text-[#FF6F61] hover:bg-[#FF6F61]/10 rounded-full">
            <Heart className="h-4 w-4" />
          </Button> */}
        </div>

        {/* Description */}
        {brand.description && <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{brand.description.slice(0,100)}</p>}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-bold text-[#33BF69]">{brand.completedOrders}</div>
            <div className="text-xs text-gray-500">Orders Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#4FC3F7]">{successRate}%</div>
            <div className="text-xs text-gray-500">Success Rate</div>
          </div>
        </div>

        {/* Policies */}
        {(brand.returnPolicy || brand.warrantyPolicy) && (
          <div className="space-y-2">
            {brand.returnPolicy && (
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-[#33BF69] mt-0.5 flex-shrink-0" />
                <span className="text-xs text-gray-600">{brand.returnPolicy.slice(0,100)}</span>
              </div>
            )}
            {brand.warrantyPolicy && (
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-[#4FC3F7] mt-0.5 flex-shrink-0" />
                <span className="text-xs text-gray-600">{brand.warrantyPolicy}</span>
              </div>
            )}
          </div>
        )}

        {/* Social Media */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex gap-2">
            {brand.socialMediaHandles &&
              Object.entries(brand.socialMediaHandles).map(([platform, handle]) => (
               <Link href={handle}>
                <Button
                  key={platform}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-gray-400 hover:text-[#4FC3F7] hover:bg-[#4FC3F7]/10 rounded-full transition-all duration-300"
                >
                  {getSocialIcon(platform)}
                </Button>
               </Link>
              ))}
          </div>
          <Link href={`/brands/${brand._id}`}>
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#4FC3F7] to-[#33BF69] hover:from-[#33BF69] hover:to-[#4FC3F7] text-white rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-105"
            >
              View Products
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
})

BrandCard.displayName = "BrandCard"

// Loading Skeleton Component
const BrandSkeleton = () => (
  <Card className="overflow-hidden border-0 shadow-lg bg-white rounded-3xl">
    <div className="aspect-[2/1] relative">
      <Skeleton className="w-full h-full" />
    </div>
    <CardContent className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="grid grid-cols-2 gap-4 py-3">
        <div className="text-center space-y-1">
          <Skeleton className="h-6 w-12 mx-auto" />
          <Skeleton className="h-3 w-16 mx-auto" />
        </div>
        <div className="text-center space-y-1">
          <Skeleton className="h-6 w-12 mx-auto" />
          <Skeleton className="h-3 w-16 mx-auto" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </CardContent>
  </Card>
)

// Empty State Component
const EmptyState = ({ searchQuery, onClearSearch }: { searchQuery: string; onClearSearch: () => void }) => (
  <div className="text-center py-16">
    <div className="w-24 h-24 bg-gradient-to-br from-[#4FC3F7]/20 to-[#33BF69]/20 rounded-full flex items-center justify-center mx-auto mb-6">
      <Search className="h-12 w-12 text-[#4FC3F7]" />
    </div>
    <h3 className="text-2xl font-bold text-[#455A64] mb-2">
      {searchQuery ? `No brands found for "${searchQuery}"` : "No brands found"}
    </h3>
    <p className="text-gray-600 mb-6">
      {searchQuery ? "Try adjusting your search terms" : "No brands are currently available"}
    </p>
    {searchQuery && (
      <Button
        onClick={onClearSearch}
        className="bg-gradient-to-r from-[#4FC3F7] to-[#33BF69] text-white rounded-full px-6 py-2"
      >
        Clear Search
      </Button>
    )}
  </div>
)

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { cookieValue } = useCookieContext()
  const api=process.env.NEXT_PUBLIC_API_URL
  const [userdata,setuserdata]=useState<any>()
  const userProfile=async()=>{
    try{
      setLoading(true)
      const response = await fetch(`${api}/api/home/profile-summary`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookieValue}`,
          },
      });
      const data = await response.json();
      setuserdata(data)


    }catch(err){
      console.log(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (cookieValue) {
      userProfile()
    }
  }, [cookieValue])
  // Debounced search function
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  }, [])

  // API call to fetch brands
  const fetchBrands = useCallback(async (search = "") => {
    try {
      if (search) {
        setSearchLoading(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const url = new URL(`${api}/api/brandpage/brands`)
      if (search.trim()) {
        url.searchParams.append("search", search.trim())
      }

      const response = await fetch(url.toString(),{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            },

      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Filter only verified and active brands
      const filteredBrands = data.brands.filter((brand: Brand) => brand.isVerified && brand.isActive)

      setBrands(filteredBrands)
    } catch (error) {
      console.error("Error fetching brands:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch brands")
      setBrands([])
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }, [])

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      fetchBrands(query)
    }, 500),
    [fetchBrands],
  )

  // Initial load
  useEffect(() => {
    fetchBrands()
  }, [fetchBrands])

  // Handle search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchQuery(value)
      debouncedSearch(value)
    },
    [debouncedSearch],
  )

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery("")
    fetchBrands()
  }, [fetchBrands])

  // Filter brands based on featured filter
  const filteredBrands = showFeaturedOnly ? brands.filter((brand) => brand.isFeatured) : brands

  // Calculate stats
  const totalProducts = brands.reduce((sum, brand) => sum + (brand.productCount || 0), 0)
  const totalOrders = brands.reduce((sum, brand) => sum + brand.completedOrders, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] to-white">
      {/* Navbar */}
      <Navbar isLoggedIn={cookieValue?true:false} variant="floating" userdata={userdata} />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4FC3F7]/10 via-transparent to-[#33BF69]/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4FC3F7]/20 to-[#33BF69]/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20">
            <Sparkles className="h-4 w-4 text-[#4FC3F7]" />
            <span className="text-sm font-semibold text-[#455A64]">Trusted Brand Partners</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#455A64] via-[#4FC3F7] to-[#33BF69] bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-1000">
            Our Brand Partners
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-1000 delay-200">
            Discover sustainable fashion from verified brands committed to ethical practices and environmental
            responsibility
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-12 animate-in slide-in-from-bottom-4 duration-1000 delay-300">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#4FC3F7] to-[#33BF69] bg-clip-text text-transparent">
                {brands.length}+
              </div>
              <div className="text-gray-600">Verified Brands</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#33BF69] to-[#FF6F61] bg-clip-text text-transparent">
                {totalProducts}+
              </div>
              <div className="text-gray-600">Products Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#FF6F61] to-[#4FC3F7] bg-clip-text text-transparent">
                {totalOrders}+
              </div>
              <div className="text-gray-600">Orders Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white/50 backdrop-blur-sm border-y border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              {searchLoading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4FC3F7] animate-spin" />
              )}
              <Input
                type="text"
                placeholder="Search brands..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-10 py-2 rounded-full border-gray-200 focus:border-[#4FC3F7] focus:ring-[#4FC3F7]/20"
                disabled={searchLoading}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <Button
                variant={showFeaturedOnly ? "default" : "outline"}
                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                className={`rounded-full px-4 py-2 transition-all duration-300 ${
                  showFeaturedOnly
                    ? "bg-gradient-to-r from-[#4FC3F7] to-[#33BF69] text-white"
                    : "border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7]/10"
                }`}
              >
                <Award className="h-4 w-4 mr-2" />
                Featured Only
              </Button>

              <div className="text-sm text-gray-600">
                Showing {filteredBrands.length} of {brands.length} brands
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Benefits Section */}
      <section className="py-16 bg-gradient-to-r from-[#4FC3F7]/5 to-[#33BF69]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#455A64] mb-4">Why Brands Choose Re-verse</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide a platform that empowers sustainable brands to reach conscious consumers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4FC3F7] to-[#33BF69] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#455A64] mb-2">Conscious Community</h3>
              <p className="text-gray-600">Connect with customers who value sustainability and ethical fashion</p>
            </div>

            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#33BF69] to-[#FF6F61] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#455A64] mb-2">Growth Support</h3>
              <p className="text-gray-600">Marketing tools and analytics to help your brand grow sustainably</p>
            </div>

            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6F61] to-[#4FC3F7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#455A64] mb-2">Trust & Security</h3>
              <p className="text-gray-600">Verified platform with secure payments and buyer protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ExternalLink className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-[#455A64] mb-2">Failed to load brands</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={() => fetchBrands(searchQuery)}
                className="bg-gradient-to-r from-[#4FC3F7] to-[#33BF69] text-white rounded-full px-6 py-2"
              >
                Try Again
              </Button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <BrandSkeleton key={index} />
              ))}
            </div>
          ) : filteredBrands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBrands.map((brand, index) => (
                <BrandCard key={brand._id} brand={brand} index={index} />
              ))}
            </div>
          ) : (
            <EmptyState searchQuery={searchQuery} onClearSearch={clearSearch} />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#455A64] to-[#4FC3F7] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Partner with Re-verse?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community of sustainable brands and reach conscious consumers worldwide
          </p>
          <Button
            size="lg"
            className="bg-white text-[#455A64] hover:bg-gray-100 rounded-full px-8 py-3 font-semibold transition-all duration-300 hover:scale-105"
          >
            Become a Partner
          </Button>
        </div>
      </section>

      {/* Add custom styles */}
      <style jsx global>{`
        @keyframes smoothFadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        .hover-lift-smooth {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hover-lift-smooth:hover {
          transform: translate3d(0, -8px, 0);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
