"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Package,
  Star,
  Weight,
  Hash,
  Camera,
  Calendar,
  MapPin,
  Plus,
  Home,
  Building,
  CheckCircle,
  Clock,
  Truck,
  X,
  Upload,
  Coins,
  IndianRupee,
  Leaf,
  Recycle,
  Heart,
  Eye,
  AlertCircle,
  Ban,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import Navbar from "@/components/navbar"
import { useCookieContext } from "@/context/cookieContext"
import { useDayRender } from "react-day-picker"


// Mock data for serviceable cities
const serviceableCities = [
  { pincode: "380001", city: "Ahmedabad", state: "Gujarat" },
  
]

// Mock user addresses
const mockAddresses = [
  {
    id: 1,
    addressType: "home",
    addressline: "123 Green Street, Apartment 4B",
    locality: "Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    landmark: "Near Central Park",
    phone: "9876543210",
    alternatePhone: "",
    isDefault: true,
  },
  {
    id: 2,
    addressType: "work",
    addressline: "456 Business District, Floor 12, Tower A",
    locality: "BKC",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400051",
    landmark: "Opposite Metro Station",
    phone: "9876543210",
    alternatePhone: "",
    isDefault: false,
  },
]

// Mock previous sell requests
const mockSellRequests = [
  {
    id: 1,
    no_of_items: "15-20",
    weightInKg: 5,
    description: "Mix of cotton t-shirts, jeans, and casual wear in good condition",
    description_image: "/placeholder.svg?height=200&width=300",
    totalPayout: 250,
    reversePoints: 50,
    scheduledPickupDate: "2024-01-20",
    actualPickupDate: "2024-01-21",
    status: "completed",
    payout_image: "/placeholder.svg?height=200&width=300",
    createdAt: "2024-01-15",
    pickupAddress: mockAddresses[0],
  },
  {
    id: 2,
    no_of_items: "10-15",
    weightInKg: 3,
    description: "Formal shirts and trousers, some with minor wear",
    description_image: "/placeholder.svg?height=200&width=300",
    totalPayout: 180,
    reversePoints: 36,
    scheduledPickupDate: "2024-01-25",
    actualPickupDate: null,
    status: "processed",
    payout_image: null,
    createdAt: "2024-01-18",
    pickupAddress: mockAddresses[1],
  },
  {
    id: 3,
    no_of_items: "5-10",
    weightInKg: 2,
    description: "Winter jackets and sweaters",
    description_image: "/placeholder.svg?height=200&width=300",
    totalPayout: 120,
    reversePoints: 24,
    scheduledPickupDate: "2024-01-28",
    actualPickupDate: null,
    status: "requested",
    payout_image: null,
    createdAt: "2024-01-22",
    pickupAddress: mockAddresses[0],
  },
]

const weightOptions = [
  { value: 1, label: "1 kg", description: "Light items like t-shirts, undergarments" },
  { value: 2, label: "2 kg", description: "Mix of light and medium items" },
  { value: 3, label: "3 kg", description: "Jeans, shirts, light jackets" },
  { value: 5, label: "5 kg", description: "Full wardrobe cleanout" },
  { value: 8, label: "8 kg", description: "Heavy items like coats, boots" },
  { value: 10, label: "10 kg", description: "Large collection" },
  { value: 15, label: "15+ kg", description: "Bulk wardrobe clearance" },
]

const itemOptions = [
  { value: "5-10", label: "5-10 items", description: "Small collection" },
  { value: "10-15", label: "10-15 items", description: "Medium collection" },
  { value: "15-20", label: "15-20 items", description: "Large collection" },
  { value: "20-30", label: "20-30 items", description: "Very large collection" },
  { value: "30+", label: "30+ items", description: "Bulk clearance" },
]

export default function SellPage() {
  const [activeTab, setActiveTab] = useState<"sell" | "history">("sell")
  const [sellOption, setSellOption] = useState<"bulk" | "premium" | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
const [pincodes,setpincodes]=useState<any>([])
const [img,setimg]=useState<File|null>(null)
  // Pincode check
  const [pincode, setPincode] = useState("")
  const [isServiceable, setIsServiceable] = useState<boolean | null>(null)
  const [serviceableCity, setServiceableCity] = useState<any>(null)

  // Form data
  const [formData, setFormData] = useState({
    weightInKg: 0,
    no_of_items: "",
    description: "",
    description_image: "",
    scheduledPickupDate: "",
    pickupAddress: null as any,
  })

  // UI states
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [addresses, setAddresses] = useState<any>()
  const [sellRequests, setSellRequests] = useState<any>([])
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showRequestDetails, setShowRequestDetails] = useState(false)
  const api=process.env.NEXT_PUBLIC_API_URL
  const [userdata,setuserdata]=useState<any>()
const { cookieValue } = useCookieContext()
const [reload,setreload]=useState<Boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  useEffect(()=>{
    fetchsellreq()
    userProfile()
    addr()
    fetpin()
    
  },[cookieValue,reload])
  const fetchsellreq=async()=>{
   try{
    const res=await fetch(`${api}/api/sellreq/getallsell`,{
      method:"GET",
      headers:{
        "Content-Type":"application/json",
      }
    });
    const data=await res.json()
    console.log(data)
    setSellRequests(data)

   }catch(err){
    console.log(err)
   }

  }
const fetpin=async()=>{
  try{
    setLoading(true)
    const response = await fetch(`${api}/api/pin/pincode`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookieValue}`,
        },
    });
    const data = await response.json();
    console.log(data)
    setpincodes(data)

  }catch(err){
    console.log(err)

  }
}
  const userProfile=async()=>{
    try{
      setLoading(true)
      if(!cookieValue){
        window.location.href='/login'
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
  
  
    }catch(err){
      console.log(err)
    }
    setLoading(false)
  }
  const addr=async()=>{
    try{
      setLoading(true)
      const response = await fetch(`${api}/api/u/user/addresses`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookieValue}`,
          },
      });
      const data = await response.json();
      console.log(data)
      setAddresses(data)

    }catch(err){
      console.log(err)

    }
  }
  
  const [newAddress, setNewAddress] = useState({
    addressType: "home",
    addressline: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    phone: "",
    alternatePhone: "",
    isDefault: false,
  })

  const checkServiceability = async () => {
    if (pincode.length !== 6) return

    setLoading(true)
    try {
      // await new Promise((resolve) => setTimeout(resolve, 1000))
const response = await fetch(`${api}/api/pin/pincode/check/${pincode}`,{
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }


});





const data = await response.json()
      const city = serviceableCities.find((city) => city.pincode === pincode)
      if (data.serviceable) {
        setIsServiceable(true)
        setServiceableCity(data?.city?data?.city:'N/A')
        setCurrentStep(2)
      } else {
        setIsServiceable(false)
        setServiceableCity(null)
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to check serviceability" })
    } finally {
      setLoading(false)
    }
  }
  const deletefroms3=async(link:any)=>{
    const certlink = link; // Assuming the certification object has a 'link' property
      const fileName = certlink.split('/').pop(); // Extract the filename
    
      if (!fileName) {
        console.log("Invalid file link:", certlink);
        
        return;
      }
    
      try {
        const response = await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName }),
        });
    
        if (!response.ok) {
          const errorText = await response.text();
          console.error("File deletion failed:", errorText);
          return;
        }
    
        console.log("File deleted successfully");
    
      
      } catch (error) {
        console.error("Error deleting file:", error);
      }
  
  }



  const uploadToS3 = async (img: File) => {
    try {
      const imageName = crypto.randomUUID();
      const fileExtension = img.name.split('.').pop();
      const fileType = img.type;
      // Get signed URL
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: `${imageName}.${fileExtension}`,
          fileType: fileType,
        }),
      });
      const { uploadUrl } = await response.json();
      // Upload to S3
      const uploaded = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": fileType },
        body: img,
      });
      if (!uploaded.ok) {
        const errorText = await uploaded.text();
        throw new Error(`Upload failed: ${errorText}`);
      }
      // Return CloudFront or S3 public URL
      return `https://d2sjih5al474yu.cloudfront.net/${imageName}.${fileExtension}`;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setimg(file)
  
      setFormData((prev) => ({
        ...prev,
        description_image: objectUrl, // Use objectUrl directly
      }));
    }
  };
  
  
  

  const getMinDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 3)
    return date.toISOString().split("T")[0]
  }

  const getMaxDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 8)
    return date.toISOString().split("T")[0]
  }

  const calculateEstimate = () => {
    const baseRate = 15 // ₹50 per kg
    const totalPayout = formData.weightInKg * baseRate
    const reversePoints = Math.floor(totalPayout * 2) // 20% as points
    return { totalPayout, reversePoints }
  }

  const submitSellRequest = async () => {
    setLoading(true);
    try {
      let updatedFormData = { ...formData };
      let url;
      // If an image is selected, upload it and update formData with the URL
      if (img) {
         url = await uploadToS3(img);
        if (url) {
          updatedFormData.description_image = url;
        }
        setimg(null);
      }
  
      // Optional: Validate required fields here before submitting
  
      // Send the request to the backend
      const response = await fetch(`${api}/api/sellreq/createsell/${cookieValue}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({form:updatedFormData,img:url}),
      });
  
      if (response.ok) {
        setMessage({ type: "success", text: "Sell request created successfully" });
        setTimeout(() => setMessage(null), 3000);
        setreload((prev)=>!prev)
        setShowConfirmation(true);
  
        // Reset form and related states
        setFormData({
          weightInKg: 0,
          no_of_items: "",
          description: "",
          description_image: "",
          scheduledPickupDate: "",
          pickupAddress: null,
        });
        setCurrentStep(1);
        setSellOption(null);
        setPincode("");
        setIsServiceable(null);
      } else {
        // Optionally, parse and show backend error message
        const errorData = await response.json().catch(() => ({}));
        setMessage({ type: "error", text: errorData.message || "Failed to submit request" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to submit request" });
    } finally {
      setLoading(false);
    }
  };
  

  const cancelRequest = async (requestId: number) => {
    if (!confirm("Are you sure you want to cancel this request?")) return

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSellRequests((prev:any) => prev.map((req:any) => (req?.id === requestId ? { ...req, status: "cancelled" } : req)))
      setMessage({ type: "success", text: "Request cancelled successfully" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to cancel request" })
    } finally {
      setLoading(false)
    }
  }

  const addNewAddress = async () => {
    // if (!serviceableCities.find((city) => city.pincode === newAddress.pincode)) {
    //   setMessage({ type: "error", text: "This pincode is not serviceable" })
    //   return
    // }

    setLoading(true)
    try {
      // await new Promise((resolve) => setTimeout(resolve, 1000))

      // const address = {
      //   ...newAddress,
      //   id: Date.now(),
      // }



      const response = await fetch(`${api}/api/u/user/addresses`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookieValue}`,
          },
          body: JSON.stringify(newAddress)

      })
      const data=await response.json()
      if(response.status===201){
        

        setMessage({ type: "success", text: "Address added successfully!" })
      }
      else{
        alert("Failed to add address")
      }

      setAddresses((prev:any) => [...prev, data])
      // setFormData((prev) => ({ ...prev, pickupAddress: address }))
      setShowAddressForm(false)
      setNewAddress({
        addressType: "home",
        addressline: "",
        locality: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
        phone: "",
        alternatePhone: "",
        isDefault: false,
      })

      // setMessage({ type: "success", text: "Address added successfully" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add address" })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "requested":
        return "bg-blue-100 text-blue-800"
      case "processed":
        return "bg-yellow-100 text-yellow-800"
      case "received":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "requested":
        return <Clock className="h-4 w-4" />
      case "processed":
        return <Package className="h-4 w-4" />
      case "received":
        return <Truck className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <Ban className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getAddressIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="h-4 w-4" />
      case "work":
        return <Building className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] to-white">
      <Navbar isLoggedIn={cookieValue?true:false} variant="floating" userdata={userdata} />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#455A64] hover:text-[#4FC3F7] transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#455A64]">Sell Your Clothes</h1>
              <p className="text-gray-600 text-lg">Clean your wardrobe, earn cash & Re-verse coins</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
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

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setActiveTab("sell")}
            variant={activeTab === "sell" ? "default" : "outline"}
            className={`px-8 py-3 text-lg ${
              activeTab === "sell"
                ? "bg-[#4FC3F7] hover:bg-[#33BF69] text-white"
                : "border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white"
            }`}
          >
            <Package className="h-5 w-5 mr-2" />
            Sell Now
          </Button>
          <Button
            onClick={() => setActiveTab("history")}
            variant={activeTab === "history" ? "default" : "outline"}
            className={`px-8 py-3 text-lg ${
              activeTab === "history"
                ? "bg-[#4FC3F7] hover:bg-[#33BF69] text-white"
                : "border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white"
            }`}
          >
            <Clock className="h-5 w-5 mr-2" />
            Previous Requests
          </Button>
        </div>

        {activeTab === "sell" && (
          <div className="space-y-8">
            {/* Hero Section */}
            <Card className="bg-gradient-to-r from-[#4FC3F7]/10 to-[#33BF69]/10 border-0 rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-4xl font-bold text-[#455A64] mb-4">Turn Your Wardrobe Into Cash</h2>
                    <p className="text-xl text-gray-600 mb-6">
                      Sell your pre-loved clothes and contribute to sustainable fashion while earning instant cash and
                      Re-verse coins.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#33BF69] rounded-full flex items-center justify-center">
                          <IndianRupee className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#455A64]">Instant Cash</div>
                          <div className="text-sm text-gray-600">Get paid quickly</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#4FC3F7] rounded-full flex items-center justify-center">
                          <Coins className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#455A64]">Re-verse Coins</div>
                          <div className="text-sm text-gray-600">Earn loyalty points</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#33BF69] rounded-full flex items-center justify-center">
                          <Truck className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#455A64]">Free Pickup</div>
                          <div className="text-sm text-gray-600">We come to you</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#4FC3F7] rounded-full flex items-center justify-center">
                          <Leaf className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#455A64]">Eco-Friendly</div>
                          <div className="text-sm text-gray-600">Sustainable choice</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <Image
                      src="/sell.png"
                      alt="Sell clothes illustration"
                      width={500}
                      height={400}
                      className="rounded-2xl shadow-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sell Options */}
            {!sellOption && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Bulk Sell */}
                <Card
                  className="cursor-pointer border-2 border-transparent hover:border-[#4FC3F7] transition-all duration-300 hover:shadow-lg rounded-3xl overflow-hidden"
                  onClick={() => setSellOption("bulk")}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-[#4FC3F7] rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#455A64] mb-4">Bulk Sell</h3>
                    <p className="text-gray-600 mb-6 text-lg">
                      Sell multiple items at once. Perfect for wardrobe cleanouts and bulk collections.
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-center gap-2 text-[#33BF69]">
                        <CheckCircle className="h-5 w-5" />
                        <span>₹15 per kg</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-[#33BF69]">
                        <CheckCircle className="h-5 w-5" />
                        <span>Free pickup</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-[#33BF69]">
                        <CheckCircle className="h-5 w-5" />
                        <span>Quick processing</span>
                      </div>
                    </div>
                    <Button className="w-full bg-[#4FC3F7] hover:bg-[#33BF69] text-white py-3 text-lg">
                      Start Bulk Sell
                    </Button>
                  </CardContent>
                </Card>

                {/* Premium Sell */}
                <Card className="border-2 border-gray-200 rounded-3xl overflow-hidden opacity-60">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Star className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#455A64] mb-4">Premium Sell</h3>
                    <p className="text-gray-600 mb-6 text-lg">
                      Individual item evaluation for designer and premium brands. Higher payouts for quality pieces.
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Star className="h-5 w-5" />
                        <span>Premium pricing</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Star className="h-5 w-5" />
                        <span>Expert evaluation</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Star className="h-5 w-5" />
                        <span>Brand authentication</span>
                      </div>
                    </div>
                    <Button disabled className="w-full py-3 text-lg">
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Bulk Sell Flow */}
            {sellOption === "bulk" && (
              <Card className="rounded-3xl border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-[#455A64]">Bulk Sell Request</CardTitle>
                      <CardDescription className="text-lg">
                        Step {currentStep} of 6 - Let's get your clothes ready for pickup
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSellOption(null)
                        setCurrentStep(1)
                        setPincode("")
                        setIsServiceable(null)
                      }}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div
                      className="bg-[#4FC3F7] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / 6) * 100}%` }}
                    ></div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-8">
                  {/* Step 1: Pincode Check */}
                  {currentStep === 1 && (
                    <div className="text-center space-y-6">
                      <div className="w-20 h-20 bg-[#4FC3F7] rounded-full flex items-center justify-center mx-auto">
                        <MapPin className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-[#455A64] mb-2">Check Serviceability</h3>
                        <p className="text-gray-600 text-lg">Enter your pincode to see if we service your area</p>
                      </div>

                      <div className="max-w-md mx-auto space-y-4">
                        <div className="flex gap-3">
                          <Input
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            placeholder="Enter 6-digit pincode"
                            className="text-center text-xl tracking-widest h-14 border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
                            maxLength={6}
                          />
                          <Button
                            onClick={checkServiceability}
                            disabled={loading || pincode.length !== 6}
                            className="bg-[#4FC3F7] hover:bg-[#33BF69] h-14 px-8"
                          >
                            {loading ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              "Check"
                            )}
                          </Button>
                        </div>

                        {isServiceable === false && (
                          <Alert className="border-orange-500 bg-orange-50">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                            <AlertDescription className="text-orange-700">
                              <strong>Coming soon to your area!</strong>
                              <br />
                              We're expanding our services. You'll be notified when we start serving {pincode}.
                            </AlertDescription>
                          </Alert>
                        )}

                        {isServiceable === true && serviceableCity && (
                          <Alert className="border-[#33BF69] bg-[#33BF69]/5">
                            <CheckCircle className="h-4 w-4 text-[#33BF69]" />
                            <AlertDescription className="text-[#33BF69]">
                              <strong>Great news!</strong> We service {serviceableCity.city}, {serviceableCity.state}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      {/* Serviceable Cities */}
                      <div className="max-w-2xl mx-auto">
                      <h4 className="font-semibold text-[#455A64] mb-4">
  We are currently serving the Ahmedabad, Gujarat region. Please check if your pincode is eligible:
</h4>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {serviceableCities.map((city, index) => (
                            <div key={index} className="bg-[#F2F2F2]/50 rounded-xl p-3 text-center">
                              <div className="font-medium text-[#455A64]">{city.city}</div>
                              
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Weight Selection */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-[#4FC3F7] rounded-full flex items-center justify-center mx-auto mb-4">
                          <Weight className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#455A64] mb-2">Approximate Weight</h3>
                        <p className="text-gray-600 text-lg">Select the approximate weight of your clothes</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {weightOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setFormData((prev) => ({ ...prev, weightInKg: option.value }))}
                            className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                              formData.weightInKg === option.value
                                ? "border-[#4FC3F7] bg-[#4FC3F7]/10"
                                : "border-gray-200 hover:border-[#4FC3F7]/50"
                            }`}
                          >
                            <div className="font-bold text-xl text-[#455A64] mb-2">{option.label}</div>
                            <div className="text-gray-600">{option.description}</div>
                            <div className="text-[#33BF69] font-semibold mt-2">~₹{option.value * 15} estimated</div>
                          </button>
                        ))}
                      </div>

                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                          className="border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={() => setCurrentStep(3)}
                          disabled={!formData.weightInKg}
                          className="bg-[#4FC3F7] hover:bg-[#33BF69]"
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Number of Items */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-[#4FC3F7] rounded-full flex items-center justify-center mx-auto mb-4">
                          <Hash className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#455A64] mb-2">Number of Items</h3>
                        <p className="text-gray-600 text-lg">How many pieces are you selling?</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {itemOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setFormData((prev) => ({ ...prev, no_of_items: option.value }))}
                            className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                              formData.no_of_items === option.value
                                ? "border-[#4FC3F7] bg-[#4FC3F7]/10"
                                : "border-gray-200 hover:border-[#4FC3F7]/50"
                            }`}
                          >
                            <div className="font-bold text-xl text-[#455A64] mb-2">{option.label}</div>
                            <div className="text-gray-600">{option.description}</div>
                          </button>
                        ))}
                      </div>

                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(2)}
                          className="border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={() => setCurrentStep(4)}
                          disabled={!formData.no_of_items}
                          className="bg-[#4FC3F7] hover:bg-[#33BF69]"
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Description & Image */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-[#4FC3F7] rounded-full flex items-center justify-center mx-auto mb-4">
                          <Camera className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#455A64] mb-2">Describe Your Clothes</h3>
                        <p className="text-gray-600 text-lg">Add a description and photo of your items</p>
                      </div>

                      <div className="max-w-2xl mx-auto space-y-6">
                        <div className="space-y-2">
                          <Label className="text-[#455A64] font-medium text-lg">Description</Label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe your clothes (e.g., mix of cotton t-shirts, jeans, casual wear in good condition)"
                            className="min-h-[120px] border-[#4FC3F7]/30 focus:border-[#4FC3F7] text-base"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[#455A64] font-medium text-lg">Upload Photo</Label>
                          <div className="border-2 border-dashed border-[#4FC3F7]/30 rounded-2xl p-8 text-center">
                            {formData.description_image ? (
                              <div className="space-y-4">
                                <Image
                                  src={previewUrl || "/placeholder.svg"}
                                  alt="Uploaded clothes"
                                  width={300}
                                  height={200}
                                  className="mx-auto rounded-xl shadow-md"
                                />
                                <Button
                                  variant="outline"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white"
                                >
                                  <Camera className="h-4 w-4 mr-2" />
                                  Change Photo
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <Upload className="h-16 w-16 text-[#4FC3F7] mx-auto" />
                                <div>
                                  <p className="text-lg font-medium text-[#455A64] mb-2">Upload a clear photo</p>
                                  <p className="text-gray-600">Show your clothes clearly for better evaluation</p>
                                </div>
                                <Button
                                  onClick={() => fileInputRef.current?.click()}
                                  className="bg-[#4FC3F7] hover:bg-[#33BF69]"
                                >
                                  <Camera className="h-4 w-4 mr-2" />
                                  Choose Photo
                                </Button>
                              </div>
                            )}
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(3)}
                          className="border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={() => setCurrentStep(5)}
                          disabled={!formData.description.trim() || !formData.description_image}
                          className="bg-[#4FC3F7] hover:bg-[#33BF69]"
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Pickup Date */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-[#4FC3F7] rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#455A64] mb-2">Schedule Pickup</h3>
                        <p className="text-gray-600 text-lg">Choose a convenient pickup date</p>
                      </div>

                      <div className="max-w-md mx-auto space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[#455A64] font-medium text-lg">Preferred Pickup Date</Label>
                          <Input
                            type="date"
                            value={formData.scheduledPickupDate}
                            onChange={(e) => setFormData((prev) => ({ ...prev, scheduledPickupDate: e.target.value }))}
                            min={getMinDate()}
                            max={getMaxDate()}
                            className="h-14 text-lg border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
                          />
                        </div>

                        <Alert className="border-[#4FC3F7] bg-[#4FC3F7]/5">
                          <AlertCircle className="h-4 w-4 text-[#4FC3F7]" />
                          <AlertDescription className="text-[#4FC3F7]">
                            <strong>Note:</strong> Actual pickup date may vary by ±1 day due to logistics partner
                            availability.
                          </AlertDescription>
                        </Alert>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(4)}
                          className="border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={() => setCurrentStep(6)}
                          disabled={!formData.scheduledPickupDate}
                          className="bg-[#4FC3F7] hover:bg-[#33BF69]"
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 6: Address Selection */}
                  {currentStep === 6 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-[#4FC3F7] rounded-full flex items-center justify-center mx-auto mb-4">
                          <MapPin className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#455A64] mb-2">Pickup Address</h3>
                        <p className="text-gray-600 text-lg">Select where we should pick up your clothes</p>
                      </div>

                      <div className="space-y-4">
                        {addresses
                          .filter((addr:any) => pincodes.find((pin:any) => pin?.pincode === addr?.pincode))
                          .map((address:any) => (
                            <button
                              key={address?._id}
                              onClick={() => setFormData((prev) => ({ ...prev, pickupAddress: address?._id }))}
                              className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                                formData?.pickupAddress === address?._id
                                  ? "border-[#4FC3F7] bg-[#4FC3F7]/10"
                                  : "border-gray-200 hover:border-[#4FC3F7]/50"
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[#F2F2F2] rounded-full flex items-center justify-center">
                                  {getAddressIcon(address?.addressType)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-semibold text-[#455A64] text-lg capitalize">
                                      {address.addressType}
                                    </span>
                                    {address.isDefault && (
                                      <Badge className="bg-[#33BF69] text-white text-xs">Default</Badge>
                                    )}
                                  </div>
                                  <div className="text-gray-600 space-y-1">
                                    <p>{address.addressline}</p>
                                    <p>
                                      {address.locality}, {address.city}, {address.state} - {address.pincode}
                                    </p>
                                    {address.landmark && <p>Landmark: {address.landmark}</p>}
                                    <p>Phone: +91 {address.phone}</p>
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}

                        <Button
                          variant="outline"
                          onClick={() => setShowAddressForm(true)}
                          className="w-full py-4 border-dashed border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Add New Address
                        </Button>
                      </div>

                      {/* Estimate */}
                      {formData.pickupAddress && (
                        <div className="bg-gradient-to-r from-[#4FC3F7]/10 to-[#33BF69]/10 rounded-2xl p-6">
                          <h4 className="font-bold text-[#455A64] text-xl mb-4">Estimated Earnings</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-[#33BF69] mb-1">
                                ₹{calculateEstimate().totalPayout}
                              </div>
                              <div className="text-gray-600">Cash Payout</div>
                            </div>
                            <div className="text-center">
                              <div className="text-3xl font-bold text-[#4FC3F7] mb-1">
                                {calculateEstimate().reversePoints}
                              </div>
                              <div className="text-gray-600">Re-verse Coins</div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(5)}
                          className="border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={submitSellRequest}
                          disabled={loading || !formData.pickupAddress}
                          className="bg-[#33BF69] hover:bg-[#4FC3F7] px-8"
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          ) : null}
                          Submit Request
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#455A64]">Previous Sell Requests</h2>
                <p className="text-gray-600">Track your sell requests and earnings</p>
              </div>
              <Button onClick={() => setActiveTab("sell")} className="bg-[#4FC3F7] hover:bg-[#33BF69] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Sell More Now
              </Button>
            </div>

            {sellRequests.length === 0 ? (
              <Card className="rounded-3xl border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Package className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-600 mb-4">No sell requests yet</h3>
                  <p className="text-gray-500 mb-8 text-lg">Start selling your clothes to see your requests here</p>
                  <Button
                    onClick={() => setActiveTab("sell")}
                    className="bg-[#4FC3F7] hover:bg-[#33BF69] text-white px-8 py-3"
                  >
                    Start Selling
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {sellRequests?.map((request:any) => (
                  <Card key={request?._id} className="rounded-3xl border-0 shadow-lg overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#F2F2F2] rounded-full flex items-center justify-center">
                            {getStatusIcon(request?.status)}
                          </div>
                          <div>
                            <div className="font-bold text-[#455A64] text-lg">Request #{request?._id}</div>
                            <div className="text-gray-600">
                              Created on {new Date(request?.createdAt)?.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`px-3 py-1 ${getStatusColor(request?.status)}`}>
                            {request?.status?.charAt(0).toUpperCase() + request?.status?.slice(1)}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request)
                              setShowRequestDetails(true)
                            }}
                            className="border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-[#F2F2F2]/50 rounded-xl p-4 text-center">
                          <div className="font-bold text-[#455A64] text-lg">{request?.weightInKg} kg</div>
                          <div className="text-gray-600 text-sm">Weight</div>
                        </div>
                        <div className="bg-[#F2F2F2]/50 rounded-xl p-4 text-center">
                          <div className="font-bold text-[#455A64] text-lg">{request?.no_of_items}</div>
                          <div className="text-gray-600 text-sm">Items</div>
                        </div>
                        <div className="bg-[#F2F2F2]/50 rounded-xl p-4 text-center">
                          <div className="font-bold text-[#33BF69] text-lg">₹{request?.totalPayout}</div>
                          <div className="text-gray-600 text-sm">Payout</div>
                        </div>
                        <div className="bg-[#F2F2F2]/50 rounded-xl p-4 text-center">
                          <div className="font-bold text-[#4FC3F7] text-lg">{request?.reversePoints}</div>
                          <div className="text-gray-600 text-sm">Re-verse Coins</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-gray-600">
                          Pickup: {new Date(request?.scheduledPickupDate)?.toLocaleDateString()}
                          {request.actualPickupDate && (
                            <span className="text-[#33BF69] ml-2">
                              (Completed: {new Date(request?.actualPickupDate)?.toLocaleDateString()})
                            </span>
                          )}
                        </div>

                        {request?.status === "requested" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelRequest(request?._id)}
                            className="border-red-500 text-red-500 hover:bg-red-50"
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        )}

                        {request?.status !== "requested" && request?.status !== "cancelled" && (
                          <div className="text-sm text-gray-600">
                            Need help? Email{" "}
                            <a href="mailto:support@re-verse.in" className="text-[#4FC3F7] hover:underline">
                              support@re-verse.in
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Address Modal */}
        {showAddressForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#455A64]">Add Pickup Address</h3>
                  <Button size="sm" variant="ghost" onClick={() => setShowAddressForm(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "home", label: "Home", icon: Home },
                    { value: "work", label: "Work", icon: Building },
                    { value: "other", label: "Other", icon: MapPin },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setNewAddress((prev) => ({ ...prev, addressType: value }))}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                        newAddress.addressType === value
                          ? "border-[#4FC3F7] bg-[#4FC3F7]/10 text-[#4FC3F7]"
                          : "border-gray-200 hover:border-[#4FC3F7]/50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{label}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#455A64] font-medium">Address Line</Label>
                    <Input
                      value={newAddress.addressline}
                      onChange={(e) => setNewAddress((prev) => ({ ...prev, addressline: e.target.value }))}
                      placeholder="House/Flat/Office No., Street Name"
                      className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#455A64] font-medium">Locality</Label>
                    <Input
                      value={newAddress.locality}
                      onChange={(e) => setNewAddress((prev) => ({ ...prev, locality: e.target.value }))}
                      placeholder="Area, Colony, Sector"
                      className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#455A64] font-medium">City</Label>
                    <Input
                      value={newAddress.city}
                      onChange={(e) => setNewAddress((prev) => ({ ...prev, city: e.target.value }))}
                      placeholder="City"
                      className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#455A64] font-medium">State</Label>
                    <Input
                      value={newAddress.state}
                      onChange={(e) => setNewAddress((prev) => ({ ...prev, state: e.target.value }))}
                      placeholder="State"
                      className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#455A64] font-medium">Pincode</Label>
                    <Input
                      value={newAddress.pincode}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                        }))
                      }
                      placeholder="Pincode"
                      className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#455A64] font-medium">Phone</Label>
                    <Input
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                        }))
                      }
                      placeholder="Phone number"
                      className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
                      maxLength={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#455A64] font-medium">Alternate Phone (Optional)</Label>
                    <Input
                      value={newAddress.alternatePhone}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          alternatePhone: e.target.value.replace(/\D/g, "").slice(0, 10),
                        }))
                      }
                      placeholder="Alternate phone"
                      className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#455A64] font-medium">Landmark (Optional)</Label>
                  <Input
                    value={newAddress.landmark}
                    onChange={(e) => setNewAddress((prev) => ({ ...prev, landmark: e.target.value }))}
                    placeholder="Nearby landmark"
                    className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress((prev) => ({ ...prev, isDefault: e.target.checked }))}
                    className="w-4 h-4 text-[#4FC3F7] border-gray-300 rounded focus:ring-[#4FC3F7]"
                  />
                  <Label htmlFor="isDefault" className="text-[#455A64] font-medium cursor-pointer">
                    Set as default address
                  </Label>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-3">
                <Button
                  onClick={() => setShowAddressForm(false)}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={()=>addNewAddress()}
                  disabled={
                    loading ||
                    !newAddress.addressline.trim() ||
                    !newAddress.city.trim() ||
                    !newAddress.state.trim() ||
                    !newAddress.pincode.trim() ||
                    !newAddress.phone.trim()
                  }
                  className="flex-1 bg-[#33BF69] hover:bg-[#4FC3F7] text-white"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : null}
                  Add Address
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Request Details Modal */}
        {showRequestDetails && selectedRequest && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-[#455A64]">Request #{selectedRequest.id}</h3>
                    <p className="text-gray-600">
                      Created on {new Date(selectedRequest.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setShowRequestDetails(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#F2F2F2] rounded-full flex items-center justify-center">
                    {getStatusIcon(selectedRequest.status)}
                  </div>
                  <div>
                    <Badge className={`px-4 py-2 text-lg ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    </Badge>
                    <p className="text-gray-600 mt-1">
                      {selectedRequest.status === "requested" && "Your request is being processed"}
                      {selectedRequest.status === "processed" && "Items are being evaluated"}
                      {selectedRequest.status === "received" && "Items received at our facility"}
                      {selectedRequest.status === "completed" && "Process completed, payout disbursed"}
                      {selectedRequest.status === "cancelled" && "Request was cancelled"}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-0 bg-[#F2F2F2]/30">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-[#455A64] text-lg mb-4">Item Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Weight:</span>
                          <span className="font-semibold text-[#455A64]">{selectedRequest.weightInKg} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Number of Items:</span>
                          <span className="font-semibold text-[#455A64]">{selectedRequest.no_of_items}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <span className="text-gray-600 block mb-2">Description:</span>
                          <p className="text-[#455A64]">{selectedRequest.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-[#F2F2F2]/30">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-[#455A64] text-lg mb-4">Earnings</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cash Payout:</span>
                          <span className="font-bold text-[#33BF69] text-xl">₹{selectedRequest.totalPayout}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Re-verse Coins:</span>
                          <span className="font-bold text-[#4FC3F7] text-xl">{selectedRequest.reversePoints}</span>
                        </div>
                        {selectedRequest.status === "completed" && (
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-[#33BF69]">
                              <CheckCircle className="h-4 w-4" />
                              <span className="font-medium">Payout completed</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Images */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-[#455A64] text-lg mb-4">Item Photo</h4>
                    <div className="rounded-2xl overflow-hidden shadow-md">
                      <Image
                        src={selectedRequest.description_image || "/placeholder.svg"}
                        alt="Submitted clothes"
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>

                  {selectedRequest.payout_image && (
                    <div>
                      <h4 className="font-bold text-[#455A64] text-lg mb-4">Payout Proof</h4>
                      <div className="rounded-2xl overflow-hidden shadow-md">
                        <Image
                          src={selectedRequest.payout_image || "/placeholder.svg"}
                          alt="Payout proof"
                          width={400}
                          height={300}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Pickup Details */}
                <Card className="border-0 bg-[#F2F2F2]/30">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-[#455A64] text-lg mb-4">Pickup Details</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-[#455A64] mb-2">Scheduled Date</h5>
                        <p className="text-gray-600">
                          {new Date(selectedRequest.scheduledPickupDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        {selectedRequest.actualPickupDate && (
                          <>
                            <h5 className="font-semibold text-[#455A64] mb-2 mt-4">Actual Pickup Date</h5>
                            <p className="text-[#33BF69] font-medium">
                              {new Date(selectedRequest.actualPickupDate).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </>
                        )}
                      </div>
                      <div>
                        <h5 className="font-semibold text-[#455A64] mb-2">Pickup Address</h5>
                        <div className="text-gray-600 space-y-1">
                          <p className="font-medium text-[#455A64] capitalize">
                            {selectedRequest.pickupAddress.addressType}
                          </p>
                          <p>{selectedRequest.pickupAddress.addressline}</p>
                          <p>{selectedRequest.pickupAddress.locality}</p>
                          <p>
                            {selectedRequest.pickupAddress.city}, {selectedRequest.pickupAddress.state} -{" "}
                            {selectedRequest.pickupAddress.pincode}
                          </p>
                          {selectedRequest.pickupAddress.landmark && (
                            <p>Landmark: {selectedRequest.pickupAddress.landmark}</p>
                          )}
                          <p>Phone: +91 {selectedRequest.pickupAddress.phone}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  {selectedRequest.status === "requested" ? (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => cancelRequest(selectedRequest.id)}
                        className="border-red-500 text-red-500 hover:bg-red-50"
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Cancel Request
                      </Button>
                    </div>
                  ) : selectedRequest.status !== "cancelled" ? (
                    <div className="text-gray-600">
                      Need help? Contact us at{" "}
                      <a href="mailto:support@re-verse.in" className="text-[#4FC3F7] hover:underline">
                        support@re-verse.in
                      </a>
                    </div>
                  ) : (
                    <div className="text-red-600">This request was cancelled</div>
                  )}

                  <Button
                    onClick={() => setShowRequestDetails(false)}
                    className="bg-[#4FC3F7] hover:bg-[#33BF69] text-white"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
              <div className="p-8 text-center">
                <div className="w-24 h-24 bg-[#33BF69] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-[#455A64] mb-4">Request Submitted Successfully!</h3>

                <p className="text-xl text-gray-600 mb-8">
                  We'll pick up your loved clothes soon. This will help sustain the future. Thank you for your
                  contribution! 🌱
                </p>

                <div className="bg-gradient-to-r from-[#4FC3F7]/10 to-[#33BF69]/10 rounded-2xl p-6 mb-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#33BF69] mb-1">₹{calculateEstimate().totalPayout}</div>
                      <div className="text-gray-600">Expected Payout</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#4FC3F7] mb-1">{calculateEstimate().reversePoints}</div>
                      <div className="text-gray-600">Re-verse Coins</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    * Re-verse coins will be disbursed once the process is completed
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 text-[#33BF69] mb-8">
                  <div className="flex items-center gap-2">
                    <Recycle className="h-5 w-5" />
                    <span>Sustainable Choice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    <span>Eco-Friendly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    <span>Future Ready</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setShowConfirmation(false)
                      setActiveTab("history")
                    }}
                    variant="outline"
                    className="flex-1 border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white"
                  >
                    View Requests
                  </Button>
                  <Button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 bg-[#33BF69] hover:bg-[#4FC3F7] text-white"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
function userProfile() {
  throw new Error("Function not implemented.")
}

