"use client"

import { useState, useEffect, useCallback, memo, useRef } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  Package,
  Shield,
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
  Grid3X3,
  List,
  SortAsc,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  establishedYear?: number
}

interface Product {
  _id: string
  name: string
  slug: string
  description: string
  images: string[]
  brand: string
  brandName: string
  category: string
  categoryPath: string
  attributes: {
    material?: string
    pattern?: string
    careInstructions?: string
  }
  tags: string[]
  isActive: boolean
  featured: boolean
  ratingStats: {
    averageRating: number
    ratingCount: number
  }
  variants?: Array<{
    size: string
    color: string
    price: number
    originalPrice: number
    stock: number
  }>
}

// Product Card Component
const ProductCard = memo(({ product, index = 0 }: { product: Product; index?: number }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => setIsHovered(false), [])
  const handleImageLoad = useCallback(() => setIsLoaded(true), [])

  // Get the lowest price from variants
  const getPrice = () => {
    if (!product.variants || product.variants.length === 0) return { price: 0, originalPrice: 0 }
    const prices = product.variants.map((v) => ({ price: v.price, originalPrice: v.originalPrice }))
    const minPrice = Math.min(...prices.map((p) => p.price))
    const minOriginalPrice = prices.find((p) => p.price === minPrice)?.originalPrice || minPrice
    return { price: minPrice, originalPrice: minOriginalPrice }
  }

  const { price, originalPrice } = getPrice()
  const hasDiscount = originalPrice > price

  return (
    <Link href={`/product/${product._id}`}>
    <Card
      className="group overflow-hidden border-0 shadow-lg bg-white rounded-3xl will-change-transform transform-gpu"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: "smoothFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        opacity: 0,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden rounded-t-3xl">
        <div className="aspect-[3/4] relative bg-gradient-to-br from-[#F2F2F2] to-white">
          <Image
            src={product.images?.[0] || "/placeholder.svg?height=400&width=300&query=product image"}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 ease-out will-change-transform"
            style={{
              transform: isHovered
                ? "scale3d(1.08, 1.08, 1) rotate3d(0, 0, 1, 1deg)"
                : "scale3d(1, 1, 1) rotate3d(0, 0, 1, 0deg)",
            }}
            loading="lazy"
            onLoad={handleImageLoad}
          />

          {/* Overlay Effects */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-all duration-500 ease-out"
            style={{
              opacity: isHovered ? 1 : 0,
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <Badge className="bg-gradient-to-r from-[#FF6F61] to-[#4FC3F7] text-white border-0 rounded-full px-3 py-1 text-xs font-semibold shadow-lg">
                FEATURED
              </Badge>
            )}
            {hasDiscount && (
              <Badge className="bg-gradient-to-r from-[#33BF69] to-[#4FC3F7] text-white border-0 rounded-full px-3 py-1 text-xs font-semibold shadow-lg">
                {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <div
            className="absolute top-3 right-3 transition-all duration-400 ease-out will-change-transform"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered
                ? "translate3d(0, 0, 0) scale3d(1, 1, 1)"
                : "translate3d(10px, -10px, 0) scale3d(0.8, 0.8, 1)",
            }}
          >
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/95 hover:bg-white hover:scale-110 transition-all duration-300 ease-out rounded-full shadow-lg backdrop-blur-sm border border-white/30"
            >
              <Heart className="h-4 w-4 text-[#FF6F61] hover:fill-current transition-all duration-300 ease-out" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div
            className="absolute bottom-3 left-1/2 transition-all duration-500 ease-out will-change-transform"
            style={{
              transform: isHovered
                ? "translate3d(-50%, 0, 0) scale3d(1, 1, 1)"
                : "translate3d(-50%, 100%, 0) scale3d(0.9, 0.9, 1)",
              opacity: isHovered ? 1 : 0,
            }}
          >
            <div className="flex gap-2">
              {/* <Button
                size="sm"
                className="bg-[#455A64]/95 hover:bg-[#33BF69] text-white rounded-full px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300 ease-out hover:scale-105"
              >
                Quick Add
              </Button> */}
              <Link href={`/product/${product._id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/95 hover:bg-white text-[#455A64] rounded-full px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-sm border border-white/30 transition-all duration-300 ease-out hover:scale-105"
                >
                  View
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-5 space-y-3">
        {/* Rating & Category */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 transition-all duration-300 ease-out ${
                  i < Math.floor(product.ratingStats.averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs text-gray-600 ml-1 font-medium">({product.ratingStats.ratingCount})</span>
          </div>
          <span className="text-xs text-[#4FC3F7] font-semibold bg-[#4FC3F7]/10 px-2 py-1 rounded-full">
            {product.categoryPath.split("/").pop()}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-[#455A64] text-lg leading-tight line-clamp-2 group-hover:text-[#33BF69] transition-colors duration-300">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl text-[#455A64] group-hover:text-[#33BF69] transition-colors duration-300">
            ₹{price}
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
              <span className="text-xs bg-gradient-to-r from-[#33BF69] to-[#4FC3F7] text-white px-2 py-1 rounded-full font-semibold">
                {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        {/* Material */}
        {product.attributes.material && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 font-medium">Material:</span>
            <span className="text-xs bg-[#F2F2F2] text-[#455A64] px-2 py-1 rounded-md font-medium">
              {product.attributes.material}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
    </Link>
  )
})

ProductCard.displayName = "ProductCard"

// Product Skeleton
const ProductSkeleton = () => (
  <Card className="overflow-hidden border-0 shadow-lg bg-white rounded-3xl">
    <div className="aspect-[3/4] relative">
      <Skeleton className="w-full h-full rounded-t-3xl" />
    </div>
    <CardContent className="p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-4 w-full" />
    </CardContent>
  </Card>
  
)

export default function BrandDetailPage() {
  const params = useParams()
  const brandId = params.id as string

  const [brand, setBrand] = useState<Brand | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [error, setError] = useState<string | null>(null)
  const observerRef = useRef<HTMLDivElement>(null)
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
  // API calls
  const fetchBrand = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${api}/api/brandpage/brands/${brandId}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            },

      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Check if brand is verified and active
      if (!data.brand.isVerified || !data.brand.isActive) {
        throw new Error("Brand not found or not available")
      }

      setBrand(data.brand)
    } catch (error) {
      console.error("Error fetching brand:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch brand")
    } finally {
      setLoading(false)
    }
  }, [brandId])

  const fetchProducts = useCallback(
    async (pageNum: number, sort: string) => {
      try {
        setProductsLoading(true)
        setError(null)

        const url = new URL(`${api}/api/brandpage/products/${brandId}`)
        url.searchParams.append("brand", brandId)
        url.searchParams.append("page", pageNum.toString())
        url.searchParams.append("limit", "12")
        url.searchParams.append("sort", sort)

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
        console.log(data)

        if (pageNum === 1) {
          setProducts(data.products || [])
        } else {
          setProducts((prev) => [...prev, ...(data.products || [])])
        }

        setHasMore(data.hasMore || false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch products")
      } finally {
        setProductsLoading(false)
      }
    },
    [brandId],
  )

  // Initial load
  useEffect(() => {
    fetchBrand()
  }, [fetchBrand])

  useEffect(() => {
    if (brand) {
      setPage(1)
      fetchProducts(1, sortBy)
    }
  }, [brand, sortBy, fetchProducts])

  // Handle sort change
  const handleSortChange = useCallback((newSort: string) => {
    setSortBy(newSort)
    setPage(1)
    setProducts([])
  }, [])

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !productsLoading && products.length > 0) {
          const nextPage = page + 1
          setPage(nextPage)
          fetchProducts(nextPage, sortBy)
        }
      },
      { threshold: 0.1 },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, productsLoading, products.length, page, sortBy, fetchProducts])

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
  const MAX_LENGTH = 150
  const [expanded, setExpanded] = useState(false);
  const isLong = brand?.description?.length || 0 > MAX_LENGTH;
  const displayedText = expanded
    ? brand?.description
    : brand?.description?.slice(0, MAX_LENGTH) + (isLong ? "..." : "");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] to-white">
        <Navbar isLoggedIn={true} variant="floating" />
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Skeleton */}
            <div className="mb-8">
              <Skeleton className="h-8 w-32 mb-4" />
              <div className="relative">
                <Skeleton className="w-full h-64 md:h-80 rounded-3xl" />
                <div className="absolute bottom-6 left-6">
                  <Skeleton className="w-20 h-20 rounded-2xl" />
                </div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-20 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !brand) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] to-white">
        <Navbar isLoggedIn={true} variant="floating" />
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-[#455A64] mb-2">Brand not found</h3>
              <p className="text-gray-600 mb-6">
                {error || "The brand you're looking for doesn't exist or is not available."}
              </p>
              <Link href="/brands">
                <Button className="bg-gradient-to-r from-[#4FC3F7] to-[#33BF69] text-white rounded-full px-6 py-2">
                  Back to Brands
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const successRate = brand.totalOrders > 0 ? Math.round((brand.completedOrders / brand.totalOrders) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] to-white">
      <Navbar isLoggedIn={cookieValue?true:false} variant="floating" userdata={userdata} />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/brands">
              <Button
                variant="ghost"
                className="text-[#4FC3F7] hover:text-[#33BF69] hover:bg-[#4FC3F7]/10 rounded-full px-4 py-2 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Brands
              </Button>
            </Link>
          </div>

          {/* Brand Header */}
          <div className="relative mb-12">
            <div className="relative overflow-hidden rounded-3xl">
              <div className="aspect-[3/1] md:aspect-[4/1] relative bg-gradient-to-br from-[#4FC3F7]/20 to-[#33BF69]/20">
                <Image
                  src={brand.coverImage || "/placeholder.svg?height=400&width=1200&query=brand cover image"}
                  alt={`${brand.name} cover`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Brand Logo */}
                <div className="absolute bottom-6 left-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white/20 backdrop-blur-sm">
                    <Image
                      src={brand.logo || "/placeholder.svg?height=64&width=64&query=brand logo"}
                      alt={`${brand.name} logo`}
                      width={64}
                      height={64}
                      className="rounded-xl object-cover"
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="absolute bottom-6 right-6 flex gap-3">
                  {brand.rating && (
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold text-[#455A64] shadow-lg">
                      <Star className="h-4 w-4 inline mr-1 text-yellow-400 fill-current" />
                      {brand.rating}
                    </div>
                  )}
                  <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold text-[#455A64] shadow-lg">
                    <Package className="h-4 w-4 inline mr-1 text-[#4FC3F7]" />
                    {products.length} Products
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-6 left-6 flex gap-2">
                  {brand.isFeatured && (
                    <Badge className="bg-gradient-to-r from-[#FF6F61] to-[#4FC3F7] text-white border-0 rounded-full px-4 py-2 font-semibold shadow-lg">
                      FEATURED PARTNER
                    </Badge>
                  )}
                  {brand.isVerified && (
                    <Badge className="bg-gradient-to-r from-[#33BF69] to-[#4FC3F7] text-white border-0 rounded-full px-4 py-2 font-semibold shadow-lg">
                      <Shield className="h-4 w-4 mr-1" />
                      VERIFIED
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-6 right-6 flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full border border-white/20"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full border border-white/20"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#455A64] mb-4">{brand.name}</h1>
                <div className="flex items-center gap-4 mb-6">
                  {brand.rating && brand.reviews && (
                    <>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(brand.rating!) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-lg font-semibold text-[#455A64] ml-2">
                          {brand.rating} ({brand.reviews} reviews)
                        </span>
                      </div>
                      <span className="text-gray-400">•</span>
                    </>
                  )}
                  {brand.establishedYear && <span className="text-gray-600">Est. {brand.establishedYear}</span>}
                </div>
                {brand.description && <p className="text-gray-600 text-lg leading-relaxed">
      {displayedText}
      {isLong && (
        <span
          className="text-blue-600 cursor-pointer ml-2"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "See Less" : "See More"}
        </span>
      )}
    </p>}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[#4FC3F7]/10 to-[#33BF69]/10 p-6 rounded-2xl text-center">
                  <div className="text-2xl font-bold text-[#4FC3F7] mb-1">{brand.completedOrders}</div>
                  <div className="text-sm text-gray-600">Orders Completed</div>
                </div>
                <div className="bg-gradient-to-br from-[#33BF69]/10 to-[#FF6F61]/10 p-6 rounded-2xl text-center">
                  <div className="text-2xl font-bold text-[#33BF69] mb-1">{successRate}%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="bg-gradient-to-br from-[#FF6F61]/10 to-[#4FC3F7]/10 p-6 rounded-2xl text-center">
                  <div className="text-2xl font-bold text-[#FF6F61] mb-1">{products.length}+</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Policies Card */}
              {(brand.returnPolicy || brand.warrantyPolicy) && (
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                  <h3 className="font-bold text-[#455A64] text-lg mb-4">Policies</h3>
                  <div className="space-y-4">
                    {brand.returnPolicy && (
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-[#33BF69] mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-sm text-[#455A64] mb-1">Return Policy</div>
                          <div className="text-xs text-gray-600">{brand.returnPolicy}</div>
                        </div>
                      </div>
                    )}
                    {brand.warrantyPolicy && (
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-[#4FC3F7] mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-sm text-[#455A64] mb-1">Warranty</div>
                          <div className="text-xs text-gray-600">{brand.warrantyPolicy}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Social Media Card */}
              {brand.socialMediaHandles && Object.keys(brand.socialMediaHandles).length > 0 && (
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                  <h3 className="font-bold text-[#455A64] text-lg mb-4">Connect</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(brand.socialMediaHandles).map(([platform, handle]) => (
                    
                    <Link href={`${handle}`}>
                        <Button
                        key={platform}
                        variant="outline"
                        size="sm"
                        className="justify-start border-gray-200 hover:border-[#4FC3F7] hover:bg-[#4FC3F7]/10 rounded-xl bg-transparent"

                      >
                        {getSocialIcon(platform)}
                        <span className="ml-2 text-xs capitalize">{platform}</span>
                      </Button>
                    
                    </Link>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Products Section */}
          <div className="space-y-6">
            {/* Products Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-[#455A64] mb-2">Products</h2>
                <p className="text-gray-600">Discover sustainable fashion from {brand.name}</p>
              </div>

              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-white rounded-full p-1 shadow-sm border">
                  <Button
                    size="sm"
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    onClick={() => setViewMode("grid")}
                    className="rounded-full px-3 py-1"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === "list" ? "default" : "ghost"}
                    onClick={() => setViewMode("list")}
                    className="rounded-full px-3 py-1"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-40 rounded-full border-gray-200">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {error && products.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-[#455A64] mb-2">Failed to load products</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button
                  onClick={() => fetchProducts(1, sortBy)}
                  className="bg-gradient-to-r from-[#4FC3F7] to-[#33BF69] text-white rounded-full px-6 py-2"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                  }`}
                >
                  {products.map((product, index) => (
                    <ProductCard key={product._id} product={product} index={index} />
                  ))}

                  {/* Loading Skeletons */}
                  {productsLoading && (
                    <>
                      {[...Array(4)].map((_, index) => (
                        <ProductSkeleton key={`skeleton-${index}`} />
                      ))}
                    </>
                  )}
                </div>

                {/* Load More Trigger */}
                <div ref={observerRef} className="h-10 flex items-center justify-center">
                  {productsLoading && hasMore && (
                    <div className="flex items-center gap-2 text-[#4FC3F7] font-semibold">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading more products...
                    </div>
                  )}
                  {!hasMore && products.length > 0 && (
                    <div className="text-gray-500">You've seen all products from {brand.name}</div>
                  )}
                  {!productsLoading && products.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-gray-500 mb-2">No products available from this brand yet</div>
                      <div className="text-sm text-gray-400">Check back later for new arrivals</div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

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
