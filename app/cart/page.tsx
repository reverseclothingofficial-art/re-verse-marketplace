"use client"

import { useState, Suspense, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Tag, Truck, Shield, X, AlertCircle, Check, Loader2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Navbar from "@/components/navbar"
import { Input } from "@/components/ui/input"
import { useCookieContext } from "@/context/cookieContext"
import { Spinner } from "@/components/ui/spinner"

// Mock cart data based on your schema
const mockCartData = {
  _id: "6862a015e9f1a824f3848b92",
  user: "6820f168efb6187acfd6326b",
  items: [
    {
      variant: {
        attributes: {
          size: "S",
          color: "white",
        },
        _id: "68617d5cd28e4aa9ffbd09c5",
        product: {
          attributes: {
            material: "Cotton Blend",
            pattern: "Solid",
            careInstructions: "Machine wash cold",
          },
          _id: "6861498e19589f3b28f64690",
          name: "Organic Cotton T-Shirt",
          slug: "organic-cotton-tshirt",
          description: "Comfortable and sustainable organic cotton t-shirt perfect for everyday wear",
          brand: "6860f93afa0d8ba6ba9a38a6",
          brandName: "EcoThread",
          category: "6861262a27e6d351f6007809",
          images: ["/placeholder.svg?height=400&width=300"],
          tags: ["organic", "sustainable", "cotton"],
          isActive: true,
          featured: false,
          createdAt: "2025-06-29T14:11:26.978Z",
          updatedAt: "2025-06-29T14:11:26.978Z",
          categoryPath: "Fashion/Clothing/T-Shirts",
          __v: 0,
          id: "6861498e19589f3b28f64690",
        },
        sku: "ECO-S-WHI",
        price: 1299,
        salePrice: 899,
        stock: 100,
        images: ["/placeholder.svg?height=400&width=300"],
        isDefault: false,
        isActive: true,
        createdAt: "2025-06-29T17:52:28.438Z",
        updatedAt: "2025-06-29T17:52:28.438Z",
        __v: 0,
      },
      quantity: 2,
      _id: "6862a100e9f1a824f3848b9b",
    },
    {
      variant: {
        attributes: {
          size: "M",
          color: "blue",
        },
        _id: "68617d5cd28e4aa9ffbd09c6",
        product: {
          attributes: {
            material: "Recycled Denim",
            pattern: "Solid",
            careInstructions: "Machine wash cold, hang dry",
          },
          _id: "6861498e19589f3b28f64691",
          name: "Sustainable Denim Jacket",
          slug: "sustainable-denim-jacket",
          description: "Stylish denim jacket made from 100% recycled materials",
          brand: "6860f93afa0d8ba6ba9a38a7",
          brandName: "GreenWear",
          category: "6861262a27e6d351f6007810",
          images: ["/placeholder.svg?height=400&width=300"],
          tags: ["denim", "recycled", "jacket"],
          isActive: true,
          featured: true,
          createdAt: "2025-06-29T14:11:26.978Z",
          updatedAt: "2025-06-29T14:11:26.978Z",
          categoryPath: "Fashion/Clothing/Jackets",
          __v: 0,
          id: "6861498e19589f3b28f64691",
        },
        sku: "GRN-M-BLU",
        price: 3499,
        salePrice: 2499,
        stock: 50,
        images: ["/placeholder.svg?height=400&width=300"],
        isDefault: true,
        isActive: true,
        createdAt: "2025-06-29T17:52:28.438Z",
        updatedAt: "2025-06-29T17:52:28.438Z",
        __v: 0,
      },
      quantity: 1,
      _id: "6862a100e9f1a824f3848b9c",
    },
  ],
  updatedAt: "2025-06-30T14:36:48.063Z",
  createdAt: "2025-06-30T14:32:53.594Z",
  __v: 1,
}

// Mock promo codes
const mockPromoCodes = {
  WELCOME10: {
    code: "WELCOME10",
    discount: 10,
    type: "percentage" as const,
    description: "Welcome discount - 10% off",
    minOrder: 500,
    maxDiscount: 1000,
  },
  SAVE500: {
    code: "SAVE500",
    discount: 500,
    type: "fixed" as const,
    description: "Flat ₹500 off",
    minOrder: 2000,
    maxDiscount: 500,
  },
  SUSTAINABLE20: {
    code: "SUSTAINABLE20",
    discount: 20,
    type: "percentage" as const,
    description: "Sustainable fashion - 20% off",
    minOrder: 1000,
    maxDiscount: 2000,
  },
  FIRSTBUY: {
    code: "FIRSTBUY",
    discount: 15,
    type: "percentage" as const,
    description: "First purchase - 15% off",
    minOrder: 800,
    maxDiscount: 1500,
  },
}

interface CartItem {
  variant: {
    attributes: {
      size: string
      color: string
    }
    _id: string
    product: {
      attributes: {
        material: string
        pattern: string
        careInstructions: string
      }
      _id: string
      name: string
      slug: string
      description: string
      brand: string
      brandName: string
      category: string
      images: string[]
      tags: string[]
      isActive: boolean
      featured: boolean
      createdAt: string
      updatedAt: string
      categoryPath: string
      __v: number
      id: string
    }
    sku: string
    price: number
    salePrice?: number
    stock: number
    images: string[]
    isDefault: boolean
    isActive: boolean
    createdAt: string
    updatedAt: string
    __v: number
  }
  quantity: number
  _id: string
}

interface CartData {
  _id: string
  user: string
  items: CartItem[]
  updatedAt: string
  createdAt: string
  __v: number
}

function CartPageContent() {
  const [cartData, setCartData] = useState<CartData>(mockCartData)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showCheckoutSummary, setShowCheckoutSummary] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const { cookieValue } = useCookieContext()
  const api=process.env.NEXT_PUBLIC_API_URL
  const rzpk=process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const [reload,setreload]=useState<Boolean>(false)
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string
    discount: number
    type: "percentage" | "fixed"
    description: string
  } | null>(null)
  const [userdata,setuserdata]=useState<any>()
  const [promoLoading, setPromoLoading] = useState(false)




  const [showAddressModal, setShowAddressModal] = useState(false)
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddress, setSelectedAddress] = useState<any>(null)
  const [addressLoading, setAddressLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const [reverseCoins, setReverseCoins] = useState(2500) // Mock user's available re-verse coins
  const [coinsToRedeem, setCoinsToRedeem] = useState(0)
  const [showCoinsSection, setShowCoinsSection] = useState(false)
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const fetchAddresses = async () => {
    setAddressLoading(true)
    try {
      const response = await fetch(`${api}/api/u/user/addresses`, {
        method: "GET",
        headers: {
          
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookieValue}`, // Add your auth token
        },
      })
      if (response.ok) {
        const data = await response.json()
        setAddresses(data)
        // Set default address if available
        const defaultAddr = data.find((addr: any) => addr.isDefault)
        if (defaultAddr) setSelectedAddress(defaultAddr)
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load addresses" })
    } finally {
      setAddressLoading(false)
    }
  }

  const handleCODOrder = async () => {
    if (!selectedAddress) {
      setMessage({ type: "error", text: "Please select an address" })
      return
    }

    setPaymentLoading(true)
    try {
      const response = await fetch(`${api}/api/order/cod`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookieValue}`,
        },
        body: JSON.stringify({
          addressId: selectedAddress._id,
          coinsToRedeem:coinsToRedeem
        }),
      })

      if (response.status===201) {
        setShowAddressModal(false)
        setShowPaymentModal(false)
        setShowSuccessModal(true)
      } else {
        setMessage({ type: "error", text: "Failed to place order" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to place order" })
    } finally {
      setPaymentLoading(false)
    }
  }

  const handlePrepaidOrder = async () => {
    if (!selectedAddress) {
      setMessage({ type: "error", text: "Please select an address" });
      return;
    }

    setPaymentLoading(true);
    try {
      const response = await fetch(`${api}/api/order/prepaid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookieValue}`,
        },
        body: JSON.stringify({
          addressId: selectedAddress?._id,
          coinsToRedeem: coinsToRedeem,
        }),
      });
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        const order = data; // Use parsed data here

        // Wait for Razorpay script to be loaded
        if (!(window as any).Razorpay) {
          setMessage({ type: "error", text: "Razorpay SDK not loaded" });
          return;
        }

        const options = {
          key: rzpk,
          amount: order.amount,
          currency: order.currency,
          name: "RE-VERSE",
          description: "Sustainable Fashion Purchase",
          order_id: order.id,
          handler: (response: any) => {
            setShowAddressModal(false);
            setShowPaymentModal(false);
            setShowSuccessModal(true);
          },
          prefill: {
            name: userdata?.name || "Customer",
            email: userdata?.email || "customer@example.com",
            contact: userdata?.phone,
          },
          theme: {
            color: "#4FC3F7",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        setMessage({ type: "error", text: "Failed to create payment order" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to create payment order" });
    } finally {
      setPaymentLoading(false);
    }
  };


  const proceedToPayment = () => {
    setShowCheckoutSummary(false)
    setShowAddressModal(true)
    fetchAddresses()
  }

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case "home":
        return "🏠"
      case "work":
        return "🏢"
      default:
        return "📍"
    }
  }






  const userProfile=async()=>{
    try{
      setLoading(true)
      if(!cookieValue){
        window.location.href='login'
      }
      const response = await fetch(`${api}/api/home/profile-summary`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookieValue}`,
          },
      });
      const data = await response.json();
      setuserdata(data)
      setReverseCoins(data?.reversePoints)


    }catch(err){
      console.log(err)
    }
    setLoading(false)
  }


  const fetchcart=async()=>{
   
    try{
        setLoading(true)
        const response = await fetch(`${api}/api/cart/`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${cookieValue}`
                }
        });
        const data = await response.json();
        setCartData(data);

    }catch(err){
        console.log(err)

    }finally{
        setLoading(false)
    }
    

}
  useEffect(()=>{
fetchcart()
userProfile()
  },[cookieValue,reload])

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setLoading(true)
    try {
      // Simulate API call
    //   await new Promise((resolve) => setTimeout(resolve, 500))

    //   setCartData((prev) => ({
    //     ...prev,
    //     items: prev.items.map((item) => (item._id === itemId ? { ...item, quantity: newQuantity } : item)),
    //     updatedAt: new Date().toISOString(),
    //   }))

    try{
        const response = await fetch(`${api}/api/cart/update/${itemId}`,{
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookieValue}`,
            },
            body: JSON.stringify({quantity:newQuantity})

        })
        if(response.status===201){
          setreload((prev)=>!(prev))
          setMessage({ type: "success", text: "Quantity updated successfully!" })
      setTimeout(() => setMessage(null), 2000)
        }
        else{
          setMessage({ type: "error", text: "Failed to update quantity. Please try again." })
          setTimeout(() => setMessage(null), 3000)
        }


      }catch(err){
        setMessage({ type: "error", text: "Failed to update quantity. Please try again." })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update quantity. Please try again." })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (itemId: string) => {
    setLoading(true)
    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 500))

      // setCartData((prev) => ({
      //   ...prev,
      //   items: prev.items.filter((item) => item._id !== itemId),
      //   updatedAt: new Date().toISOString(),
      // }))


      try{
        const response = await fetch(`${api}/api/cart/remove/${itemId}`,{
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookieValue}`,
            },

        })
        if(response.ok){
          setreload((prev)=>!(prev))
          setMessage({ type: "success", text: "Item removed from cart!" })
      setTimeout(() => setMessage(null), 2000)
        }
        else{
          setMessage({ type: "error", text: "Failed to update quantity. Please try again." })
        setTimeout(() => setMessage(null), 3000)
        }


      }catch(err){
        setMessage({ type: "error", text: "Failed to update quantity. Please try again." })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to remove item. Please try again." })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      setMessage({ type: "error", text: "Please enter a promo code" })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setPromoLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const promo = mockPromoCodes[promoCode.toUpperCase() as keyof typeof mockPromoCodes]

      if (!promo) {
        setMessage({ type: "error", text: "Invalid promo code" })
        setTimeout(() => setMessage(null), 3000)
        setPromoLoading(false)
        return
      }

      if (subtotal < promo.minOrder) {
        setMessage({
          type: "error",
          text: `Minimum order of ₹${promo.minOrder} required for this promo code`,
        })
        setTimeout(() => setMessage(null), 3000)
        setPromoLoading(false)
        return
      }

      setAppliedPromo(promo)
      setMessage({ type: "success", text: `Promo code applied! ${promo.description}` })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to apply promo code. Please try again." })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setPromoLoading(false)
    }
  }

  const removePromoCode = () => {
    setAppliedPromo(null)
    setPromoCode("")
    setMessage({ type: "success", text: "Promo code removed" })
    setTimeout(() => setMessage(null), 2000)
  }

  const calculateItemTotal = (item: CartItem) => {
    const price = item.variant.salePrice || item.variant.price
    return price * item.quantity
  }

  const calculateSubtotal = () => {
    return cartData?.items?.reduce((total, item) => total + calculateItemTotal(item), 0)
  }

  const calculateSavings = () => {
    return cartData?.items?.reduce((total, item) => {
      if (item.variant.salePrice) {
        const savings = (item.variant.price - item.variant.salePrice) * item.quantity
        return total + savings
      }
      return total
    }, 0)
  }

  const calculatePromoDiscount = () => {
    if (!appliedPromo) return 0

    if (appliedPromo.type === "percentage") {
      const discount = Math.round((subtotal * appliedPromo.discount) / 100)
      return Math.min(discount, appliedPromo.discount || discount)
    } else {
      return appliedPromo.discount
    }

  }

  const calculateMaxRedeemableCoins = () => {
    const maxRedeemableAmount = Math.floor(total * 0.2) // 20% of total
    const maxCoinsFromAmount = maxRedeemableAmount * 10 // 1 rupee = 10 coins
    return Math.min(reverseCoins, maxCoinsFromAmount)
  }

  const calculateCoinsDiscount = () => {
    return Math.floor(coinsToRedeem * 0.1) // 1 coin = 0.1 rupee
  }

  const handleCoinsRedemption = () => {
    if (coinsToRedeem > calculateMaxRedeemableCoins()) {
      setMessage({ type: "error", text: `Maximum ${calculateMaxRedeemableCoins()} coins can be redeemed` })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    setMessage({ type: "success", text: `${coinsToRedeem} Re-verse coins applied!` })
    setTimeout(() => setMessage(null), 3000)
  }

  const removeCoinsRedemption = () => {
    setCoinsToRedeem(0)
    setMessage({ type: "success", text: "Re-verse coins removed" })
    setTimeout(() => setMessage(null), 2000)
  }

  const shippingCost = 0 // Free shipping
  const taxRate = 0 // 18% GST
  const subtotal = calculateSubtotal()
  const savings = calculateSavings()
  const promoDiscount = calculatePromoDiscount()
  const coinsDiscount = calculateCoinsDiscount()
  const discountedSubtotal = subtotal - promoDiscount - coinsDiscount
  const tax = Math.round(discountedSubtotal * taxRate)
  const total = discountedSubtotal + shippingCost + tax



  if(loading){
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
        <Spinner />
      </div>
    )
  }
  if (cartData?.items?.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] to-white">
        <Navbar isLoggedIn={cookieValue?true:false} variant="floating" userdata={userdata} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#455A64] mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Looks like you haven't added any sustainable fashion items yet.
            </p>
            <Link href="/">
              <Button className="bg-[#4FC3F7] hover:bg-[#33BF69] text-white px-8 py-3 rounded-full text-lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] to-white">
      <Navbar isLoggedIn={true} variant="floating" userdata={userdata} />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#455A64] hover:text-[#4FC3F7] transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#455A64]">Shopping Cart</h1>
              <p className="text-gray-600">{cartData?.items?.length} items in your cart</p>
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
            <AlertCircle className={`h-4 w-4 ${message.type === "success" ? "text-[#33BF69]" : "text-red-500"}`} />
            <AlertDescription className={message.type === "success" ? "text-[#33BF69]" : "text-red-500"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartData?.items?.map((item) => (
              // <Link href={`/product/${item.variant.product._id}`}>
              <Card key={item._id} className="shadow-lg border-0 rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                    <Link href={`/product/${item.variant.product._id}`}>
                      <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-[#F2F2F2] to-white">
                        <Image
                          src={item.variant.product.images[0] || "/placeholder.svg"}
                          alt={item.variant.product.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      </Link>
                    </div>
                    

                    {/* Product Details */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-[#455A64]">{item.variant.product.name}</h3>
                            {item.variant.product.featured && (
                              <Badge className="bg-[#FF6F61] text-white text-xs">Featured</Badge>
                            )}
                          </div>
                          <p className="text-gray-600">{item.variant.product.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium text-[#4FC3F7]">{item.variant.product.brandName}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-600">{item.variant.product.categoryPath}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.variant._id)}
                          className="text-red-500 hover:bg-red-50 p-2"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Variant Details */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Size:</span>
                          <Badge variant="outline" className="text-[#455A64] border-[#4FC3F7]">
                            {item.variant.attributes.size}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Color:</span>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: item.variant.attributes.color }}
                            />
                            <span className="text-sm font-medium text-[#455A64] capitalize">
                              {item.variant.attributes.color}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">SKU:</span>
                          <span className="text-sm font-mono text-[#455A64]">{item.variant.sku}</span>
                        </div>
                      </div>

                      {/* Product Attributes */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Material:</span>
                          <span className="ml-2 font-medium text-[#455A64]">
                            {item.variant.product.attributes.material || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Pattern:</span>
                          <span className="ml-2 font-medium text-[#455A64]">
                            {item.variant.product.attributes.pattern || 'N/A'}
                          </span>
                        </div>
                        {/* <div>
                          <span className="text-gray-600">Stock:</span>
                          <span className="ml-2 font-medium text-[#33BF69]">{item.variant.stock} available</span>
                        </div> */}
                      </div>

                      <Separator />

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-[#455A64]">
                              ₹{item.variant.salePrice || item.variant.price}
                            </span>
                            {item.variant.salePrice && (
                              <span className="text-sm text-gray-500 line-through">₹{item.variant.price}</span>
                            )}
                          </div>
                          {item.variant.salePrice && (
                            <Badge className="bg-[#33BF69] text-white text-xs">
                              {Math.round(((item.variant.price - item.variant.salePrice) / item.variant.price) * 100)}%
                              OFF
                            </Badge>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.variant._id, item.quantity - 1)}
                            disabled={loading || item.quantity <= 1}
                            className="w-8 h-8 p-0 rounded-full border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-semibold text-[#455A64]">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.variant._id, item.quantity + 1)}
                            disabled={loading || item.quantity >= item.variant.stock}
                            className="w-8 h-8 p-0 rounded-full border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="text-sm text-gray-600">Item Total:</span>
                        <span className="text-lg font-bold text-[#33BF69]">
                          ₹{calculateItemTotal(item).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              // </Link>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 rounded-3xl sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl text-[#455A64] flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cartData?.items?.length} items)</span>
                    <span className="font-semibold text-[#455A64]">₹{subtotal?.toLocaleString()}</span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between text-[#33BF69]">
                      <span>You Save</span>
                      <span className="font-semibold">-₹{savings?.toLocaleString()}</span>
                    </div>
                  )}

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-[#33BF69]">
                      <span>Promo Discount ({appliedPromo?.code})</span>
                      <span className="font-semibold">-₹{promoDiscount?.toLocaleString()}</span>
                    </div>
                  )}

                  {coinsDiscount > 0 && (
                    <div className="flex justify-between text-[#4FC3F7]">
                      <span>Re-verse Coins ({coinsToRedeem} coins)</span>
                      <span className="font-semibold">-₹{coinsDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-[#33BF69]">FREE</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (GST 18%)</span>
                    <span className="font-semibold text-[#455A64]">₹{tax?.toLocaleString()}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-[#455A64]">Total</span>
                    <span className="font-bold text-[#33BF69]">₹{total?.toLocaleString()}</span>
                  </div>

                  {(savings > 0 || promoDiscount > 0 || coinsDiscount > 0) && (
                    <div className="text-center">
                      <span className="text-sm text-[#33BF69] font-medium">
                        Total Savings: ₹{(savings + promoDiscount + coinsDiscount).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Promo Code Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-[#FF6F61]" />
                    <span className="font-medium text-[#455A64]">Promo Code</span>
                  </div>

                  {!appliedPromo ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="Enter promo code"
                          className="flex-1 border-[#4FC3F7]/30 focus:border-[#4FC3F7] rounded-xl"
                          onKeyPress={(e) => e.key === "Enter" && applyPromoCode()}
                        />
                        <Button
                          onClick={applyPromoCode}
                          disabled={promoLoading || !promoCode.trim()}
                          className="bg-[#4FC3F7] hover:bg-[#33BF69] text-white px-4 rounded-xl"
                        >
                          {promoLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            "Apply"
                          )}
                        </Button>
                      </div>

                      {/* Suggested Promo Codes */}
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500">Try these codes:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(mockPromoCodes)
                            .slice(0, 2)
                            .map((code) => (
                              <button
                                key={code}
                                onClick={() => setPromoCode(code)}
                                className="text-xs bg-[#4FC3F7]/10 text-[#4FC3F7] px-2 py-1 rounded-lg hover:bg-[#4FC3F7]/20 transition-colors"
                              >
                                {code}
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gradient-to-r from-[#33BF69]/10 to-[#4FC3F7]/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#33BF69]">{appliedPromo.code}</span>
                            <Badge className="bg-[#33BF69] text-white text-xs">Applied</Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{appliedPromo.description}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={removePromoCode}
                          className="text-red-500 hover:bg-red-50 p-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />


                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-[#4FC3F7] to-[#33BF69] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">₹</span>
                    </div>
                    <span className="font-medium text-[#455A64]">Re-verse Coins</span>
                    <Badge className="bg-[#4FC3F7]/10 text-[#4FC3F7] text-xs">{reverseCoins} available</Badge>
                  </div>

                  {coinsToRedeem === 0 ? (
                    <div className="space-y-3">
                      <Button
                        onClick={() => setShowCoinsSection(!showCoinsSection)}
                        variant="outline"
                        className="w-full border-[#4FC3F7]/30 text-[#4FC3F7] hover:bg-[#4FC3F7]/10 rounded-xl"
                      >
                        {showCoinsSection ? "Hide" : "Use"} Re-verse Coins
                      </Button>

                      {showCoinsSection && (
                        <div className="space-y-3 p-4 bg-gradient-to-r from-[#4FC3F7]/5 to-[#33BF69]/5 rounded-xl">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Available Coins:</span>
                              <span className="font-semibold text-[#4FC3F7]">{reverseCoins}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Max Redeemable:</span>
                              <span className="font-semibold text-[#33BF69]">{calculateMaxRedeemableCoins()}</span>
                            </div>
                            <div className="text-xs text-gray-500">1 Re-verse Coin = ₹0.10 • Max 20% of cart value</div>
                          </div>

                          <div className="flex gap-2">
                            <Input
                              type="number"
                              value={coinsToRedeem}
                              onChange={(e) => setCoinsToRedeem(Math.max(0, Number.parseInt(e.target.value) || 0))}
                              placeholder="Enter coins to redeem"
                              max={calculateMaxRedeemableCoins()}
                              className="flex-1 border-[#4FC3F7]/30 focus:border-[#4FC3F7] rounded-xl"
                            />
                            <Button
                              onClick={handleCoinsRedemption}
                              disabled={coinsToRedeem <= 0 || coinsToRedeem > calculateMaxRedeemableCoins()}
                              className="bg-[#4FC3F7] hover:bg-[#33BF69] text-white px-4 rounded-xl"
                            >
                              Apply
                            </Button>
                          </div>

                          {/* Quick select buttons */}
                          <div className="flex gap-2">
                            {[25, 50, 100].map((percentage) => {
                              const coins = Math.floor((calculateMaxRedeemableCoins() * percentage) / 100)
                              if (coins > 0) {
                                return (
                                  <button
                                    key={percentage}
                                    onClick={() => setCoinsToRedeem(coins)}
                                    className="text-xs bg-[#4FC3F7]/10 text-[#4FC3F7] px-3 py-1 rounded-lg hover:bg-[#4FC3F7]/20 transition-colors"
                                  >
                                    {percentage}% ({coins})
                                  </button>
                                )
                              }
                              return null
                            })}
                            <button
                              onClick={() => setCoinsToRedeem(calculateMaxRedeemableCoins())}
                              className="text-xs bg-[#33BF69]/10 text-[#33BF69] px-3 py-1 rounded-lg hover:bg-[#33BF69]/20 transition-colors"
                            >
                              Max ({calculateMaxRedeemableCoins()})
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-gradient-to-r from-[#4FC3F7]/10 to-[#33BF69]/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#4FC3F7]">{coinsToRedeem} Coins</span>
                            <Badge className="bg-[#33BF69] text-white text-xs">Applied</Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            Saving ₹{calculateCoinsDiscount()} with Re-verse Coins
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={removeCoinsRedemption}
                          className="text-red-500 hover:bg-red-50 p-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <Separator />

                {/* Benefits */}
                <div className="space-y-3 p-4 bg-gradient-to-r from-[#4FC3F7]/5 to-[#33BF69]/5 rounded-2xl">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-[#4FC3F7]" />
                    <span className="text-[#455A64]">Free shipping on all orders</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-[#33BF69]" />
                    <span className="text-[#455A64]">Secure payment & 30-day returns</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4 text-[#FF6F61]" />
                    <span className="text-[#455A64]">Earn {Math.floor(total / 10)} Re-verse Coins</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowCheckoutSummary(true)}
                    className="w-full bg-[#33BF69] hover:bg-[#4FC3F7] text-white py-3 rounded-2xl text-lg font-semibold"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="w-full border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white py-3 rounded-2xl bg-transparent"
                      size="lg"
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Checkout Summary Modal */}
      {showCheckoutSummary && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-[#455A64]">Order Summary</h3>
                <Button size="sm" variant="ghost" onClick={() => setShowCheckoutSummary(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Items Summary */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#455A64] text-lg">Items ({cartData?.items?.length})</h4>
                {cartData?.items?.map((item) => (
                  
                 
                    <div key={item._id} className="flex items-center gap-4 p-4 bg-[#F2F2F2]/30 rounded-xl">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white">
                      <Image
                        src={item.variant.product.images[0] || "/placeholder.svg"}
                        alt={item.variant.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-[#455A64]">{item.variant.product.name}</h5>
                      <p className="text-sm text-gray-600">
                        {item.variant.attributes.size} • {item.variant.attributes.color} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#455A64]">₹{calculateItemTotal(item).toLocaleString()}</p>
                    </div>
                  </div>
                
                ))}
              </div>

              <Separator />

              {/* Price Summary in Modal */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-[#33BF69]">
                    <span>Savings</span>
                    <span className="font-semibold">-₹{savings.toLocaleString()}</span>
                  </div>
                )}
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#33BF69]">
                    <span>Promo Discount ({appliedPromo?.code})</span>
                    <span className="font-semibold">-₹{promoDiscount.toLocaleString()}</span>
                  </div>
                )}

{coinsDiscount > 0 && (
                    <div className="flex justify-between text-[#4FC3F7]">
                      <span>Re-verse Coins ({coinsToRedeem} coins)</span>
                      <span className="font-semibold">-₹{coinsDiscount.toLocaleString()}</span>
                    </div>
                  )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-[#33BF69]">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span className="font-semibold">₹{tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl">
                  <span className="font-bold text-[#455A64]">Total</span>
                  <span className="font-bold text-[#33BF69]">₹{total.toLocaleString()}</span>
                </div>
                {(savings > 0 || promoDiscount > 0) && (
                  <div className="text-center">
                    <span className="text-sm text-[#33BF69] font-medium">
                      You saved ₹{(savings + promoDiscount).toLocaleString()} on this order!
                    </span>
                  </div>
                )}
              </div>

              {/* Sustainability Impact */}
              <div className="p-4 bg-gradient-to-r from-[#33BF69]/10 to-[#4FC3F7]/10 rounded-xl">
                <h5 className="font-semibold text-[#455A64] mb-2">🌱 Your Sustainability Impact</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">CO₂ Saved:</span>
                    <span className="ml-2 font-semibold text-[#33BF69]">2.5 kg</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Water Saved:</span>
                    <span className="ml-2 font-semibold text-[#4FC3F7]">150 L</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <Button
                onClick={() => setShowCheckoutSummary(false)}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
              >
                Back to Cart
              </Button>
              <Button
                    onClick={proceedToPayment}
                    className="w-full bg-[#33BF69] hover:bg-[#4FC3F7] text-white py-3 rounded-2xl text-lg font-semibold"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>
            </div>
          </div>
        </div>
      )}



{showAddressModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-[#455A64]">Select Delivery Address</h3>
                <Button size="sm" variant="ghost" onClick={() => setShowAddressModal(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-gray-600 mt-2">Choose where you want your sustainable fashion delivered</p>
            </div>

            <div className="p-6">
              {addressLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-[#4FC3F7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading addresses...</p>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                  <h4 className="text-xl font-semibold text-gray-600 mb-2">No addresses found</h4>
                  <p className="text-gray-500 mb-6">Please add an address to continue with your order</p>
                  <Button
                    onClick={() => {
                      setShowAddressModal(false)
                      // Navigate to profile page to add address
                      window.location.href = "/my-profile"
                    }}
                    className="bg-[#4FC3F7] hover:bg-[#33BF69] text-white px-6 py-3 rounded-2xl"
                  >
                    Add Address
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedAddress?._id === address._id
                          ? "border-[#4FC3F7] bg-[#4FC3F7]/5"
                          : "border-gray-200 hover:border-[#4FC3F7]/50"
                      }`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{getAddressTypeIcon(address.addressType)}</span>
                            <span className="font-semibold text-[#455A64] text-lg capitalize">
                              {address.addressType}
                            </span>
                            {address.isDefault && <Badge className="bg-[#33BF69] text-white text-sm">Default</Badge>}
                          </div>
                          <div className="text-gray-600 space-y-1 leading-relaxed">
                            <p className="font-medium text-[#455A64]">{address.addressline}</p>
                            {address.locality && <p>{address.locality}</p>}
                            <p>
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                            {address.landmark && <p>Landmark: {address.landmark}</p>}
                            <p>Phone: {address.phone}</p>
                            {address.alternatePhone && <p>Alt Phone: {address.alternatePhone}</p>}
                          </div>
                        </div>
                        <div className="ml-4">
                          {selectedAddress?._id === address._id && (
                            <div className="w-6 h-6 bg-[#4FC3F7] rounded-full flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {addresses.length > 0 && (
              <div className="p-6 border-t border-gray-200">
                <Button
                  onClick={() => {
                    if (selectedAddress) {
                      setShowAddressModal(false)
                      setShowPaymentModal(true)
                    } else {
                      setMessage({ type: "error", text: "Please select an address" })
                      setTimeout(() => setMessage(null), 3000)
                    }
                  }}
                  disabled={!selectedAddress}
                  className="w-full bg-[#33BF69] hover:bg-[#4FC3F7] text-white py-3 rounded-2xl text-lg font-semibold"
                >
                  Continue to Payment
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
      {/* Modal Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl sm:text-2xl font-bold text-[#455A64]">Choose Payment Method</h3>
          <Button size="sm" variant="ghost" onClick={() => setShowPaymentModal(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Select how you'd like to pay for your order
        </p>
      </div>

      {/* Modal Body */}
      <div className="p-4 sm:p-6 space-y-6 flex-1">
        {/* Selected Address Summary */}
        {selectedAddress && (
          <div className="p-4 bg-[#F2F2F2]/50 rounded-2xl">
            <h4 className="font-semibold text-[#455A64] mb-2">Delivering to:</h4>
            <div className="text-sm text-gray-600">
              <p className="font-medium">{selectedAddress.addressline}</p>
              <p>
                {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
              </p>
              <p>Phone: {selectedAddress.phone}</p>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="p-4 bg-gradient-to-r from-[#4FC3F7]/5 to-[#33BF69]/5 rounded-2xl">
          <h4 className="font-semibold text-[#455A64] mb-3">Order Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal ({cartData.items.length} items)</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-[#33BF69]">
                <span>Discount</span>
                <span>-₹{promoDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-[#33BF69]">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (GST)</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-[#33BF69]">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-4">
          <h4 className="font-semibold text-[#455A64]">Payment Options</h4>

          {/* Cash on Delivery */}
          <div className="p-4 border-2 border-gray-200 rounded-2xl hover:border-[#4FC3F7]/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FF6F61]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💵</span>
                </div>
                <div>
                  <h5 className="font-semibold text-[#455A64]">Cash on Delivery</h5>
                  <p className="text-sm text-gray-600">Pay when your order arrives</p>
                </div>
              </div>
              <Button
                onClick={handleCODOrder}
                disabled={paymentLoading}
                className="bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white px-6 py-2 rounded-xl"
              >
                {paymentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Choose COD"}
              </Button>
            </div>
          </div>

          {/* Online Payment */}
          <div className="p-4 border-2 border-gray-200 rounded-2xl hover:border-[#4FC3F7]/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#4FC3F7]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💳</span>
                </div>
                <div>
                  <h5 className="font-semibold text-[#455A64]">Pay Online</h5>
                  <p className="text-sm text-gray-600">UPI, Cards, Net Banking & Wallets</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs text-[#33BF69] border-[#33BF69]">
                      Extra 2% Re-verse Coins
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                onClick={handlePrepaidOrder}
                disabled={paymentLoading}
                className="bg-[#4FC3F7] hover:bg-[#33BF69] text-white px-6 py-2 rounded-xl"
              >
                {paymentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pay Now"}
              </Button>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="flex items-center gap-3 p-4 bg-[#33BF69]/5 rounded-2xl">
          <Shield className="h-5 w-5 text-[#33BF69]" />
          <div className="text-sm">
            <p className="font-medium text-[#455A64]">Secure Payment</p>
            <p className="text-gray-600">Your payment information is encrypted and secure</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl text-center">
            <div className="p-8">
              <div className="w-20 h-20 bg-gradient-to-r from-[#33BF69] to-[#4FC3F7] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-white" />
              </div>

              <h3 className="text-3xl font-bold text-[#455A64] mb-4">Thank You for Choosing RE-VERSE! 🌱</h3>

              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Your order has been placed successfully! By choosing sustainable fashion, you're helping create a better
                future for our planet. Every purchase makes a difference.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-[#33BF69]/5 rounded-2xl">
                  <div className="text-2xl mb-2">🌍</div>
                  <h4 className="font-semibold text-[#455A64] mb-1">Planet Impact</h4>
                  <p className="text-sm text-gray-600">2.5kg CO₂ saved</p>
                </div>
                <div className="p-4 bg-[#4FC3F7]/5 rounded-2xl">
                  <div className="text-2xl mb-2">💧</div>
                  <h4 className="font-semibold text-[#455A64] mb-1">Water Saved</h4>
                  <p className="text-sm text-gray-600">150 liters conserved</p>
                </div>
                <div className="p-4 bg-[#FF6F61]/5 rounded-2xl">
                  <div className="text-2xl mb-2">🪙</div>
                  <h4 className="font-semibold text-[#455A64] mb-1">Re-verse Coins</h4>
                  <p className="text-sm text-gray-600">{Math.floor(total / 10)} coins earned</p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-[#4FC3F7]/10 to-[#33BF69]/10 rounded-2xl mb-6">
                <h4 className="font-semibold text-[#455A64] mb-2">🎉 Your Re-verse Coins are on the way!</h4>
                <p className="text-sm text-gray-600">
                  Once your order is completed, <strong>{Math.floor(total / 10)} Re-verse Coins</strong> will be
                  credited to your account. Use them for future sustainable purchases!
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setShowSuccessModal(false)
                    window.location.href = "/orders"
                  }}
                  variant="outline"
                  className="flex-1 border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white py-3 rounded-2xl bg-transparent"
                >
                  Track Order
                </Button>
                <Button
                  onClick={() => {
                    setShowSuccessModal(false)
                    window.location.href = "/"
                  }}
                  className="flex-1 bg-[#33BF69] hover:bg-[#4FC3F7] text-white py-3 rounded-2xl"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#4FC3F7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#455A64] font-medium">Loading your cart...</p>
          </div>
        </div>
      }
    >
      <CartPageContent />
    </Suspense>
  )
}
