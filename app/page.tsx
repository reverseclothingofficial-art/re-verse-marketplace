"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Heart, Star, Sparkles, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import { useCookieContext } from '../context/cookieContext'
// Mock data
const heroSlides = [
  {
    id: 1,
    title: "Introducing RE-VERSE.IN: A New Era Begins",
    subtitle: "Zero Textile Waste, 100% Impact.",
    cta: "Together, let's make fashion sustainable.",
    background: "linear-gradient(135deg, #33BF69 0%, #4FC3F7 100%)",
    image: "/hero1.webp"
  },
  
  {
    id: 2,
    title: "Redefine Sustainability",
    subtitle: "Eco-friendly fashion for all.",
    cta: "Style with a greener purpose.",
    background: "linear-gradient(135deg, #FF6F61 0%, #33BF69 100%)",
    image: "/hero2.webp",
  },
]

const featuredBrands = [
  {
    id: 1,
    name: "EcoThread",
    logo: "/placeholder.svg?height=120&width=120",
    products: 45,
    description: "Sustainable basics",
  },
  {
    id: 2,
    name: "GreenWear",
    logo: "/placeholder.svg?height=120&width=120",
    products: 32,
    description: "Eco-friendly fashion",
  },
  {
    id: 3,
    name: "SustainStyle",
    logo: "/placeholder.svg?height=120&width=120",
    products: 28,
    description: "Conscious clothing",
  },
  {
    id: 4,
    name: "EarthFashion",
    logo: "/placeholder.svg?height=120&width=120",
    products: 56,
    description: "Planet-friendly wear",
  },
  {
    id: 5,
    name: "NatureTrend",
    logo: "/placeholder.svg?height=120&width=120",
    products: 41,
    description: "Natural materials",
  },
  {
    id: 6,
    name: "CleanCouture",
    logo: "/placeholder.svg?height=120&width=120",
    products: 38,
    description: "Clean fashion",
  },
  {
    id: 7,
    name: "PureFashion",
    logo: "/placeholder.svg?height=120&width=120",
    products: 29,
    description: "Pure sustainability",
  },
]

const products = [
  {
    id: 1,
    name: "Organic Cotton Tee",
    brand: "EcoThread",
    price: 899,
    originalPrice: 1299,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.5,
    reviews: 128,
    isNew: true,
    onSale: true,
    colors: ["#FF6F61", "#4FC3F7", "#33BF69"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Recycled Denim Jacket",
    brand: "GreenWear",
    price: 2499,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.8,
    reviews: 89,
    featured: true,
    colors: ["#455A64", "#33BF69"],
    sizes: ["M", "L", "XL"],
  },
  {
    id: 3,
    name: "Hemp Blend Dress",
    brand: "SustainStyle",
    price: 1899,
    originalPrice: 2499,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.6,
    reviews: 156,
    onSale: true,
    colors: ["#FF6F61", "#F2F2F2"],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 4,
    name: "Bamboo Fiber Shirt",
    brand: "EarthFashion",
    price: 1299,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.4,
    reviews: 73,
    isNew: true,
    colors: ["#4FC3F7", "#455A64", "#33BF69"],
    sizes: ["S", "M", "L"],
  },
  {
    id: 5,
    name: "Upcycled Cargo Pants",
    brand: "NatureTrend",
    price: 1799,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.7,
    reviews: 94,
    featured: true,
    colors: ["#455A64", "#33BF69"],
    sizes: ["M", "L", "XL", "XXL"],
  },
  {
    id: 6,
    name: "Sustainable Hoodie",
    brand: "EcoThread",
    price: 2199,
    originalPrice: 2899,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.3,
    reviews: 112,
    onSale: true,
    colors: ["#FF6F61", "#4FC3F7", "#455A64"],
    sizes: ["S", "M", "L", "XL"],
  },
]

// Memoized ProductCard component to prevent unnecessary re-renders
const ProductCard = memo(({ product, index = 0 }: { product: any; index?: number }) => {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  // Simple fade-in on scroll
  useEffect(() => {
    const node = cardRef.current
    if (!node) return
    let raf: number
    const show = () => {
      raf = requestAnimationFrame(() => setVisible(true))
    }
    if ("IntersectionObserver" in window) {
      const observer = new window.IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            show()
            observer.disconnect()
          }
        },
        { threshold: 0.1 }
      )
      observer.observe(node)
      return () => {
        observer.disconnect()
        cancelAnimationFrame(raf)
      }
    } else {
      show()
      return () => cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <Card
        ref={cardRef}
        tabIndex={0}
        className={`group overflow-hidden border-0 shadow-lg bg-white rounded-3xl transform-gpu will-change-transform transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        style={{
          animationDelay: `${index * 60}ms`,
          boxShadow: isHovered
            ? "0 8px 32px rgba(79,195,247,0.10), 0 2px 8px rgba(0,0,0,0.05)"
            : "0 2px 8px rgba(0,0,0,0.05)",
          transform: isHovered
            ? "scale(1.025) translateY(-2px)"
            : "scale(1) translateY(0)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-t-3xl">
          <div className="aspect-[3/4] relative bg-gradient-to-br from-[#F2F2F2] to-white">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                opacity: visible ? 1 : 0,
                transitionProperty: "opacity",
              }}
              loading="lazy"
            />
          </div>
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-[#4FC3F7] text-white border-0 rounded-full px-3 py-1 text-xs font-semibold shadow-md">
                NEW
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-[#FF6F61] text-white border-0 rounded-full px-3 py-1 text-xs font-semibold shadow-md">
                FEATURED
              </Badge>
            )}
            {product.onSale && (
              <Badge className="bg-[#33BF69] text-white border-0 rounded-full px-3 py-1 text-xs font-semibold shadow-md">
                SALE
              </Badge>
            )}
            {(!product.quantity || product.quantity === 0) && (
              <Badge className="bg-gray-400 text-white border-0 rounded-full px-3 py-1 text-xs font-semibold shadow-md">
                OUT OF STOCK
              </Badge>
            )}
          </div>
          {/* Wishlist Button */}
          <div
            className="absolute top-3 right-3 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0.7,
            }}
          >
            {/* <Button
              size="icon"
              variant="ghost"
              className="bg-white/95 hover:bg-white rounded-full shadow-md border border-white/30"
              tabIndex={-1}
              onClick={e => e.preventDefault()} // Prevents navigating away if clicked
            >
              <Heart className="h-4 w-4 text-[#FF6F61]" />
            </Button> */}
          </div>
        </div>
        <CardContent className="p-5 space-y-3">
          {/* Rating & Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-600 ml-1 font-medium">
                ({product.reviews})
              </span>
            </div>
            <span className="text-xs text-[#4FC3F7] font-semibold bg-[#4FC3F7]/10 px-2 py-1 rounded-full">
              {product.brand}
            </span>
          </div>
          <h3 className="font-bold text-[#455A64] text-lg leading-tight line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl text-[#455A64]">
              ₹{product.minSalePrice}
            </span>
            {product.price && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.price}
                </span>
                <span className="text-xs bg-[#33BF69] text-white px-2 py-1 rounded-full font-semibold">
                  {Math.round(((product.price - product.minSalePrice) / product.price) * 100)}% OFF
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 font-medium">Colors:</span>
            <div className="flex gap-1">
              {product.colors?.slice(0, 3).map((color: string, colorIndex: number) => (
                <div
                  key={colorIndex}
                  className="w-4 h-4 rounded-full border-2 border-black shadow-sm"
                  style={{
                    backgroundColor: color,
                  }}
                />
              ))}
              {product.colors?.length > 3 && (
                <span className="text-xs text-gray-500 font-medium">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 font-medium">Sizes:</span>
            <div className="flex gap-1">
              {product.sizes?.slice(0, 4).map((size: string, sizeIndex: number) => (
                <span
                  key={sizeIndex}
                  className="text-xs bg-[#F2F2F2] text-[#455A64] px-2 py-1 rounded-md font-medium"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
})

ProductCard.displayName = "ProductCard"

// Memoized BrandCard component
const MAX_DESC_LENGTH = 100;

const BrandCard = memo(({ brand }: { brand: any }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const isLong = brand.description.length > MAX_DESC_LENGTH;
  const shortDescription = isLong
    ? brand.description.slice(0, MAX_DESC_LENGTH) + "..."
    : brand.description;

  return (
    <div className="group flex-shrink-0 w-64 overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white rounded-2xl">
      <div className="p-6 text-center">
        <div className="relative mb-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#F2F2F2] to-white shadow-inner flex items-center justify-center group-hover:shadow-lg transition-shadow duration-300">
            <Image
              src={brand.logo || "/placeholder.svg"}
              alt={brand.name}
              width={60}
              height={60}
              className="rounded-full group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#33BF69] to-[#4FC3F7] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        </div>
        <h3 className="font-bold text-[#455A64] text-lg mb-1 group-hover:text-[#33BF69] transition-colors duration-300">
          {brand.name}
        </h3>
        <div className="relative flex justify-center">
          <p
            className={`text-sm text-gray-600 mb-2 ${isLong ? "cursor-pointer" : ""}`}
            onMouseEnter={() => isLong && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {shortDescription}
          </p>
          {/* {isLong && showTooltip && (
            <div className="absolute z-30 left-1/2 -translate-x-1/2 top-full mt-2 w-72 p-3 bg-white border border-gray-300 rounded shadow-xl text-gray-800 text-left text-sm">
              {brand.description}
            </div>
          )} */}
        </div>
        <Link href={`/brands/${brand.id}`}>
        <Button
          className="mt-3 border border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white rounded-full px-4 py-1 transition-all duration-300 bg-transparent text-sm font-medium"
        >
          Explore
        </Button>
        </Link>
      </div>
    </div>
  );
});

BrandCard.displayName = "BrandCard";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const api=process.env.NEXT_PUBLIC_API_URL
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [brands,setbrands]=useState<any>([])
  const [newa,setnewa]=useState<any>([])
  const [salei,setsalei]=useState<any>([])
  const [brandScrollPosition, setBrandScrollPosition] = useState(0)
  const brandScrollRef = useRef<HTMLDivElement>(null)
  const [userdata,setuserdata]=useState<any>()
  const { cookieValue } = useCookieContext()
  const fetchbrands=async()=>{
    try{
      const response = await fetch(`${api}/api/home/brands`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          },
      });
      const data = await response.json();
      console.log(data)
      setbrands(data)


    }catch(err){
      console.log(err)
    }

  }
  const newarrivals=async()=>{
    try{
      const response = await fetch(`${api}/api/home/products/random-recent`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          },
      });
      const data = await response.json();
      console.log(data)
      setnewa(data)


    }catch(err){
      console.log(err)
    }

  }
  const sale=async()=>{
    try{
      const response = await fetch(`${api}/api/home/products/sale`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          },
      });
      const data = await response.json();
      console.log(data)
      setsalei(data)


    }catch(err){
      console.log(err)
    }

  }

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
  useEffect(() => {
    userProfile()
    setIsLoggedIn(!!cookieValue)
    fetchbrands()
    newarrivals()
    sale()
  }, [cookieValue])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)

  const scrollBrands = useCallback(
    (direction: "left" | "right") => {
      if (brandScrollRef.current) {
        const scrollAmount = 300
        const newPosition =
          direction === "left"
            ? Math.max(0, brandScrollPosition - scrollAmount)
            : Math.min(
                brandScrollRef.current.scrollWidth - brandScrollRef.current.clientWidth,
                brandScrollPosition + scrollAmount,
              )

        brandScrollRef.current.scrollTo({
          left: newPosition,
          behavior: "smooth",
        })
        setBrandScrollPosition(newPosition)
      }
    },
    [brandScrollPosition],
  )

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* Navbar */}
      <Navbar isLoggedIn={isLoggedIn} variant="floating" userdata={userdata} />

      {/* Hero Carousel - Keep existing */}
      <section className="relative h-screen overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            index === currentSlide
              ? "translate-x-0"
              : index < currentSlide
              ? "-translate-x-full"
              : "translate-x-full"
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex items-center justify-center h-full text-white bg-black/30 backdrop-blur-sm">
            <div className="text-center max-w-4xl px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-in slide-in-from-bottom-4 duration-1000">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 animate-in slide-in-from-bottom-4 duration-1000 delay-200">
                {slide.subtitle}
              </p>
              <p className="text-lg mb-8 opacity-80 animate-in slide-in-from-bottom-4 duration-1000 delay-300">
                {slide.cta}
              </p>
              <Button
                size="lg"
                className="bg-white text-[#455A64] hover:bg-[#F2F2F2] rounded-full px-8 py-3 animate-in slide-in-from-bottom-4 duration-1000 delay-500 hover:scale-105 transition-transform"
              >
                Explore Now
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
        onClick={nextSlide}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>

      {/* Enhanced Featured Brands Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#4FC3F7] to-[#33BF69] rounded-2xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-[#455A64] mb-2">Featured Brands</h2>
                <p className="text-gray-600">Discover sustainable fashion leaders</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollBrands("left")}
                className="rounded-full border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white transition-all duration-300"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollBrands("right")}
                className="rounded-full border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white transition-all duration-300"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              <Link
                href="/brands"
                className="text-[#4FC3F7] hover:text-[#FF6F61] font-semibold ml-4 transition-colors duration-300"
              >
                View All →
              </Link>
            </div>
          </div>

          <div className="relative">
            <div
              ref={brandScrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {brands?.map((brand:any) => (
                <BrandCard key={brand?.id} brand={brand} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Product Sections */}
      {/* New Products */}
      <section className="py-20 bg-gradient-to-br from-[#F2F2F2] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#4FC3F7] to-[#33BF69] rounded-2xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-[#455A64] mb-2">New Arrivals</h2>
                <p className="text-gray-600">Fresh sustainable fashion just in</p>
              </div>
            </div>
            <Link
              href="/new"
              className="text-[#4FC3F7] hover:text-[#FF6F61] font-semibold transition-colors duration-300"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {newa
              .filter((p:any) => p.isNew)
              .map((product:any, index:any) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {/* <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6F61] to-[#4FC3F7] rounded-2xl flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-[#455A64] mb-2">Featured Products</h2>
                <p className="text-gray-600">Handpicked sustainable favorites</p>
              </div>
            </div>
            <Link
              href="/featured"
              className="text-[#4FC3F7] hover:text-[#FF6F61] font-semibold transition-colors duration-300"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products
              .filter((p) => p.featured)
              .map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
          </div>
        </div>
      </section> */}

      {/* Sale Products */}
      <section className="py-20 bg-gradient-to-br from-[#F2F2F2] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#33BF69] to-[#4FC3F7] rounded-2xl flex items-center justify-center">
                <Tag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-[#455A64] mb-2">On Sale</h2>
                <p className="text-gray-600">Sustainable fashion at great prices</p>
              </div>
            </div>
            <Link
              href="/sale"
              className="text-[#4FC3F7] hover:text-[#FF6F61] font-semibold transition-colors duration-300"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {salei
              .map((product:any, index:any) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
          </div>
        </div>
      </section>

      {/* Footer - Keep existing */}
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
