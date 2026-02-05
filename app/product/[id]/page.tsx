"use client"

import { useState, useEffect, Suspense } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  MessageCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Navbar from "@/components/navbar"
import { useCookieContext } from "@/context/cookieContext"

interface ProductData {
  product: {
    _id: string
    name: string
    slug: string
    description: string
    brand: {
      _id: string
      name: string
      logo: string
    }
    brandName: string
    category: {
      _id: string
      name: string
      slug: string
    }
    images: string[]
    attributes: {
      material: string
      pattern: string
      careInstructions: string
    }
    tags: string[]
    isActive: boolean
    featured: boolean
    ratingStats: {
      ratingDistribution: {
        [key: string]: number
      }
      averageRating: number
      ratingCount: number
    }
    createdAt: string
    updatedAt: string
    categoryPath: string
    __v: number
  }
  variants: Array<{
    _id: string
    product: string
    sku: string
    price: number
    salePrice?: number
    stock: number
    attributes: {
      size: string
      color: string
    }
    images: string[]
    isDefault: boolean
    isActive: boolean
    createdAt: string
    updatedAt: string
    __v: number
  }>
  availableColors: string[]
  availableSizes: string[]
  ratings: Array<{
    _id: string
    user: {
      _id: string
      name: string
      profileImage?: string
    }
    rating: number
    review: string
    createdAt: string
    likes?: number
  }>
  ratingSummary: {
    averageRating: number
    ratingCount: number
    ratingDistribution: {
      [key: string]: number
    }
  }
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalRatings: number
  }
}

function ProductDetailContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const productId = params.id as string

  const [productData, setProductData] = useState<ProductData | null>(null)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [loading, setLoading] = useState(true)
  const [variantLoading, setVariantLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [reviewPage, setReviewPage] = useState(1)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [carti, setcarti] = useState<any>()
const api=process.env.NEXT_PUBLIC_API_URL


const [userdata,setuserdata]=useState<any>()
const { cookieValue } = useCookieContext()
const [reload,setreload]=useState<Boolean>(false)

const userProfile=async()=>{
  try{
    
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
}
const cartitms=async()=>{
    try{
      
      const response = await fetch(`${api}/api/cart/variant-ids`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookieValue}`,
          },
      });
      const data = await response.json();
      setcarti(data)
  
  
    }catch(err){
      console.log(err)
    }
  }

  // Fetch product data
  const fetchProductData = async (color?: string, size?: string, page = 1) => {
    try {
      const colorParam = color || ""
      const sizeParam = size || ""
      const url = `${api}/api/products/${productId}/details?color=${colorParam}&size=${sizeParam}&page=${page}&limit=10`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching product data:", error)
      throw error
    }
  }
  useEffect(()=>{
    userProfile()
    cartitms()
  },[cookieValue,isAddedToCart])




  useEffect(() => {
    if (!selectedVariant) {
      setQuantity(1)
      setIsAddedToCart(false)
      return
    }
    const cartArray = Array.isArray(carti) ? carti : [];
const cartItem = cartArray.find(
  (item) => item?.variant === selectedVariant?._id
);
    if (cartItem) {
      setQuantity(cartItem?.quantity)
      setIsAddedToCart(true)
    } else {
      setQuantity(1)
      setIsAddedToCart(false)
    }
  }, [carti, selectedVariant])
  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      try {
        const initialColor = searchParams.get("color") || ""
        const initialSize = searchParams.get("size") || ""

        // Fetch data without color/size filters to get all variants
        const data = await fetchProductData("", "", 1)
        setProductData(data)

        // Set initial selections
        if (data.variants.length > 0) {
          const defaultVariant = data.variants.find((v: any) => v.isDefault) || data.variants[0]
          const colorToSet = initialColor || defaultVariant.attributes.color
          const sizeToSet = initialSize || defaultVariant.attributes.size

          setSelectedColor(colorToSet)
          setSelectedSize(sizeToSet)

          // Find the actual variant for the selected combination
          const selectedVar =
            data.variants.find((v: any) => v.attributes.color === colorToSet && v.attributes.size === sizeToSet) ||
            defaultVariant

          setSelectedVariant(selectedVar)
        }
      } catch (error) {
        setMessage({ type: "error", text: "Failed to load product details. Please try again." })
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()

  }, [productId, searchParams])

  // Update selected variant when color/size changes
  useEffect(() => {
    if (productData && selectedColor && selectedSize) {
      const variant = productData.variants.find(
        (v) => v.attributes.color === selectedColor && v.attributes.size === selectedSize,
      )
      setSelectedVariant(variant || null)
    }
  }, [selectedColor, selectedSize, productData])

  // Update URL and fetch new data when color/size changes
  const handleColorChange = async (color: string) => {
    if (!productData) return

    setSelectedColor(color)

    // Find available sizes for this color
    const availableSizesForColor = productData.variants
      .filter((v) => v.attributes.color === color)
      .map((v) => v.attributes.size)

    // If current size is not available for this color, select first available
    let newSize = selectedSize
    if (!availableSizesForColor.includes(selectedSize)) {
      newSize = availableSizesForColor[0] || ""
      setSelectedSize(newSize)

      // Show message about size change
      if (newSize) {
        setMessage({
          type: "success",
          text: `Color changed to ${color}. Size automatically changed to ${newSize} as ${selectedSize} is not available in this color.`,
        })
        setTimeout(() => setMessage(null), 4000)
      }
    }

    // Update selected variant without fetching new data
    if (newSize) {
      const variant = productData.variants.find((v) => v.attributes.color === color && v.attributes.size === newSize)
      setSelectedVariant(variant || null)
    }

    // Update URL without page reload
    const newSearchParams = new URLSearchParams()
    if (color) newSearchParams.set("color", color)
    if (newSize) newSearchParams.set("size", newSize)

    const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`
    window.history.pushState({}, "", newUrl)
  }

  const handleSizeChange = async (size: string) => {
    if (!productData) return

    setSelectedSize(size)

    // Find available colors for this size
    const availableColorsForSize = productData.variants
      .filter((v) => v.attributes.size === size)
      .map((v) => v.attributes.color)

    // If current color is not available for this size, select first available
    let newColor = selectedColor
    if (!availableColorsForSize.includes(selectedColor)) {
      newColor = availableColorsForSize[0] || ""
      setSelectedColor(newColor)

      // Show message about color change
      if (newColor) {
        setMessage({
          type: "success",
          text: `Size changed to ${size}. Color automatically changed to ${newColor} as ${selectedColor} is not available in this size.`,
        })
        setTimeout(() => setMessage(null), 4000)
      }
    }

    // Update selected variant without fetching new data
    if (newColor) {
      const variant = productData.variants.find((v) => v.attributes.color === newColor && v.attributes.size === size)
      setSelectedVariant(variant || null)
    }

    // Update URL without page reload
    const newSearchParams = new URLSearchParams()
    if (newColor) newSearchParams.set("color", newColor)
    if (size) newSearchParams.set("size", size)

    const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`
    window.history.pushState({}, "", newUrl)
  }

  const loadMoreReviews = async () => {
    if (!productData) return

    setReviewLoading(true)
    try {
      const nextPage = reviewPage + 1
      const data = await fetchProductData(selectedColor, selectedSize, nextPage)

      // Only append new reviews, don't update variants or other product data
      setProductData((prev) =>
        prev
          ? {
              ...prev,
              ratings: [...prev.ratings, ...data.ratings],
              pagination: data.pagination,
            }
          : null,
      )

      setReviewPage(nextPage)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load more reviews. Please try again." })
    } finally {
      setReviewLoading(false)
    }
  }

  const getAvailableSizesForColor = (color: string) => {
    if (!productData) return []
    return productData.variants.filter((v) => v.attributes.color === color).map((v) => v.attributes.size)
  }

  const getAvailableColorsForSize = (size: string) => {
    if (!productData) return []
    return productData.variants.filter((v) => v.attributes.size === size).map((v) => v.attributes.color)
  }
  const handleUpdateQuantity = (newQty: number) => {
    setQuantity(newQty)
    updateQuantity(newQty)
  }

  const handleAddToCart = () => {
    addToCart()
  }

  const addToCart = async () => {
    if(!cookieValue){
      window.location.href='/login'
      setMessage({ type: "error", text: "Please login to add product to cart" })
      return
    }
    if (!selectedVariant) {
      setMessage({ type: "error", text: "Please select size and color" })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setLoading(true)
    try {
      // Simulate API call to add to cart
      const response = await fetch(`${api}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cookieValue}`
        },
        body: JSON.stringify({
          variantId: selectedVariant._id,
          quantity: quantity,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add to cart")
      }

      setIsAddedToCart(true)
      setMessage({ type: "success", text: "Product added to cart successfully!" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add to cart. Please try again." })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (selectedVariant?.stock || 0)) {
      setQuantity(newQuantity)
    }
  }

  const nextImage = () => {
    if (!productData) return
    setCurrentImageIndex((prev) => (prev + 1) % productData.product.images.length)
  }

  const prevImage = () => {
    if (!productData) return
    setCurrentImageIndex((prev) => (prev - 1 + productData.product.images.length) % productData.product.images.length)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    }

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${
              i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  const getColorDisplay = (color: string) => {
    const colorMap: { [key: string]: string } = {
      white: "#FFFFFF",
      black: "#000000",
      blue: "#3B82F6",
      red: "#EF4444",
      green: "#10B981",
      yellow: "#F59E0B",
      purple: "#8B5CF6",
      pink: "#EC4899",
      gray: "#6B7280",
    }
    return colorMap[color.toLowerCase()] || color
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4FC3F7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#455A64] font-medium">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] to-white">
        <Navbar isLoggedIn={cookieValue!==''?true:false} variant="floating" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-[#455A64] mb-4">Product not found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button className="bg-[#4FC3F7] hover:bg-[#33BF69] text-white px-8 py-3 rounded-full">Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] to-white">
      <Navbar isLoggedIn={cookieValue!==''?true:false} variant="floating" userdata={userdata} />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#455A64] hover:text-[#4FC3F7] transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <nav className="text-sm text-gray-600">
                <Link href="/" className="hover:text-[#4FC3F7]">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link href="/products" className="hover:text-[#4FC3F7]">
                  Products
                </Link>
                <span className="mx-2">/</span>
                <span className="text-[#455A64] font-medium">{productData.product.name}</span>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {message && (
          <Alert
            className={`mb-6 ${message.type === "success" ? "border-[#33BF69] bg-[#33BF69]/5" : "border-red-500 bg-red-50"}`}
          >
            <Check className={`h-4 w-4 ${message.type === "success" ? "text-[#33BF69]" : "text-red-500"}`} />
            <AlertDescription className={message.type === "success" ? "text-[#33BF69]" : "text-red-500"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-lg">
              <Image
                src={productData.product.images[currentImageIndex] || "/placeholder.svg?height=600&width=500"}
                alt={productData.product.name}
                fill
                className="object-cover"
                priority
              />

              {/* Image Navigation */}
              {productData.product.images.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-lg"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-lg"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}

              {/* Image Indicators */}
              {productData.product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {productData.product.images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? "bg-white scale-125" : "bg-white/50"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {productData.product.featured && <Badge className="bg-[#FF6F61] text-white">Featured</Badge>}
                {selectedVariant?.salePrice && (
                  <Badge className="bg-[#33BF69] text-white">
                    {Math.round(((selectedVariant.price - selectedVariant.salePrice) / selectedVariant.price) * 100)}%
                    OFF
                  </Badge>
                )}
              </div>

              {/* Wishlist & Share */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white rounded-full shadow-lg">
                  <Heart className="h-5 w-5 text-[#FF6F61]" />
                </Button>
                <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white rounded-full shadow-lg">
                  <Share2 className="h-5 w-5 text-[#4FC3F7]" />
                </Button>
              </div>
            </div>

            {/* Thumbnail Images */}
            {productData.product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productData.product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? "border-[#4FC3F7]" : "border-gray-200 hover:border-[#4FC3F7]/50"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg?height=80&width=80"}
                      alt={`${productData.product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Image
                  src={productData.product.brand.logo || "/placeholder.svg?height=40&width=40"}
                  alt={productData.product.brand.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-[#4FC3F7] font-semibold text-lg">{productData.product.brand.name}</span>
              </div>
              <h1 className="text-3xl font-bold text-[#455A64]">{productData.product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{productData.product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              {renderStars(productData.ratingSummary.averageRating, "lg")}
              <span className="text-lg font-semibold text-[#455A64]">{productData.ratingSummary.averageRating}</span>
              <span className="text-gray-600">({productData.ratingSummary.ratingCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-[#33BF69]">
                ₹{selectedVariant?.salePrice || selectedVariant?.price || 0}
              </span>
              {selectedVariant?.salePrice && (
                <span className="text-xl text-gray-500 line-through">₹{selectedVariant.price}</span>
              )}
              {selectedVariant?.salePrice && (
                <Badge className="bg-[#33BF69] text-white text-sm">
                  Save ₹{selectedVariant.price - selectedVariant.salePrice}
                </Badge>
              )}
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[#455A64]">Color: {selectedColor}</h3>
                {variantLoading && <Loader2 className="h-4 w-4 animate-spin text-[#4FC3F7]" />}
              </div>
              <div className="flex gap-3 flex-wrap">
                {productData.availableColors.map((color) => {
                  const availableSizes = getAvailableSizesForColor(color)
                  const isAvailable = availableSizes.length > 0
                  const hasSelectedSize = availableSizes.includes(selectedSize)

                  return (
                    <div key={color} className="relative">
                      <button
                        onClick={() => isAvailable && handleColorChange(color)}
                        disabled={!isAvailable || variantLoading}
                        className={`w-12 h-12 rounded-full border-4 transition-all relative ${
                          selectedColor === color
                            ? "border-[#4FC3F7] scale-110"
                            : isAvailable
                              ? "border-gray-300 hover:border-[#4FC3F7]/50"
                              : "border-gray-200 opacity-50 cursor-not-allowed"
                        }`}
                        style={{ backgroundColor: getColorDisplay(color) }}
                        title={isAvailable ? `${color} - Available` : `${color} - Not Available`}
                      >
                        {selectedColor === color && (
                          <Check className="h-5 w-5 text-white mx-auto absolute inset-0 m-auto" />
                        )}
                        {!isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-0.5 bg-red-500 rotate-45 absolute"></div>
                            <div className="w-8 h-0.5 bg-red-500 -rotate-45 absolute"></div>
                          </div>
                        )}
                      </button>
                      {!isAvailable && (
                        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-red-500 whitespace-nowrap">
                          Not Available
                        </span>
                      )}
                      {isAvailable && !hasSelectedSize && selectedSize && (
                        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-orange-500 whitespace-nowrap">
                          Size {selectedSize} N/A
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[#455A64]">Size: {selectedSize}</h3>
                {variantLoading && <Loader2 className="h-4 w-4 animate-spin text-[#4FC3F7]" />}
              </div>
              <div className="flex gap-3 flex-wrap">
                {productData.availableSizes.map((size) => {
                  const availableColors = getAvailableColorsForSize(size)
                  const isAvailable = availableColors.length > 0
                  const hasSelectedColor = availableColors.includes(selectedColor)

                  return (
                    <div key={size} className="relative">
                      <button
                        onClick={() => isAvailable && handleSizeChange(size)}
                        disabled={!isAvailable || variantLoading}
                        className={`px-4 py-2 border-2 rounded-xl font-medium transition-all min-w-[3rem] relative ${
                          selectedSize === size
                            ? "border-[#4FC3F7] bg-[#4FC3F7] text-white"
                            : isAvailable
                              ? "border-gray-300 text-[#455A64] hover:border-[#4FC3F7]"
                              : "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                        }`}
                        title={isAvailable ? `Size ${size} - Available` : `Size ${size} - Not Available`}
                      >
                        {size}
                        {!isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-0.5 bg-red-500 rotate-45 absolute"></div>
                            <div className="w-6 h-0.5 bg-red-500 -rotate-45 absolute"></div>
                          </div>
                        )}
                      </button>
                      {!isAvailable && (
                        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-red-500 whitespace-nowrap">
                          Not Available
                        </span>
                      )}
                      {isAvailable && !hasSelectedColor && selectedColor && (
                        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-orange-500 whitespace-nowrap">
                          Color N/A
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Stock Status */}
            {selectedVariant && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    selectedVariant.stock > 10
                      ? "bg-[#33BF69]"
                      : selectedVariant.stock > 0
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-gray-600">
                  {selectedVariant.stock > 10
                    ? "In Stock"
                    : selectedVariant.stock > 0
                      ? `Only ${selectedVariant.stock} left`
                      : "Out of Stock"}
                </span>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
            {!isAddedToCart ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="font-medium text-[#455A64]">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdateQuantity(quantity - 1)}
                disabled={quantity <= 1}
                className="w-8 h-8 p-0 rounded-full border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-semibold text-[#455A64]">{quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdateQuantity(quantity + 1)}
                disabled={quantity >= (selectedVariant?.stock || 0)}
                className="w-8 h-8 p-0 rounded-full border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={loading || !selectedVariant || selectedVariant.stock === 0}
            className="flex-1 bg-[#33BF69] hover:bg-[#4FC3F7] text-white py-3 rounded-2xl text-lg font-semibold"
            size="lg"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <ShoppingCart className="h-5 w-5 mr-2" />
            )}
            {selectedVariant?.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="font-medium text-[#455A64]">Quantity:</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 p-0 rounded-full border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-semibold text-[#455A64]">{quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateQuantity(quantity + 1)}
                  disabled={quantity >= (selectedVariant?.stock || 0)}
                  className="w-8 h-8 p-0 rounded-full border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={loading}
              className="flex-1 bg-[#33BF69] hover:bg-[#4FC3F7] text-white py-3 rounded-2xl font-semibold"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Add More
            </Button>
            <Link href="/cart" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white py-3 rounded-2xl font-semibold bg-transparent"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Go to Cart
              </Button>
            </Link>
          </div>
        </div>
      )}
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-[#4FC3F7]/5 to-[#33BF69]/5 rounded-2xl">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-[#4FC3F7]" />
                <span className="text-[#455A64]">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="h-4 w-4 text-[#33BF69]" />
                <span className="text-[#455A64]">30-Day Returns</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-[#FF6F61]" />
                <span className="text-[#455A64]">Secure Payment</span>
              </div>
            </div>

            {/* Product Attributes */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-[#455A64]">Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Material:</span>
                    <span className="ml-2 font-medium text-[#455A64]">{productData.product.attributes.material}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Pattern:</span>
                    <span className="ml-2 font-medium text-[#455A64]">{productData.product.attributes.pattern}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-600">Care Instructions:</span>
                    <span className="ml-2 font-medium text-[#455A64]">
                      {productData.product.attributes.careInstructions}
                    </span>
                  </div>
                  {selectedVariant && (
                    <div>
                      <span className="text-gray-600">SKU:</span>
                      <span className="ml-2 font-mono text-[#455A64]">{selectedVariant.sku}</span>
                    </div>
                  )}
                </div>
                {productData.product.tags.length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-gray-600">Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {productData.product.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-[#4FC3F7] border-[#4FC3F7]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <Card className="border-0 shadow-lg rounded-3xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-[#455A64]">Customer Reviews</CardTitle>
                <div className="flex items-center gap-4">
                  {renderStars(productData.ratingSummary.averageRating, "lg")}
                  <span className="text-xl font-bold text-[#455A64]">{productData.ratingSummary.averageRating}</span>
                  <span className="text-gray-600">({productData.ratingSummary.ratingCount} reviews)</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rating Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[#455A64] w-8">{rating}</span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              productData.ratingSummary.ratingCount > 0
                                ? (
                                    productData.ratingSummary.ratingDistribution[rating] /
                                      productData.ratingSummary.ratingCount
                                  ) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {productData.ratingSummary.ratingDistribution[rating]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#33BF69] mb-2">
                    {productData.ratingSummary.averageRating}
                  </div>
                  {renderStars(productData.ratingSummary.averageRating, "lg")}
                  <p className="text-gray-600 mt-2">Based on {productData.ratingSummary.ratingCount} reviews</p>
                </div>
              </div>

              <Separator />

              {/* Individual Reviews */}
              <div className="space-y-6">
                {productData.ratings.map((review) => (
                  <div key={review._id} className="p-6 bg-[#F2F2F2]/30 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-white">
                        <Image
                          src={review.user.profileImage || "/placeholder.svg?height=48&width=48"}
                          alt={review.user.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-[#455A64]">{review.user.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              {renderStars(review.rating, "sm")}
                              <span className="text-sm text-gray-600">{formatDate(review.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" className="text-gray-500 hover:text-[#4FC3F7]">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {review.likes || 0}
                            </Button>
                            <Button size="sm" variant="ghost" className="text-gray-500 hover:text-[#4FC3F7]">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.review}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Reviews */}
              {productData.pagination.page < productData.pagination.totalPages && (
                <div className="text-center">
                  <Button
                    onClick={loadMoreReviews}
                    disabled={reviewLoading}
                    variant="outline"
                    className="border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white px-8 py-3 rounded-2xl bg-transparent"
                  >
                    {reviewLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      "Load More Reviews"
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <footer className="bg-[#455A64] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#33BF69] to-[#4FC3F7] rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold">R</span>
                </div>
                <span className="font-bold text-2xl">RE-VERSE</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Sustainable fashion marketplace for conscious consumers who care about the planet.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Shop</h3>
              <ul className="space-y-3 text-gray-300">
                {["New Arrivals", "Featured", "Sale", "Brands"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase().replace(" ", "-")}`}
                      className="hover:text-white transition-colors duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Support</h3>
              <ul className="space-y-3 text-gray-300">
                {["Help Center", "Returns", "Shipping", "Contact Us"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase().replace(" ", "-")}`}
                      className="hover:text-white transition-colors duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Connect</h3>
              <ul className="space-y-3 text-gray-300">
                {["About Us", "Sustainability", "Blog", "Careers"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase().replace(" ", "-")}`}
                      className="hover:text-white transition-colors duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-12 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Re-verse.in. All rights reserved. Made with 💚 for a sustainable future.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#4FC3F7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#455A64] font-medium">Loading product details...</p>
          </div>
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  )
}
