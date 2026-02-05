"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Search, User, Heart, ShoppingBag, Home, X, Menu, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface NavbarProps {
  isLoggedIn?: boolean
  variant?: "floating" | "curved" | "minimal" | "gradient"
  userdata?: any
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


export default function Navbar({ isLoggedIn = false, variant = "floating" ,userdata={}}: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false)
  const [showMobileCategoriesMenu, setShowMobileCategoriesMenu] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const hideTimeout = useRef<NodeJS.Timeout | null>(null)
  const api=process.env.NEXT_PUBLIC_API_URL
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await fetch(`${api}/api/cat/getall`)
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data || [])
    } catch (err) {
      console.error("Error fetching categories:", err)
    } finally {
      setLoadingCategories(false)
    }
  }

  const logout = async () => {
    try {
      const nextresponse = await fetch("/api/delete-cookies")
      const nextdata = await nextresponse.json()
      if (nextresponse.ok) {
        window.location.href='/'
      }
    } catch (err) {
      console.log(err)
    }
  }
const router=useRouter()
const navItems = [
  { name: "NEW IN", href: "/newin" },
  // { name: "Featured", href: "/featured" },
  { name: "Categories", href: "/categories", hasDropdown: true },
  { name: "Brands", href: "/brands" },
  { name: "Sell&Sustain", href: "/sell&sustain" },
]
  const getNavbarStyles = () => {
    switch (variant) {
      case "floating":
        return "sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl mx-4 border border-white/20"
      case "curved":
        return "sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-xl rounded-b-3xl mx-4 mt-2 border-b border-white/20"
      case "minimal":
        return "sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-100"
      case "gradient":
        return "sticky top-0 z-50 bg-gradient-to-r from-white/90 via-[#F2F2F2]/80 to-white/90 backdrop-blur-xl shadow-xl border-b-2 border-gradient-to-r from-[#4FC3F7]/20 via-[#33BF69]/20 to-[#FF6F61]/20"
      default:
        return "sticky top-4 z-50 bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl mx-4 border border-white/20"
    }
  }

  const getContainerStyles = () => {
    switch (variant) {
      case "floating":
      case "curved":
        return "max-w-7xl mx-auto px-6 sm:px-8 lg:px-10"
      case "minimal":
      case "gradient":
        return "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      default:
        return "max-w-7xl mx-auto px-6 sm:px-8 lg:px-10"
    }
  }

  // --- Dropdown hover delay logic ---
  const handleUserMenuEnter = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current)
      hideTimeout.current = null
    }
    setShowUserMenu(true)
  }

  const handleUserMenuLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setShowUserMenu(false)
    }, 600) // 1000ms = 1 second delay
  }
  // ----------------------------------

  return (
    <>
      <nav className={getNavbarStyles()}>
        <div className={getContainerStyles()}>
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Re-verse Logo"
                  width={72}
                  height={72}
                  className="object-contain"
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-[#33BF69] via-[#4FC3F7] to-[#FF6F61] rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && setShowCategoriesMenu(true)}
                  onMouseLeave={() => item.hasDropdown && setShowCategoriesMenu(false)}
                >
                  {item.hasDropdown ? (
                    <button
                      className="relative px-4 py-2 text-[#455A64] hover:text-[#FF6F61] font-semibold transition-all duration-300 group rounded-xl hover:bg-[#F2F2F2]/50 flex items-center"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {item.name}
                      <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#FF6F61] via-[#4FC3F7] to-[#33BF69] group-hover:w-3/4 transition-all duration-500 rounded-full"></span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF6F61]/5 via-[#4FC3F7]/5 to-[#33BF69]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="relative px-4 py-2 text-[#455A64] hover:text-[#FF6F61] font-semibold transition-all duration-300 group rounded-xl hover:bg-[#F2F2F2]/50"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {item.name}
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#FF6F61] via-[#4FC3F7] to-[#33BF69] group-hover:w-3/4 transition-all duration-500 rounded-full"></span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF6F61]/5 via-[#4FC3F7]/5 to-[#33BF69]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  )}

                  {/* Categories Dropdown - Desktop */}
                  {item.hasDropdown && showCategoriesMenu && (
  <div
    className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-4 z-50 transition-all duration-300 ease-out opacity-100 scale-100"
    style={{ willChange: "opacity, transform" }}
  >
    <div className="absolute -top-2 left-6 w-4 h-4 bg-white/95 backdrop-blur-xl border-l border-t border-white/20 transform rotate-45"></div>

    <div className="px-6 pb-3 border-b border-gray-100">
      <h3 className="font-semibold text-[#455A64] text-lg">Shop by Category</h3>
      <p className="text-sm text-gray-600 mt-1">Discover products in your favorite categories</p>
    </div>

    <div className="max-h-80 overflow-y-auto">
      {loadingCategories ? (
        <div className="px-6 py-4">
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : categories.filter((category) => category.isActive).length > 0 ? (
        <div className="py-2">
          {categories
            .filter((category) => category.isActive)
            .map((category, categoryIndex) => (
              <Link
                key={category._id}
                href={`/newin?category=${category._id}`}
                className="flex items-center px-6 py-3 text-[#455A64] hover:bg-gradient-to-r hover:from-[#F2F2F2]/50 hover:to-[#4FC3F7]/10 hover:text-[#33BF69] transition-all duration-200 group"
                tabIndex={0}
                onClick={() => setShowCategoriesMenu(false)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#4FC3F7]/20 via-[#33BF69]/20 to-[#FF6F61]/20 rounded-lg flex items-center justify-center group-hover:from-[#4FC3F7]/30 group-hover:via-[#33BF69]/30 group-hover:to-[#FF6F61]/30 transition-all duration-300">
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl || "/placeholder.svg"}
                        alt={category.name}
                        className="w-6 h-6 object-cover rounded"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-[#4FC3F7] font-semibold text-sm">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm group-hover:text-[#33BF69] transition-colors">
                      {category.name}
                    </p>
                    {category.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
                {category.featured && (
                  <Badge className="bg-[#FF6F61]/10 text-[#FF6F61] text-xs border-[#FF6F61]/20">
                    Featured
                  </Badge>
                )}
              </Link>
            ))}
        </div>
      ) : (
        <div className="px-6 py-8 text-center">
          <div className="text-gray-400 mb-2">
            <Search className="h-8 w-8 mx-auto" />
          </div>
          <p className="text-sm text-gray-600">No categories available</p>
        </div>
      )}
    </div>
  </div>
)}
                </div>
              ))}
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4FC3F7]/20 via-[#33BF69]/20 to-[#FF6F61]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-[#4FC3F7] transition-colors duration-300" />
                  <Input
                    placeholder="Search sustainable fashion..."
                    className="pl-12 pr-4 py-3 rounded-2xl border-2 border-[#455A64]/10 focus:border-[#4FC3F7] bg-[#F2F2F2]/30 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:bg-white/50 hover:bg-white/40"
                  />
                </div>
              </div>
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-2">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-[#455A64] hover:text-[#FF6F61] hover:bg-[#F2F2F2]/50 rounded-full transition-all duration-300"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-[#455A64] hover:text-[#FF6F61] hover:bg-[#F2F2F2]/50 rounded-full transition-all duration-300 hover:scale-110"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              >
                {showMobileSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex text-[#455A64] hover:text-[#FF6F61] hover:bg-[#F2F2F2]/50 rounded-full transition-all duration-300 hover:scale-110"
              >
                <Home className="h-5 w-5" />
              </Button>

              {/* User Menu */}
              <div
                className="relative"
                onMouseEnter={handleUserMenuEnter}
                onMouseLeave={handleUserMenuLeave}
              >
                {isLoggedIn ? (
                  <div className="relative group">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#4FC3F7] via-[#33BF69] to-[#FF6F61] rounded-full flex items-center justify-center cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-110 overflow-hidden">
  {userdata?.profileImage ? (
    <img
      src={userdata?.profileImage}
      alt={userdata?.name || "Userduserdata"}
      className="w-full h-full object-cover rounded-full"
    />
  ) : (
    <span className="text-white font-semibold">
      {userdata?.name
        ? userdata.name
            .split(" ")
            .map((word:any) => word[0])
            .join("")
            .toUpperCase()
        : "U"}
    </span>
  )}
</div>

                    <div className="absolute -inset-1 bg-gradient-to-r from-[#4FC3F7] via-[#33BF69] to-[#FF6F61] rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#455A64] hover:text-[#FF6F61] hover:bg-[#F2F2F2]/50 rounded-full transition-all duration-300 hover:scale-110"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-3 z-50 animate-in slide-in-from-top-2 duration-300">
                    <div className="absolute -top-2 right-4 w-4 h-4 bg-white/95 backdrop-blur-xl border-l border-t border-white/20 transform rotate-45"></div>
                    {isLoggedIn ? (
                      <>
                        <div className="px-5 py-3 border-b border-gray-100">
                          <p className="font-semibold text-[#455A64]">{userdata?.name}</p>
                          <p className="text-sm text-gray-600">{userdata?.email || userdata?.phone}</p>
                        </div>
                        {["My Profile", "Orders", "Re-verse Coins", "Returns"].map((item, index) => (
                          <Link
                            key={item}
                            href={`/${item.toLowerCase().replace(" ", "-")}`}
                            className="block px-5 py-3 text-sm text-[#455A64] hover:bg-gradient-to-r hover:from-[#F2F2F2]/50 hover:to-[#4FC3F7]/10 hover:text-[#33BF69] transition-all duration-200 rounded-lg mx-2"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            {item}
                          </Link>
                        ))}
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button className="block w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg mx-2"
                          onClick={logout}
                          >
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        className="block px-5 py-3 text-sm text-[#455A64] hover:bg-[#F2F2F2]/50 hover:text-[#33BF69] transition-all duration-200 rounded-lg mx-2"
                      >
                        Sign In
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist & Cart */}
              {/* <Button
                variant="ghost"
                size="icon"
                className="text-[#455A64] hover:text-[#FF6F61] hover:bg-[#F2F2F2]/50 rounded-full transition-all duration-300 relative hover:scale-110"
              >
                <Heart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-[#FF6F61] to-[#4FC3F7] text-white text-xs flex items-center justify-center border-2 border-white animate-pulse">
                  {userdata?.wishlistCount || '0'}
                </Badge>
              </Button> */}

              <Button
                variant="ghost"
                size="icon"
                className="text-[#455A64] hover:text-[#FF6F61] hover:bg-[#F2F2F2]/50 rounded-full transition-all duration-300 relative hover:scale-110"
                onClick={()=>router.push('/cart')}
              >
                <ShoppingBag className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-[#33BF69] to-[#4FC3F7] text-white text-xs flex items-center justify-center border-2 border-white animate-bounce">
                {userdata?.cartCount || '0'}
                </Badge>
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {showMobileSearch && (
            <div className="md:hidden pb-4 animate-in slide-in-from-top-2 duration-300">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-[#4FC3F7] transition-colors duration-300" />
                <Input
                  placeholder="Search sustainable fashion..."
                  className="pl-12 pr-4 py-3 rounded-2xl border-2 border-[#455A64]/10 focus:border-[#4FC3F7] bg-[#F2F2F2]/30 backdrop-blur-sm transition-all duration-300 focus:bg-white/50"
                />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {/* {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="fixed top-24 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 animate-in slide-in-from-top-4 duration-300">
            <div className="space-y-4">
              {navItems.map((item, index) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="block px-4 py-3 text-[#455A64] hover:text-[#FF6F61] font-semibold transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-[#F2F2F2]/50 hover:to-[#4FC3F7]/10"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )} */}

{showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="fixed top-24 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 animate-in slide-in-from-top-4 duration-300 max-h-[80vh] overflow-y-auto">
            <div className="space-y-4">
              {navItems.map((item, index) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div className="space-y-2">
                      <button
                        className="flex items-center justify-between w-full px-4 py-3 text-[#455A64] font-semibold border-b border-gray-100 hover:text-[#FF6F61] transition-colors duration-300"
                        onClick={() => setShowMobileCategoriesMenu(!showMobileCategoriesMenu)}
                      >
                        <span>{item.name}</span>
                        <ChevronRight
                          className={`h-5 w-5 transition-transform duration-300 ${
                            showMobileCategoriesMenu ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {/* Mobile Categories Dropdown */}
                      {showMobileCategoriesMenu && (
                        <div className="pl-4 space-y-1 animate-in slide-in-from-top-2 duration-300">
                          <div className="px-4 py-2 bg-gradient-to-r from-[#F2F2F2]/50 to-[#4FC3F7]/10 rounded-xl mb-3">
                            <h4 className="font-semibold text-[#455A64] text-sm">Shop by Category</h4>
                            <p className="text-xs text-gray-600 mt-1">Discover products in your favorite categories</p>
                          </div>

                          {loadingCategories ? (
                            <div className="space-y-3 px-4">
                              {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-3 animate-pulse">
                                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                                  <div className="flex-1">
                                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-2 bg-gray-200 rounded w-1/2 mt-1"></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : categories.length > 0 ? (
                            <>
                              {categories
                                .filter((category) => category.isActive)
                                
                                .map((category, categoryIndex) => (
                                  <Link
                                    key={category._id}
                                    href={`/newin?category=${category._id}`}
                                    className="flex items-center px-4 py-3 text-sm text-[#455A64] hover:text-[#FF6F61] transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-[#F2F2F2]/50 hover:to-[#4FC3F7]/10 group"
                                    style={{ animationDelay: `${categoryIndex * 50}ms` }}
                                    onClick={() => {
                                      setShowMobileMenu(false)
                                      setShowMobileCategoriesMenu(false)
                                    }}
                                  >
                                    <div className="flex items-center space-x-3 flex-1">
                                      <div className="w-8 h-8 bg-gradient-to-br from-[#4FC3F7]/20 via-[#33BF69]/20 to-[#FF6F61]/20 rounded-lg flex items-center justify-center group-hover:from-[#4FC3F7]/30 group-hover:via-[#33BF69]/30 group-hover:to-[#FF6F61]/30 transition-all duration-300">
                                        {category.imageUrl ? (
                                          <img
                                            src={category.imageUrl || "/placeholder.svg"}
                                            alt={category.name}
                                            className="w-5 h-5 object-cover rounded"
                                          />
                                        ) : (
                                          <span className="text-[#4FC3F7] font-semibold text-xs">
                                            {category.name.charAt(0).toUpperCase()}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-medium text-sm group-hover:text-[#33BF69] transition-colors">
                                          {category.name}
                                        </p>
                                        {category.description && (
                                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                            {category.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    {category.featured && (
                                      <Badge className="bg-[#FF6F61]/10 text-[#FF6F61] text-xs border-[#FF6F61]/20">
                                        Featured
                                      </Badge>
                                    )}
                                  </Link>
                                ))}

                              {/* {categories.filter((category) => category.isActive).length > 10 && (
                                <div className="px-4 py-3 border-t border-gray-100 mt-2">
                                  <Link
                                    href="/categories"
                                    className="text-[#4FC3F7] hover:text-[#33BF69] font-medium text-sm transition-colors flex items-center justify-center"
                                    onClick={() => {
                                      setShowMobileMenu(false)
                                      setShowMobileCategoriesMenu(false)
                                    }}
                                  >
                                    View All Categories
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                  </Link>
                                </div>
                              )} */}
                            </>
                          ) : (
                            <div className="px-4 py-6 text-center">
                              <div className="text-gray-400 mb-2">
                                <Search className="h-6 w-6 mx-auto" />
                              </div>
                              <p className="text-xs text-gray-600">No categories available</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-4 py-3 text-[#455A64] hover:text-[#FF6F61] font-semibold transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-[#F2F2F2]/50 hover:to-[#4FC3F7]/10"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
