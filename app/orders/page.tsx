"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Calendar,
  CreditCard,
  Eye,
  X,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Filter,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import Navbar from "@/components/navbar"
import { useCookieContext } from "@/context/cookieContext"

// Types based on the API response
interface User {
  _id: string
  phone: string
  name: string
  email: string
  profileImage: string
}

interface Address {
  _id: string
  user: string
  phone: string
  pincode: string
  addressline: string
  city: string
  state: string
  landmark: string
  alternatePhone: string
  addressType: "home" | "work" | "other"
  isDefault: boolean
  CreatedAt: string
}

interface Product {
  _id: string
  name: string
  slug: string
  brandName: string
  images: string[]
}

interface Variant {
  _id: string
  sku: string
  price: number
  salePrice: number
  attributes: {
    size: string
    color: string
  }
  images: string[]
}

interface Brand {
  _id: string
  name: string
  logo: string
}

interface OrderItem {
  product: Product
  variant: Variant
  brand: Brand
  name: string
  sku: string
  price: number
  salePrice: number
  quantity: number
  attributes: {
    size: string
    color: string
  }
  images: string[]
  size: string
  color: string
}

interface BrandOrder {
  brand: Brand
  items: OrderItem[]
  status: "placed" | "accepted" | "shipped" | "delivered" | "return_requested" | "returned" | "completed" | "cancelled"
  shippingProvider: string | null
  ithinkOrderId: string | null
  ithinkOrderNo: string | null
  ithinkSyncStatus: string | null
  ithinkStatus: string | null
  ithinkStatusCode: string | null
  ithinkTrackingHistory: Array<{
    status: string
    statusCode: string
    timestamp: string
    location: string
    remarks: string
  }>
  ithinkLastSync: string | null
  customTrackingRef: string | null
  shippingStatus: string | null
  shippingTimeline: Array<{
    status: string
    timestamp: string
    details: string
  }>
  acceptedAt: string | null
  shippedAt: string | null
  deliveredAt: string | null
  returnRequestedAt: string | null
  returnAcceptedAt: string | null
  returnCompletedAt: string | null
  cancelledAt: string | null
  returnReason: string | null
  returnStatus: "not_requested" | "requested" | "pending" | "accepted" | "rejected" | "completed"
  refundStatus: "not_initiated" | "processing" | "completed"
  returnWindowExpiresAt: string | null
}

interface Order {
  _id: string
  user: User
  address: Address
  payment: {
    method: "cod" | "prepaid"
    status: "pending" | "paid" | "failed"
  }
  status: "placed" | "processing" | "completed" | "cancelled" | "failed"|"accepted"
  brandOrders: BrandOrder[]
  totalAmount: number
  createdAt: string
  updatedAt: string
}

interface OrdersResponse {
  totalOrders: number
  page: number
  limit: number
  totalPages: number
  orders: Order[]
}

// Skeleton Components
const OrderCardSkeleton = () => (
  <Card className="shadow-lg border-0 rounded-2xl">
    <CardContent className="p-6">
      {/* Order Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div>
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div>
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </div>

      <Separator className="my-4" />

      {/* Brand Order Skeleton */}
      <div className="space-y-4">
        <div className="space-y-3">
          {/* Brand Header Skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          {/* Items Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-[#F2F2F2]/30 rounded-xl">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Order Footer Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div>
            <Skeleton className="h-3 w-16 mb-2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </CardContent>
  </Card>
)

const FiltersSkeleton = () => (
  <Card className="mb-6 shadow-lg border-0 rounded-2xl">
    <CardContent className="p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
        <div className="sm:w-48">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </CardContent>
  </Card>
)

const HeaderSkeleton = () => (
  <div className="bg-white shadow-sm border-b">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-6" />
        <div className="flex-1">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  </div>
)

const LoadMoreSkeleton = () => (
  <Card className="shadow-lg border-0 rounded-2xl">
    <CardContent className="p-6 text-center">
      <div className="flex items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-[#4FC3F7] border-t-transparent rounded-full animate-spin" />
        <span className="text-[#455A64]">Loading more orders...</span>
      </div>
    </CardContent>
  </Card>
)

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [requestingReturn, setRequestingReturn] = useState<string | null>(null)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [returnReason, setReturnReason] = useState("")
  const [selectedSuborder, setSelectedSuborder] = useState<{ orderId: string; brandOrderIndex: number } | null>(null)
  const { cookieValue } = useCookieContext()

  const [userdata, setuserdata] = useState<any>()
  const api = process.env.NEXT_PUBLIC_API_URL

  // 1. Memoize userProfile to avoid recreation on every render
  const userProfile = useCallback(async () => {
    try {
      const response = await fetch(`${api}/api/home/profile-summary`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookieValue}`,
        },
      })
      const data = await response.json()
      setuserdata(data)
    } catch (err) {
      console.log(err)
    }
  }, [api, cookieValue])
  // Fetch orders function

  useEffect(() => {
    if (cookieValue) {
      userProfile()

    }
  }, [userProfile, cookieValue])

  
  const fetchOrders = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const response = await fetch(`http://localhost:8080/api/order/my/orders?page=${page}&limit=10`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookieValue}`,
            },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }

      const data: OrdersResponse = await response.json()

      if (append) {
        setOrders((prev) => [...prev, ...data.orders])
      } else {
        setOrders(data.orders)
      }

      setCurrentPage(data.page)
      setTotalPages(data.totalPages)
      setTotalOrders(data.totalOrders)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setMessage({ type: "error", text: "Failed to load orders. Please try again." })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [api, cookieValue])

  useEffect(() => {
    if(cookieValue){
      fetchOrders()
    }
  }, [fetchOrders,cookieValue])

  // Load more orders on scroll
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000 &&
      !loadingMore &&
      currentPage < totalPages
    ) {
      fetchOrders(currentPage + 1, true)
    }
  }, [currentPage, totalPages, loadingMore, fetchOrders])

  // Update suborder status function (cancel or request return)
  const updateSuborderStatus = async (
    orderId: string,
    brandOrderIndex: number,
    action: "cancel" | "request_return",
    returnReason?: string,
  ) => {
    try {
      const response = await fetch(`http://localhost:8080/api/brandOrder/order/${orderId}/stu`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookieValue}`, // Assuming token-based auth
        },
        body: JSON.stringify({

          brandOrderIndex,
          action,
          returnReason,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update suborder status")
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }

  // Cancel suborder function
  const cancelSuborder = async (orderId: string, brandOrderIndex: number) => {
    const cancelKey = `${orderId}-${brandOrderIndex}`
    setCancellingOrder(cancelKey)
    try {
      await updateSuborderStatus(orderId, brandOrderIndex, "cancel")

      // Update suborder status locally
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                brandOrders: order.brandOrders.map((brandOrder, index) =>
                  index === brandOrderIndex
                    ? { ...brandOrder, status: "cancelled" as const, cancelledAt: new Date().toISOString() }
                    : brandOrder,
                ),
              }
            : order,
        ),
      )

      setMessage({ type: "success", text: "Suborder cancelled successfully!" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to cancel suborder. Please try again." })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setCancellingOrder(null)
    }
  }

  // Request return function
  const requestReturn = async (orderId: string, brandOrderIndex: number, returnReason: string) => {
    const returnKey = `${orderId}-${brandOrderIndex}`
    setRequestingReturn(returnKey)
    try {
      await updateSuborderStatus(orderId, brandOrderIndex, "request_return", returnReason)

      // Update suborder status locally
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                brandOrders: order.brandOrders.map((brandOrder, index) =>
                  index === brandOrderIndex
                    ? {
                        ...brandOrder,
                        returnStatus: "requested" as const,
                        returnRequestedAt: new Date().toISOString(),
                        returnReason,
                      }
                    : brandOrder,
                ),
              }
            : order,
        ),
      )

      setMessage({ type: "success", text: "Return request submitted successfully!" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to request return. Please try again." })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setRequestingReturn(null)
      setShowReturnModal(false)
      setReturnReason("")
    }
  }

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "placed":
        return { color: "bg-blue-100 text-blue-800", icon: Clock, label: "Order Placed" }
      case "accepted":
        return { color: "bg-yellow-100 text-yellow-800", icon: CheckCircle, label: "Accepted" }
      case "shipped":
        return { color: "bg-purple-100 text-purple-800", icon: Truck, label: "Shipped" }
      case "delivered":
        return { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Delivered" }
      case "cancelled":
        return { color: "bg-red-100 text-red-800", icon: XCircle, label: "Cancelled" }
      case "completed":
        return { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Completed" }
      case "return_requested":
        return { color: "bg-orange-100 text-orange-800", icon: RefreshCw, label: "Return Requested" }
      case "returned":
        return { color: "bg-gray-100 text-gray-800", icon: RefreshCw, label: "Returned" }
      default:
        return { color: "bg-gray-100 text-gray-800", icon: Clock, label: status }
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Check if suborder can be cancelled
  const canCancelSuborder = (brandOrder: BrandOrder) => {
    return ["placed", "accepted"].includes(brandOrder.status)
  }

  // Check if return can be requested
  const canRequestReturn = (brandOrder: BrandOrder) => {
    return (
      brandOrder.status === "delivered" &&
      ["not_requested", "pending"].includes(brandOrder.returnStatus || "not_requested")
    )
  }

  // Check if suborder is completed (no actions available)
  const isSuborderCompleted = (brandOrder: BrandOrder) => {
    return (
      brandOrder.status === "completed" ||
      (brandOrder.status === "delivered" && brandOrder.returnStatus === "completed")
    )
  }

  // Check if order can be cancelled
  const canCancelOrder = (order: Order) => {
    return order.status === "placed" || order.status === "accepted"
  }

  // Cancel order function
  const cancelOrder = async (orderId: string) => {
    setCancellingOrder(orderId)
    try {
      await fetch(`http://localhost:8080/api/order/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token-based auth
        },
      })

      // Update order status locally
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status: "cancelled" as const, cancelledAt: new Date().toISOString() }
            : order,
        ),
      )

      setMessage({ type: "success", text: "Order cancelled successfully!" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to cancel order. Please try again." })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setCancellingOrder(null)
    }
  }

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.brandOrders.some((bo) =>
        bo.items.some(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.brand.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] to-white">
      {/* Navbar */}
      <Navbar isLoggedIn={cookieValue?true:false} variant="floating" userdata={userdata} />

      {/* Header */}
      {loading ? (
        <HeaderSkeleton />
      ) : (
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-[#455A64] hover:text-[#4FC3F7] transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[#455A64]">My Orders</h1>
                <p className="text-gray-600">Track and manage your orders</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ShoppingBag className="h-4 w-4" />
                <span>{totalOrders} Total Orders</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {message && (
          <Alert
            className={`mb-6 ${message.type === "success" ? "border-[#33BF69] bg-[#33BF69]/5" : "border-red-500 bg-red-50"}`}
          >
            <AlertCircle className={`h-4 w-4 ${message.type === "success" ? "text-[#33BF69]" : "text-red-500"}`} />
            <AlertDescription className={message.type === "success" ? "text-[#33BF69]" : "text-red-500"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        {loading ? (
          <FiltersSkeleton />
        ) : (
          <Card className="mb-6 shadow-lg border-0 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by order ID, product name, or brand..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="placed">Placed</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className="shadow-lg border-0 rounded-2xl">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm || statusFilter !== "all" ? "No matching orders found" : "No orders yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start shopping to see your orders here"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link href="/">
                  <Button className="bg-[#4FC3F7] hover:bg-[#33BF69] text-white px-8 py-3">Start Shopping</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order._id} className="shadow-lg border-0 rounded-2xl hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-mono text-sm font-medium text-[#455A64]">#{order._id.slice(-8)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="text-sm font-medium text-[#455A64]">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* <Badge className={getStatusInfo(order.status).color}>{getStatusInfo(order.status).label}</Badge> */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowOrderDetails(true)
                        }}
                        className="border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Order Items Preview */}
                  <div className="space-y-4">
                    {order.brandOrders.map((brandOrder, brandIndex) => (
                      <div key={brandIndex} className="space-y-3">
                        {/* Brand Header */}
                        <div className="flex items-center gap-3">
                          <Image
                            src={brandOrder.brand.logo || "/placeholder.svg"}
                            alt={brandOrder.brand.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <span className="font-medium text-[#455A64]">{brandOrder.brand.name}</span>
                          <Badge className={getStatusInfo(brandOrder.status).color}>
                            {getStatusInfo(brandOrder.status).label}
                          </Badge>
                        </div>

                        {/* Items */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {brandOrder.items.slice(0, 3).map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center gap-3 p-3 bg-[#F2F2F2]/30 rounded-xl">
                              <Image
                                src={item.images[0] || "/placeholder.svg"}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-[#455A64] truncate">{item.name}</p>
                                <p className="text-xs text-gray-500">
                                  {item.size} • {item.color} • Qty: {item.quantity}
                                </p>
                                <p className="text-sm font-semibold text-[#33BF69]">₹{item.salePrice}</p>
                              </div>
                            </div>
                          ))}
                          {brandOrder.items.length > 3 && (
                            <div className="flex items-center justify-center p-3 bg-[#F2F2F2]/30 rounded-xl">
                              <span className="text-sm text-gray-500">+{brandOrder.items.length - 3} more items</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Order Footer - Updated to show suborder actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-lg font-bold text-[#455A64]">₹{order.totalAmount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment</p>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-[#455A64] capitalize">{order.payment.method}</span>
                          <Badge
                            className={
                              order.payment.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : order.payment.status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {order.payment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Suborder Actions */}
                    <div className="flex flex-col gap-2">
                      {order.brandOrders.map((brandOrder, brandIndex) => (
                        <div key={brandIndex} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 min-w-[80px]">{brandOrder.brand.name}:</span>

                          {/* Cancel Button */}
                          {canCancelSuborder(brandOrder) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelSuborder(order._id, brandIndex)}
                              disabled={cancellingOrder === `${order._id}-${brandIndex}`}
                              className="border-red-500 text-red-500 hover:bg-red-50 text-xs px-2 py-1 h-7"
                            >
                              {cancellingOrder === `${order._id}-${brandIndex}` ? (
                                <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              Cancel
                            </Button>
                          )}

                          {/* Return Request Button */}
                          {canRequestReturn(brandOrder) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSuborder({ orderId: order._id, brandOrderIndex: brandIndex })
                                setShowReturnModal(true)
                              }}
                              disabled={requestingReturn === `${order._id}-${brandIndex}`}
                              className="border-orange-500 text-orange-500 hover:bg-orange-50 text-xs px-2 py-1 h-7"
                            >
                              {requestingReturn === `${order._id}-${brandIndex}` ? (
                                <div className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-1" />
                              ) : (
                                <RefreshCw className="h-3 w-3 mr-1" />
                              )}
                              Return
                            </Button>
                          )}

                          {/* Contact Support Message */}
                          {isSuborderCompleted(brandOrder) && (
                            <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                              Contact support@re-verse.in
                            </div>
                          )}

                          {/* Return Status Display */}
                          {brandOrder.returnStatus && brandOrder.returnStatus !== "not_requested" && (
                            <Badge className="text-xs px-2 py-1 h-6" variant="outline">
                              Return: {brandOrder.returnStatus}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-[#455A64]">Order Details</h3>
                  <p className="text-gray-600">Order ID: #{selectedOrder._id.slice(-8)}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setShowOrderDetails(false)} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Order Status & Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-[#4FC3F7]/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="h-5 w-5 text-[#4FC3F7]" />
                      <span className="font-medium text-[#455A64]">Order Status</span>
                    </div>
                    <Badge className={getStatusInfo(selectedOrder.status).color}>
                      {getStatusInfo(selectedOrder.status).label}
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="border-[#33BF69]/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-[#33BF69]" />
                      <span className="font-medium text-[#455A64]">Order Date</span>
                    </div>
                    <p className="text-sm text-gray-600">{formatDate(selectedOrder.createdAt)}</p>
                  </CardContent>
                </Card>

                <Card className="border-[#FF9800]/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="h-5 w-5 text-[#FF9800]" />
                      <span className="font-medium text-[#455A64]">Payment</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium capitalize">{selectedOrder.payment.method}</p>
                      <Badge
                        className={
                          selectedOrder.payment.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : selectedOrder.payment.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {selectedOrder.payment.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Delivery Address */}
              <Card className="border-[#4FC3F7]/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <MapPin className="h-5 w-5 text-[#4FC3F7]" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium text-[#455A64]">{selectedOrder.user.name}</p>
                    <p className="text-gray-600">{selectedOrder.address.addressline}</p>
                    <p className="text-gray-600">
                      {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}
                    </p>
                    {selectedOrder.address.landmark && (
                      <p className="text-gray-600">Landmark: {selectedOrder.address.landmark}</p>
                    )}
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">+91 {selectedOrder.address.phone}</span>
                      </div>
                      {selectedOrder.address.alternatePhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">+91 {selectedOrder.address.alternatePhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Brand Orders */}
              <div className="space-y-6">
                <h4 className="text-xl font-bold text-[#455A64]">Order Items</h4>
                {selectedOrder.brandOrders.map((brandOrder, brandIndex) => (
                  <Card key={brandIndex} className="border-[#33BF69]/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Image
                            src={brandOrder.brand.logo || "/placeholder.svg"}
                            alt={brandOrder.brand.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div>
                            <CardTitle className="text-lg">{brandOrder.brand.name}</CardTitle>
                            <CardDescription>
                              {brandOrder.items.length} item{brandOrder.items.length > 1 ? "s" : ""}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusInfo(brandOrder.status).color}>
                          {getStatusInfo(brandOrder.status).label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {brandOrder.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-4 p-4 bg-[#F2F2F2]/30 rounded-xl">
                            <Image
                              src={item.images[0] || "/placeholder.svg"}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-[#455A64] mb-1">{item.name}</h5>
                              <p className="text-sm text-gray-600 mb-2">SKU: {item.sku}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="px-2 py-1 bg-white rounded-md border">Size: {item.size}</span>
                                <span className="px-2 py-1 bg-white rounded-md border">Color: {item.color}</span>
                                <span className="px-2 py-1 bg-white rounded-md border">Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-[#33BF69]">₹{item.salePrice}</p>
                              {item.price !== item.salePrice && (
                                <p className="text-sm text-gray-500 line-through">₹{item.price}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Timeline */}
                      {brandOrder.shippingTimeline.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h6 className="font-medium text-[#455A64] mb-4 flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            Shipping Timeline
                          </h6>
                          <div className="space-y-3">
                            {brandOrder.shippingTimeline.map((timeline, timelineIndex) => (
                              <div key={timelineIndex} className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-[#4FC3F7] rounded-full"></div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-[#455A64]">{timeline.status}</p>
                                  <p className="text-xs text-gray-500">{formatDate(timeline.timestamp)}</p>
                                  {timeline.details && <p className="text-xs text-gray-600">{timeline.details}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tracking Info */}
                      {(brandOrder.ithinkOrderId || brandOrder.customTrackingRef) && (
                        <div className="mt-4 p-4 bg-[#4FC3F7]/5 rounded-xl">
                          <h6 className="font-medium text-[#455A64] mb-2">Tracking Information</h6>
                          {brandOrder.ithinkOrderId && (
                            <p className="text-sm text-gray-600">
                              iThink Order ID: <span className="font-mono">{brandOrder.ithinkOrderId}</span>
                            </p>
                          )}
                          {brandOrder.customTrackingRef && (
                            <p className="text-sm text-gray-600">
                              Tracking Reference: <span className="font-mono">{brandOrder.customTrackingRef}</span>
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Total */}
              <Card className="border-[#33BF69]/20 bg-[#33BF69]/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#455A64]">Total Amount</span>
                    <span className="text-2xl font-bold text-[#33BF69]">₹{selectedOrder.totalAmount}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                {/* {canCancelOrder(selectedOrder) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      cancelOrder(selectedOrder._id)
                      setShowOrderDetails(false)
                    }}
                    disabled={cancellingOrder === selectedOrder._id}
                    className="border-red-500 text-red-500 hover:bg-red-50 flex-1"
                  >
                    {cancellingOrder === selectedOrder._id ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Cancel Order
                  </Button>
                )} */}
                <Button
                  onClick={() => setShowOrderDetails(false)}
                  className="bg-[#4FC3F7] hover:bg-[#33BF69] text-white flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
