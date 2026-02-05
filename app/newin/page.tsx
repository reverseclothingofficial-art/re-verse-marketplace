"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Star,
  Heart,
  ShoppingCart,
  Grid3X3,
  List,
  ArrowUpDown,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import Navbar from "@/components/navbar"
import { useCookieContext } from "@/context/cookieContext"

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
    material: string
    pattern: string
    careInstructions: string
  }
  tags: string[]
  isActive: boolean
  featured: boolean
  ratingStats: {
    averageRating: number
    ratingCount: number
  }
  variants: Array<{
    size: string
    color: string
    price: number
    originalPrice: number
    stock: number
  }>
}

interface Category {
  _id: string
  name: string
  slug: string
  description: string
  parentId: string | null
  imageUrl: string
  isActive: boolean
  featured: boolean
}

interface Brand {
  _id: string
  name: string
  logo: string
  description: string
  isVerified: boolean
  isActive: boolean
}

interface ApiResponse {
  products: Product[]
  page: number
  limit: number
  total: number
  totalPages: number
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
]

const VIEW_MODES = [
  { value: "grid", label: "Grid View", icon: Grid3X3 },
  { value: "list", label: "List View", icon: List },
]

export default function NewInPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category")
    const brandFromUrl = searchParams.get("brand")

    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl])
    }
    if (brandFromUrl) {
      setSelectedBrands([brandFromUrl])
    }
  }, [searchParams])

  // State management
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
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
  // Filter and sort state
  const [selectedSort, setSelectedSort] = useState(searchParams.get("sort") || "newest")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category")?.split(",").filter(Boolean) || [],
  )
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brand")?.split(",").filter(Boolean) || [],
  )
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Fetch initial data
  useEffect(() => {
    fetchCategories()
    fetchBrands()
  }, [])

  // Fetch products when filters change
  useEffect(() => {
    setProducts([])
    setCurrentPage(1)
    setHasMore(true)
    fetchProducts(1, true)
  }, [selectedSort, selectedCategories, selectedBrands])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedSort !== "newest") params.set("sort", selectedSort)
    // if (selectedCategories.length > 0) params.set("category", selectedCategories.join(","))
    // if (selectedBrands.length > 0) params.set("brand", selectedBrands.join(","))

    // const newUrl = params.toString() ? `/new-in?${params.toString()}` : "/new-in"
    // router.replace(newUrl, { scroll: false })
  }, [selectedSort, selectedCategories, selectedBrands, router])

  const fetchProducts = async (page = 1, reset = false) => {
    try {
      if (page === 1) setLoading(true)
      else setLoadingMore(true)
  
      // Prepare query params for pagination and sorting
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sort: selectedSort,
      })
  
      // Prepare POST body with categories and brands
      const body = JSON.stringify({
        categories: selectedCategories, // Array of category IDs (strings)
        brands: selectedBrands          // Array of brand IDs (strings)
      })
  
      const response = await fetch(`${api}/api/new/newall?${params.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body:body
      })
  
      if (!response.ok) throw new Error("Failed to fetch products")
  
      const data = await response.json()
  
      if (reset) {
        setProducts(data.products)
      } else {
        setProducts((prev) => [...prev, ...data.products])
      }
  
      setTotalProducts(data.total)
      setHasMore(page < data.totalPages)
      setCurrentPage(page)
      setError(null)
    } catch (err) {
      setError("Failed to load products. Please try again.")
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }
  

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${api}/api/cat/getall`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            },
      })
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data || [])
    } catch (err) {
      console.error("Error fetching categories:", err)
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${api}/api/brandpage/brands`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            },
      })
      if (!response.ok) throw new Error("Failed to fetch brands")
      const data = await response.json()
      setBrands(data.brands || [])
    } catch (err) {
      console.error("Error fetching brands:", err)
    }
  }

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchProducts(currentPage + 1, false)
    }
  }, [currentPage, hasMore, loadingMore])

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMore()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMore])

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories((prev) => (checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId)))
  }

  const handleBrandChange = (brandId: string, checked: boolean) => {
    setSelectedBrands((prev) => (checked ? [...prev, brandId] : prev.filter((id) => id !== brandId)))
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedSort("newest")
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
      brown: "#A16207",
      navy: "#1E3A8A",
      maroon: "#7F1D1D",
    }
    return colorMap[color.toLowerCase()] || color
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const minPrice = Math.min(...product.variants.map((v) => v.price))
    const maxPrice = Math.max(...product.variants.map((v) => v.price))
    const minOriginalPrice = Math.min(...product.variants.map((v) => v.originalPrice))
    const hasDiscount = minPrice < minOriginalPrice
    const uniqueColors = [...new Set(product.variants.map((v) => v.color))]

    return (
      <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl bg-white">
        <Link href={`/product/${product._id}`}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-3xl">
            <Image
              src={product.images[0] || "/placeholder.svg?height=400&width=320"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.featured && <Badge className="bg-[#FF6F61] text-white">Featured</Badge>}
              {hasDiscount && (
                <Badge className="bg-[#33BF69] text-white">
                  {Math.round(((minOriginalPrice - minPrice) / minOriginalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={(e) => {
                e.preventDefault()
                // Handle wishlist toggle
              }}
            >
              <Heart className="h-4 w-4 text-[#FF6F61]" />
            </Button>

            {/* Quick Add to Cart */}
            <Button
              size="sm"
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#33BF69] hover:bg-[#4FC3F7] text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0"
              onClick={(e) => {
                e.preventDefault()
                // Handle quick add to cart
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </Link>

        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[#4FC3F7] font-medium text-sm">{product.brandName}</span>
              {product.ratingStats.ratingCount > 0 && (
                <div className="flex items-center gap-1">
                  {renderStars(product.ratingStats.averageRating)}
                  <span className="text-xs text-gray-500">({product.ratingStats.ratingCount})</span>
                </div>
              )}
            </div>
            <Link href={`/product/${product._id}`}>
              <h3 className="font-semibold text-[#455A64] group-hover:text-[#4FC3F7] transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* Colors */}
          {uniqueColors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Colors:</span>
              <div className="flex gap-1">
                {uniqueColors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: getColorDisplay(color) }}
                    title={color}
                  />
                ))}
                {uniqueColors.length > 4 && <span className="text-xs text-gray-500">+{uniqueColors.length - 4}</span>}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#33BF69]">
                ₹{minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`}
              </span>
              {hasDiscount && <span className="text-sm text-gray-500 line-through">₹{minOriginalPrice}</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const ProductSkeleton = () => (
    <Card className="overflow-hidden border-0 shadow-lg rounded-3xl bg-white">
      <Skeleton className="aspect-[4/5] rounded-t-3xl" />
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  )

  const activeFiltersCount = selectedCategories.length + selectedBrands.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] to-white">
      <Navbar isLoggedIn={cookieValue?true:false} variant="floating" userdata={userdata} />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-[#455A64]">New In</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover the latest arrivals and trending products from your favorite brands
            </p>
            {totalProducts > 0 && (
              <p className="text-sm text-gray-500">
                Showing {products.length} of {totalProducts} products
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Sort Bar */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            {/* Mobile Filters */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden border-[#4FC3F7] text-[#4FC3F7] bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2 bg-[#FF6F61] text-white">{activeFiltersCount}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Filter products by category and brand</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-semibold text-[#455A64] mb-3">Categories</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {categories.map((category) => (
                        <div key={category._id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-category-${category._id}`}
                            checked={selectedCategories.includes(category._id)}
                            onCheckedChange={(checked) => handleCategoryChange(category._id, checked as boolean)}
                          />
                          <label
                            htmlFor={`mobile-category-${category._id}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Brands */}
                  <div>
                    <h3 className="font-semibold text-[#455A64] mb-3">Brands</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {brands.map((brand) => (
                        <div key={brand._id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-brand-${brand._id}`}
                            checked={selectedBrands.includes(brand._id)}
                            onCheckedChange={(checked) => handleBrandChange(brand._id, checked as boolean)}
                          />
                          <label htmlFor={`mobile-brand-${brand._id}`} className="text-sm text-gray-700 cursor-pointer">
                            {brand.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {activeFiltersCount > 0 && (
                    <>
                      <Separator />
                      <Button
                        variant="outline"
                        onClick={clearAllFilters}
                        className="w-full border-[#FF6F61] text-[#FF6F61] hover:bg-[#FF6F61] hover:text-white bg-transparent"
                      >
                        Clear All Filters
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Categories Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-[#4FC3F7] text-[#4FC3F7] bg-transparent">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Categories
                    {selectedCategories.length > 0 && (
                      <Badge className="ml-2 bg-[#4FC3F7] text-white">{selectedCategories.length}</Badge>
                    )}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 max-h-80 overflow-y-auto">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category._id}
                      className="flex items-center space-x-2 cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Checkbox
                        id={`category-${category._id}`}
                        checked={selectedCategories.includes(category._id)}
                        onCheckedChange={(checked) => handleCategoryChange(category._id, checked as boolean)}
                      />
                      <label htmlFor={`category-${category._id}`} className="cursor-pointer flex-1">
                        {category.name}
                      </label>
                    </DropdownMenuItem>
                  ))}
                  {selectedCategories.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setSelectedCategories([])}
                        className="text-[#FF6F61] cursor-pointer"
                      >
                        Clear Categories
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Brands Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-[#4FC3F7] text-[#4FC3F7] bg-transparent">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Brands
                    {selectedBrands.length > 0 && (
                      <Badge className="ml-2 bg-[#4FC3F7] text-white">{selectedBrands.length}</Badge>
                    )}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 max-h-80 overflow-y-auto">
                  {brands.map((brand) => (
                    <DropdownMenuItem
                      key={brand._id}
                      className="flex items-center space-x-2 cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Checkbox
                        id={`brand-${brand._id}`}
                        checked={selectedBrands.includes(brand._id)}
                        onCheckedChange={(checked) => handleBrandChange(brand._id, checked as boolean)}
                      />
                      <label htmlFor={`brand-${brand._id}`} className="cursor-pointer flex-1">
                        {brand.name}
                      </label>
                    </DropdownMenuItem>
                  ))}
                  {selectedBrands.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSelectedBrands([])} className="text-[#FF6F61] cursor-pointer">
                        Clear Brands
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" onClick={clearAllFilters} className="text-[#FF6F61] hover:bg-[#FF6F61]/10">
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-[#4FC3F7] text-[#4FC3F7] bg-transparent">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  {SORT_OPTIONS.find((option) => option.value === selectedSort)?.label}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {SORT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSelectedSort(option.value)}
                    className={selectedSort === option.value ? "bg-[#4FC3F7]/10 text-[#4FC3F7]" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex border border-gray-200 rounded-lg p-1">
              {VIEW_MODES.map((mode) => (
                <Button
                  key={mode.value}
                  size="sm"
                  variant={viewMode === mode.value ? "default" : "ghost"}
                  onClick={() => setViewMode(mode.value as "grid" | "list")}
                  className={viewMode === mode.value ? "bg-[#4FC3F7] text-white" : "text-gray-600 hover:text-[#4FC3F7]"}
                >
                  <mode.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedCategories.map((categoryId) => {
              const category = categories.find((c) => c._id === categoryId)
              return (
                <Badge
                  key={categoryId}
                  variant="secondary"
                  className="bg-[#4FC3F7]/10 text-[#4FC3F7] border border-[#4FC3F7]/20"
                >
                  {category?.name}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                    onClick={() => handleCategoryChange(categoryId, false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )
            })}
            {selectedBrands.map((brandId) => {
              const brand = brands.find((b) => b._id === brandId)
              return (
                <Badge
                  key={brandId}
                  variant="secondary"
                  className="bg-[#33BF69]/10 text-[#33BF69] border border-[#33BF69]/20"
                >
                  {brand?.name}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                    onClick={() => handleBrandChange(brandId, false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )
            })}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <RefreshCw className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-semibold">Oops! Something went wrong</p>
              <p className="text-sm text-gray-600 mt-2">{error}</p>
            </div>
            <Button onClick={() => fetchProducts(1, true)} className="bg-[#4FC3F7] hover:bg-[#33BF69] text-white">
              Try Again
            </Button>
          </div>
        )}

        {/* Products Grid */}
        {!error && (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  : "space-y-6"
              }
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}

              {/* Loading Skeletons */}
              {(loading || loadingMore) &&
                [...Array(loading ? 12 : 4)].map((_, index) => <ProductSkeleton key={index} />)}
            </div>

            {/* Load More Button (fallback for infinite scroll) */}
            {!loading && hasMore && !loadingMore && (
              <div className="text-center mt-12">
                <Button
                  onClick={loadMore}
                  variant="outline"
                  className="border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white px-8 py-3 bg-transparent"
                >
                  Load More Products
                </Button>
              </div>
            )}

            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="text-center mt-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#4FC3F7] mx-auto" />
                <p className="text-gray-600 mt-2">Loading more products...</p>
              </div>
            )}

            {/* No More Products */}
            {!loading && !hasMore && products.length > 0 && (
              <div className="text-center mt-12 py-8">
                <p className="text-gray-600">You've reached the end! No more products to show.</p>
              </div>
            )}

            {/* No Products Found */}
            {!loading && products.length === 0 && !error && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Grid3X3 className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-[#455A64]">No products found</p>
                  <p className="text-gray-600 mt-2">
                    Try adjusting your filters or search criteria to find what you're looking for.
                  </p>
                </div>
                {activeFiltersCount > 0 && (
                  <Button onClick={clearAllFilters} className="bg-[#4FC3F7] hover:bg-[#33BF69] text-white mt-4">
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
