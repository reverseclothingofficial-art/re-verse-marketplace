"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Camera,
  Edit3,
  Save,
  X,
  Mail,
  Phone,
  User,
  Calendar,
  Coins,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
  MapPin,
  Plus,
  Trash2,
  Home,
  Building,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Navbar from "@/components/navbar"
import { useCookieContext } from "@/context/cookieContext"
import { Spinner } from "@/components/ui/spinner"

// Mock user data based on your schema
const mockUserData = {
  phone: "9876543210",
  isVerified: true,
  name: "John Doe",
  email: "john.doe@example.com",
  profileImage: "/placeholder.svg?height=150&width=150",
  createdAt: "2023-06-15T10:30:00Z",
  updatedAt: "2024-01-15T14:20:00Z",
  reversePoints: 2450,
  defaultSize: "M", // Assuming this resolves to a size string
  addresses: [
    {
      id: 1,
      type: "home",
      name: "Home",
      fullName: "John Doe",
      phone: "9876543210",
      addressLine1: "123 Green Street",
      addressLine2: "Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      landmark: "Near Central Park",
      isDefault: true,
    },
    {
      id: 2,
      type: "work",
      name: "Office",
      fullName: "John Doe",
      phone: "9876543210",
      addressLine1: "456 Business District",
      addressLine2: "Floor 12, Tower A",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400051",
      landmark: "Opposite Metro Station",
      isDefault: false,
    },
  ],
}

const faqs = [
  {
    question: "How are Re-verse Coins earned?",
    answer:
      "Re-verse Coins are earned through various activities like making purchases, referring friends, writing reviews, and participating in sustainability challenges. Each coin represents your contribution to sustainable fashion.",
  },
  {
    question: "Can I transfer my Re-verse Coins to someone else?",
    answer:
      "Currently, Re-verse Coins are non-transferable and tied to your account. They can only be used for discounts and rewards within the Re-verse platform.",
  },
  {
    question: "How is my personal data protected?",
    answer:
      "We use industry-standard encryption to protect your data. Your information is never shared with third parties without your consent, and you have full control over your privacy settings.",
  },
  {
    question: "Why do I need to verify my email with OTP?",
    answer:
      "Email verification ensures the security of your account and helps us send you important updates about your orders and account. It also prevents unauthorized access to your account.",
  },
  {
    question: "Can I change my phone number?",
    answer:
      "Phone numbers cannot be changed as they are used for account verification and security. If you need to change your phone number, please contact our support team.",
  },
  {
    question: "What happens to my data if I delete my account?",
    answer:
      "If you choose to delete your account, all your personal data will be permanently removed from our systems within 30 days, except for data required for legal compliance.",
  },
]

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>()
  const [editingField, setEditingField] = useState<string | null>(null)
  const [tempValues, setTempValues] = useState<any>({})
  const [showEmailOTP, setShowEmailOTP] = useState(false)
  const [emailOTP, setEmailOTP] = useState("")
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [showAddressForm, setShowAddressForm] = useState(false)
const [load,setloading]=useState<Boolean>(false)
  const [userdata,setuserdata]=useState<any>()
  const { cookieValue } = useCookieContext()
  const [reload,setreload]=useState<Boolean>(false)
const api= process.env.NEXT_PUBLIC_API_URL
  const userProfile=async()=>{
    try{
      setloading(true)
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
    setloading(false)
  }

  const full_profile=async()=>{
    try{
      setloading(true)
      const response = await fetch(`${api}/api/u/user/profile-page-data`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookieValue}`,
          },
      });
      const data = await response.json();
      setUserData(data)
      console.log(data)


    }catch(err){
      console.log(err)
    }
    setloading(false)
  }





  // Simplify user data fetching
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setloading(true)
    try {
      const [profileRes, fullRes] = await Promise.all([
        fetch(`${api}/api/home/profile-summary`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookieValue}`,
            },

        }),
        fetch(`${api}/api/u/user/profile-page-data`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookieValue}`,
            },
        })
      ]);
      setuserdata(await profileRes.json());
      setUserData(await fullRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setloading(false);
    }
  };
  fetchData();
}, [cookieValue,reload]);

  const [editingAddress, setEditingAddress] = useState<any>(null);
 
 
  const [addressFormData, setAddressFormData] = useState({
    addressType: "home",
    name: "",
    locality: "",
    phone: "",
    alternatePhone: "",
    addressline: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    isDefault: false,
  });
  
  // Reset function
  const resetAddressForm = () => {
    setAddressFormData({
      addressType: "home",
      name: "",
      locality: "",
      phone: "",
      alternatePhone: "",
      addressline: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
      isDefault: false,
    });
  };
  
  // Add Address
  const startAddingAddress = () => {
    resetAddressForm();
    setEditingAddress(null);
    setShowAddressForm(true);
  };
  
  // Edit Address (with proper mapping)
  const startEditingAddress = (address:any) => {
    setAddressFormData({
      addressType: address.addressType || address.type || "home",
      name: address.name || "Home", // <-- Ensure name is set
      locality: address.locality || address.fullName || "",
      phone: address.phone || "",
      alternatePhone: address.alternatePhone || "",
      addressline: address.addressline || address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      landmark: address.landmark || "",
      isDefault: address.isDefault || false,
    });
    setEditingAddress(address._id || address.id);
    setShowAddressForm(true);
  };
  
  
  const cancelAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    resetAddressForm();
  };
  
  // Save Address (add/edit)
  const saveAddress1 = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (editingAddress) {
        // Update existing address
        setUserData((prev: any) => ({
          ...prev,
          addresses: prev.addresses.map((addr: any) =>
            (addr._id || addr.id) === editingAddress
              ? { ...addressFormData, id: editingAddress }
              : addr
          ),
          updatedAt: new Date().toISOString(),
        }));
      } else {
        // Add new address


        try{
          const response = await fetch(`${api}/api/u/user/addresses`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${cookieValue}`,
              },
              body: JSON.stringify(addressFormData)

          })
          if(response.status===201){
            setreload((prev)=>!(prev))
          }
          else{
            alert("Failed to add address")
          }

        }catch(err){
          console.log(err)
        }
        // const newAddress = {
        //   ...addressFormData,
        //   id: Date.now(),
        // };
        // setUserData((prev: any) => ({
        //   ...prev,
        //   addresses: [...(prev?.addresses || []), newAddress],
        //   updatedAt: new Date().toISOString(),
        // }));
      }
      setShowAddressForm(false);
      setEditingAddress(null);
      resetAddressForm();
    } catch (error) {
      // Handle error
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveAddress = async () => {
    setLoading(true)
    try {
     

      if (editingAddress) {
        // Update existing address
try{
        const response = await fetch(`${api}/api/u/user/addresses/${editingAddress}`,{
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookieValue}`,
            },
            body: JSON.stringify(addressFormData)

        })
        if(response.status===201){
          setreload((prev)=>!(prev))
          setMessage({ type: "success", text: "Address updated successfully!" })
        }
        else{
          alert("Failed to UPDATE address")
        }

      }catch(err){
        console.log(err)
      }





        // setUserData((prev:any) => ({
        //   ...prev,
        //   addresses: prev.addresses.map((addr:any) =>
        //     addr?.id === editingAddress ? { ...addressFormData, id: editingAddress } : addr,
        //   ),
        //   updatedAt: new Date().toISOString(),
        // }))
        
      } else {
        // Add new address

        try{
          const response = await fetch(`${api}/api/u/user/addresses`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${cookieValue}`,
              },
              body: JSON.stringify(addressFormData)

          })
          if(response.status===201){
            setreload((prev)=>!(prev))
            setMessage({ type: "success", text: "Address added successfully!" })
          }
          else{
            alert("Failed to add address")
          }

        }catch(err){
          console.log(err)
        }





        // const newAddress = {
        //   ...addressFormData,
        //   id: Date.now(),
        // }
        // setUserData((prev:any) => ({
        //   ...prev,
        //   addresses: [...prev?.addresses, newAddress],
        //   updatedAt: new Date().toISOString(),
        // }))
        
      }

      setShowAddressForm(false)
      setEditingAddress(null)
      resetAddressForm()
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save address. Please try again." })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const deleteAddress = async (addressId: number) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setLoading(true)
      try {
        // await new Promise((resolve) => setTimeout(resolve, 500))

        // setUserData((prev:any) => ({
        //   ...prev,
        //   addresses: prev?.addresses.filter((addr:any) => addr?.id !== addressId),
        //   updatedAt: new Date().toISOString(),
        // }))
        try{
          const response = await fetch(`${api}/api/u/user/addresses/${addressId}`,{
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${cookieValue}`,
              }
  
          })
          if(response.status===201){
            setreload((prev)=>!(prev))
            setMessage({ type: "success", text: "Address deleted successfully!" })
          }
          else{
            setMessage({ type: "error", text: "Failed to delete address. Please try again." })
          }
  
        }catch(err){
          console.log(err)
        }



        
        setTimeout(() => setMessage(null), 3000)
      } catch (error) {
        setMessage({ type: "error", text: "Failed to delete address. Please try again." })
        setTimeout(() => setMessage(null), 3000)
      } finally {
        setLoading(false)
      }
    }
  }

  const setDefaultAddress = async (addressId: number) => {
    setLoading(true)
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500))

      // setUserData((prev:any) => ({
      //   ...prev,
      //   addresses: prev.addresses.map((addr:any) => ({
      //     ...addr,
      //     isDefault: addr?.id === addressId,
      //   })),
      //   updatedAt: new Date().toISOString(),
      // }))


      try{
        const response = await fetch(`${api}/api/u/user/addresses/${addressId}/set-default`,{
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookieValue}`,
            }

        })
        if(response.status===201){
          setreload((prev)=>!(prev))
          setMessage({ type: "success", text: "Default address updated successfully!" })
        }
        else{
          setMessage({ type: "error", text: "Failed to update default address. Please try again." })
        }

      }catch(err){
        console.log(err)
      }

      
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update default address. Please try again." })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
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

  const handleImageUpload =async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setloading(true)
      // In a real app, you'd upload to your server/cloud storage
      if(userData?.profileImage){
        await deletefroms3(userData.profileImage)
      }
      const uploadedImage = await uploadToS3(file);
      try{
        const response = await fetch(`${api}/api/u/user/profileImage`,{
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookieValue}`,
            },
            body: JSON.stringify({profileImage: uploadedImage})

        })
        if(response.status===201){
          setreload((prev)=>!(prev))
          setMessage({ type: "success", text: "Image updated successfully!" })
        }
        else{
          setMessage({ type: "error", text: "Failed to update Image. Please try again." })
        }

      }catch(err){
        console.log(err)
      }

      const reader = new FileReader()
      // reader.onload = (e) => {
      //   setUserData((prev:any) => ({
      //     ...prev,
      //     profileImage: e.target?.result as string,
      //   }))
      //   setMessage({ type: "success", text: "Profile image updated successfully!" })
      //   setTimeout(() => setMessage(null), 3000)
      // }
      setloading(false)
      setTimeout(() => setMessage(null), 4000)
      reader.readAsDataURL(file)
    }
  }

  const startEditing = (field: string) => {
    setEditingField(field)
    setTempValues({ [field]: userData[field as keyof typeof userData] })
  }

  const cancelEditing = () => {
    setEditingField(null)
    setTempValues({})
    setShowEmailOTP(false)
    setEmailOTP("")
  }

  const saveField = async (field: string) => {
    setLoading(true)

    try {
      if (field === "email" && tempValues.email !== userData?.email) {
        // Show OTP verification for email change

        try{
          const response = await fetch(`${api}/api/u/user/email/send-otp`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${cookieValue}`,
              },
              body: JSON.stringify({email:tempValues?.email})

          })
          if(response.status===201){
            setMessage({ type: "success", text: `OTP sent TO ${tempValues?.email} successfully!` })
            // setreload((prev)=>!(prev))
          }
          else{
            alert("Failed to SEND OTP")
          }

        }catch(err){
          console.log(err)
        }





        setShowEmailOTP(true)
        setLoading(false)
        return
      }else{
        try{
          const response = await fetch(`${api}/api/u/user/profile`,{
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${cookieValue}`,
              },
              body: JSON.stringify(tempValues)

          })
          if(response.status===201){
            setMessage({ type: "success", text: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!` })
            setreload((prev)=>!(prev))
          }
          else{
            alert("Failed to update field")
          }

        }catch(err){
          console.log(err)
        }
      }

      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000))

      // setUserData((prev:any) => ({
      //   ...prev,
      //   [field]: tempValues[field],
      //   updatedAt: new Date().toISOString(),
      // }))

      setEditingField(null)
      setTempValues({})
      
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update. Please try again." })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const verifyEmailOTP = async () => {
    if (emailOTP.length !== 6) {
      setMessage({ type: "error", text: "Please enter a valid 6-digit OTP" })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setLoading(true)
    try {
      // Simulate OTP verification
      try{
        const response = await fetch(`${api}/api/u/user/email/verify`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookieValue}`,
            },
            body: JSON.stringify({email:tempValues?.email,otp:emailOTP})

        })
        if(response.status===201){
          setMessage({ type: "success", text: "Email updated and verified successfully!" })
          // setreload((prev)=>!(prev))
        }
        else{
          alert("Failed to verify OTP")
        }

      }catch(err){
        console.log(err)
      }

      setEditingField(null)
      setTempValues({})
      setShowEmailOTP(false)
      setEmailOTP("")
      
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Invalid OTP. Please try again." })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getFieldIcon = (field: string) => {
    switch (field) {
      case "name":
        return <User className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      default:
        return null
    }
  }

  const canEdit = (field: string) => {
    return !["phone", "reversePoints", "createdAt", "updatedAt", "isVerified"].includes(field)
  }
if(load){
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
      <Spinner />
    </div>
  )
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] to-white">
      {/* Navbar */}
      <Navbar isLoggedIn={true} variant="floating" userdata={userdata} />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#455A64] hover:text-[#4FC3F7] transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#455A64]">My Profile</h1>
              <p className="text-gray-600">Manage your account settings and preferences</p>
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

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Profile Card - Wider on large screens */}
          <div className="xl:col-span-1">
            <Card className="shadow-lg border-0 rounded-3xl overflow-hidden h-fit sticky top-24">
              <CardContent className="p-8 text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-[#F2F2F2] to-white shadow-lg">
                    <Image
                      src={userData?.profileImage || "/placeholder.svg"}
                      alt="Profile"
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 w-12 h-12 bg-[#4FC3F7] hover:bg-[#33BF69] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <h2 className="text-3xl font-bold text-[#455A64] mb-3">{userData?.name}</h2>
                <p className="text-gray-600 mb-6 text-lg">{userData?.email}</p>

                <div className="flex items-center justify-center gap-2 mb-8">
                  {userData?.isVerified ? (
                    <Badge className="bg-[#33BF69] text-white px-4 py-2 text-sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Verified Account
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-orange-500 text-orange-500 px-4 py-2 text-sm">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Unverified
                    </Badge>
                  )}
                </div>

                {/* Re-verse Coins - Enhanced */}
                <div className="bg-gradient-to-r from-[#4FC3F7]/10 to-[#33BF69]/10 rounded-2xl p-6 mb-8">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Coins className="h-6 w-6 text-[#4FC3F7]" />
                    <span className="font-semibold text-[#455A64] text-lg">Re-verse Coins</span>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#4FC3F7] to-[#33BF69] bg-clip-text text-transparent mb-2">
                    {userData?.reversePoints?.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Earned through sustainable choices</p>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-[#33BF69]">₹{Math.floor(userData?.reversePoints * 0.1)}</div>
                        <div className="text-gray-500">Wallet Value</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-[#4FC3F7]">{Math.floor(userData?.reversePoints / 100)}</div>
                        <div className="text-gray-500">Level</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-[#F2F2F2]/50 rounded-xl">
                    <span className="text-gray-600">Cart Items</span>
                    <span className="font-semibold text-[#455A64]">{userData?.cartCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#F2F2F2]/50 rounded-xl">
                    <span className="text-gray-600">Saved Addresses</span>
                    <span className="font-semibold text-[#455A64]">{userData?.addresses?.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#F2F2F2]/50 rounded-xl">
                    <span className="text-gray-600">Wishlist Items</span>
                    <span className="font-semibold text-[#455A64]">{userData?.wishlistCount}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-500 space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(userData?.createdAt)}</span>
                  </div>
                  <div>Last updated {formatDate(userData?.updatedAt)}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Takes up more space */}
          <div className="xl:col-span-3 space-y-8">
            {/* Personal Information - Enhanced */}
            <Card className="shadow-lg border-0 rounded-3xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-[#455A64] flex items-center gap-3">
                  <User className="h-6 w-6" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-base">
                  Manage your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Name Field */}
                <div className="space-y-3">
                  <Label className="text-[#455A64] font-medium text-base">Full Name</Label>
                  <div className="flex items-center gap-4">
                    {getFieldIcon("name")}
                    {editingField === "name" ? (
                      <div className="flex-1 flex items-center gap-3">
                        <Input
                          value={tempValues?.name || ""}
                          onChange={(e) => setTempValues((prev:any) => ({ ...prev, name: e.target.value }))}
                          className="flex-1 border-[#4FC3F7] focus:border-[#33BF69] h-12 text-base"
                          placeholder="Enter your full name"
                        />
                        <Button
                          size="default"
                          onClick={() => saveField("name")}
                          disabled={loading || !tempValues.name?.trim()}
                          className="bg-[#33BF69] hover:bg-[#4FC3F7] h-12 px-6"
                        >
                          {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="default"
                          variant="outline"
                          onClick={cancelEditing}
                          className="h-12 px-6 bg-transparent"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-between bg-[#F2F2F2]/30 rounded-xl p-4">
                        <span className="text-[#455A64] text-base">{userData?.name || "Not provided"}</span>
                        {canEdit("name") && (
                          <Button size="default" variant="ghost" onClick={() => startEditing("name")}>
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Email Field - Enhanced */}
                <div className="space-y-3">
                  <Label className="text-[#455A64] font-medium text-base">Email Address</Label>
                  <div className="flex items-center gap-4">
                    {getFieldIcon("email")}
                    {editingField === "email" ? (
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <Input
                            type="email"
                            value={tempValues?.email || ""}
                            onChange={(e) => setTempValues((prev:any) => ({ ...prev, email: e.target.value }))}
                            className="flex-1 border-[#4FC3F7] focus:border-[#33BF69] h-12 text-base"
                            placeholder="Enter your email address"
                          />
                          <Button
                            size="default"
                            onClick={() => saveField("email")}
                            disabled={loading || !tempValues?.email?.trim()}
                            className="bg-[#33BF69] hover:bg-[#4FC3F7] h-12 px-6"
                          >
                            {loading ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="default"
                            variant="outline"
                            onClick={cancelEditing}
                            className="h-12 px-6 bg-transparent"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {showEmailOTP && (
                          <div className="bg-[#4FC3F7]/5 p-6 rounded-xl border border-[#4FC3F7]/20">
                            <p className="text-base text-[#455A64] mb-4">
                              We've sent a verification code to <strong>{tempValues?.email}</strong>
                            </p>
                            <div className="flex items-center gap-3">
                              <Input
                                value={emailOTP}
                                onChange={(e) => setEmailOTP(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                placeholder="Enter 6-digit OTP"
                                className="flex-1 text-center text-xl tracking-widest h-12"
                                maxLength={6}
                              />
                              <Button
                                onClick={verifyEmailOTP}
                                disabled={loading || emailOTP.length !== 6}
                                className="bg-[#33BF69] hover:bg-[#4FC3F7] h-12 px-6"
                              >
                                {loading ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-between bg-[#F2F2F2]/30 rounded-xl p-4">
                        <span className="text-[#455A64] text-base">{userData?.email || "Not provided"}</span>
                        {canEdit("email") && (
                          <Button size="default" variant="ghost" onClick={() => startEditing("email")}>
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Phone Field (Read-only) - Enhanced */}
                <div className="space-y-3">
                  <Label className="text-[#455A64] font-medium text-base">Phone Number</Label>
                  <div className="flex items-center gap-4">
                    {getFieldIcon("phone")}
                    <div className="flex-1 flex items-center justify-between bg-[#F2F2F2]/30 rounded-xl p-4">
                      <span className="text-[#455A64] text-base">+91 {userData?.phone}</span>
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        Cannot be changed
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Default Size Field - Enhanced */}
                <div className="space-y-3">
                  <Label className="text-[#455A64] font-medium text-base">Default Size</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded border-2 border-[#4FC3F7]"></div>
                    {editingField === "defaultSize" ? (
                      <div className="flex-1 flex items-center gap-3">
                        <select
                          value={tempValues?.defaultSize || ""}
                          onChange={(e) => setTempValues((prev:any) => ({ ...prev, defaultSize: e.target.value }))}
                          className="flex-1 px-4 py-3 border-2 border-[#4FC3F7] rounded-xl focus:border-[#33BF69] focus:outline-none text-base h-12"
                        >
                          <option value="">Select size</option>
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                        </select>
                        <Button
                          size="default"
                          onClick={() => saveField("defaultSize")}
                          disabled={loading}
                          className="bg-[#33BF69] hover:bg-[#4FC3F7] h-12 px-6"
                        >
                          {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="default"
                          variant="outline"
                          onClick={cancelEditing}
                          className="h-12 px-6 bg-transparent"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-between bg-[#F2F2F2]/30 rounded-xl p-4">
                        <span className="text-[#455A64] text-base">{userData?.defaultSize || "Not set"}</span>
                        {canEdit("defaultSize") && (
                          <Button size="default" variant="ghost" onClick={() => startEditing("defaultSize")}>
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Management - Enhanced */}
            <Card className="shadow-lg border-0 rounded-3xl">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-[#455A64]" />
                    <div>
                      <CardTitle className="text-2xl text-[#455A64]">Saved Addresses</CardTitle>
                      <CardDescription className="text-base">Manage your delivery addresses</CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={startAddingAddress}
                    className="bg-[#4FC3F7] hover:bg-[#33BF69] text-white rounded-full px-6 py-3"
                    size="default"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Address
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {userData?.addresses?.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No addresses saved yet</h3>
                    <p className="text-gray-500 mb-6">Add your first address to get started with deliveries</p>
                    <Button
                      onClick={startAddingAddress}
                      variant="outline"
                      className="border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white bg-transparent px-8 py-3"
                      size="default"
                    >
                      Add Your First Address
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {userData?.addresses?.map((address:any) => (
                      <div
                        key={address?._id}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                          address?.isDefault
                            ? "border-[#33BF69] bg-[#33BF69]/5"
                            : "border-gray-200 hover:border-[#4FC3F7]/50 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              {getAddressIcon(address?.addressType)}
                              <span className="font-semibold text-[#455A64] text-lg">{address?.name}</span>
                              {address?.isDefault && (
                                <Badge className="bg-[#33BF69] text-white text-sm px-3 py-1">Default</Badge>
                              )}
                            </div>
                            <div className="text-base text-gray-600 space-y-2 leading-relaxed">
                              <p className="font-medium text-[#455A64] text-lg">{address?.locality}</p>
                              <p>{address?.addressline}</p>
                              {address?.addressLine2 && <p>{address?.addressLine2}</p>}
                              <p>
                                {address?.city}, {address?.state} - {address?.pincode}
                              </p>
                              {address?.landmark && <p>Landmark: {address?.landmark}</p>}
                              <p>Phone: +91 {address?.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 ml-6">
                            {!address?.isDefault && (
                              <Button
                                size="default"
                                variant="outline"
                                onClick={() => setDefaultAddress(address?._id)}
                                className="border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white px-4 py-2"
                              >
                                Set Default
                              </Button>
                            )}
                            <Button
                              size="default"
                              variant="ghost"
                              onClick={() => startEditingAddress(address)}
                              className="text-[#4FC3F7] hover:bg-[#4FC3F7]/10 p-3"
                            >
                              <Edit3 className="h-5 w-5" />
                            </Button>
                            <Button
                              size="default"
                              variant="ghost"
                              onClick={() => deleteAddress(address?._id)}
                              className="text-red-500 hover:bg-red-50 p-3"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Address Form Modal remains the same */}
                {showAddressForm && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#455A64]">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h3>
          <Button size="sm" variant="ghost" onClick={cancelAddressForm}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Address Type */}
        <div className="space-y-2">
          <Label className="text-[#455A64] font-medium">Address Type</Label>
          <div className="flex gap-3">
            {[
              { value: "home", label: "Home", icon: Home },
              { value: "work", label: "Work", icon: Building },
              { value: "other", label: "Other", icon: MapPin },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setAddressFormData((prev) => ({ ...prev, addressType: value }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                  addressFormData?.addressType === value
                    ? "border-[#4FC3F7] bg-[#4FC3F7]/10 text-[#4FC3F7]"
                    : "border-gray-200 hover:border-[#4FC3F7]/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Address Name */}
        <div className="space-y-2">
          <Label className="text-[#455A64] font-medium">Address Name</Label>
          <Input
            value={addressFormData?.name}
            onChange={(e) => setAddressFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Home, Office, etc."
            className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
          />
        </div>

        {/* Full Name */}
        {/* <div className="space-y-2">
          <Label className="text-[#455A64] font-medium">Full Name</Label>
          <Input
            value={addressFormData?.locality}
            onChange={(e) => setAddressFormData((prev) => ({ ...prev, locality: e.target.value }))}
            placeholder="Enter full name"
            className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
          />
        </div> */}

        {/* Phone */}
        <div className="space-y-2">
          <Label className="text-[#455A64] font-medium">Phone Number</Label>
          <Input
            value={addressFormData?.phone}
            onChange={(e) =>
              setAddressFormData((prev) => ({
                ...prev,
                phone: e.target.value.replace(/\D/g, "").slice(0, 10),
              }))
            }
            placeholder="Enter 10-digit phone number"
            className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
            maxLength={10}
          />
        </div>

        {/* Alternate Phone */}
        <div className="space-y-2">
          <Label className="text-[#455A64] font-medium">Alternate Phone Number</Label>
          <Input
            value={addressFormData?.alternatePhone}
            onChange={(e) =>
              setAddressFormData((prev) => ({
                ...prev,
                alternatePhone: e.target.value.replace(/\D/g, "").slice(0, 10),
              }))
            }
            placeholder="Alternate phone number"
            className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
            maxLength={10}
          />
        </div>

        {/* Address Lines */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label className="text-[#455A64] font-medium">Address Line 1</Label>
            <Input
              value={addressFormData?.addressline}
              onChange={(e) =>
                setAddressFormData((prev) => ({ ...prev, addressline: e.target.value }))
              }
              placeholder="House/Flat/Office No., Street Name"
              className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
            />
          </div>
          {/* <div className="space-y-2">
            <Label className="text-[#455A64] font-medium">Address Line 2 (Optional)</Label>
            <Input
              value={addressFormData?.addressLine2}
              onChange={(e) =>
                setAddressFormData((prev) => ({ ...prev, addressLine2: e.target.value }))
              }
              placeholder="Area, Colony, Sector"
              className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
            />
          </div> */}
        </div>

        {/* City, State, Pincode */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-[#455A64] font-medium">City</Label>
            <Input
              value={addressFormData?.city}
              onChange={(e) => setAddressFormData((prev) => ({ ...prev, city: e.target.value }))}
              placeholder="Enter city"
              className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#455A64] font-medium">State</Label>
            <Input
              value={addressFormData?.state}
              onChange={(e) => setAddressFormData((prev) => ({ ...prev, state: e.target.value }))}
              placeholder="Enter state"
              className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#455A64] font-medium">Pincode</Label>
            <Input
              value={addressFormData?.pincode}
              onChange={(e) =>
                setAddressFormData((prev) => ({
                  ...prev,
                  pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                }))
              }
              placeholder="Enter pincode"
              className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
              maxLength={6}
            />
          </div>
        </div>

        {/* Landmark */}
        <div className="space-y-2">
          <Label className="text-[#455A64] font-medium">Landmark (Optional)</Label>
          <Input
            value={addressFormData?.landmark}
            onChange={(e) => setAddressFormData((prev) => ({ ...prev, landmark: e.target.value }))}
            placeholder="Nearby landmark for easy identification"
            className="border-[#4FC3F7]/30 focus:border-[#4FC3F7]"
          />
        </div>

        {/* Set as Default */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isDefault"
            checked={addressFormData?.isDefault}
            onChange={(e) => setAddressFormData((prev) => ({ ...prev, isDefault: e.target.checked }))}
            className="w-4 h-4 text-[#4FC3F7] border-gray-300 rounded focus:ring-[#4FC3F7]"
          />
          <Label htmlFor="isDefault" className="text-[#455A64] font-medium cursor-pointer">
            Set as default address
          </Label>
        </div>
      </div>

      <div className="p-6 border-t border-gray-200 flex gap-3">
        <Button
          onClick={cancelAddressForm}
          variant="outline"
          className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
        >
          Cancel
        </Button>
        <Button
          onClick={saveAddress}
          disabled={
            loading ||
            !addressFormData?.name?.trim() ||
            !addressFormData?.phone?.trim() ||
            !addressFormData?.addressline?.trim() ||
            !addressFormData?.city?.trim() ||
            !addressFormData?.state?.trim() ||
            !addressFormData?.pincode?.trim()
          }
          className="flex-1 bg-[#33BF69] hover:bg-[#4FC3F7] text-white"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : null}
          {editingAddress ? "Update Address" : "Save Address"}
        </Button>
      </div>
    </div>
  </div>
)}


              </CardContent>
            </Card>

            {/* FAQ Section - Enhanced */}
            <Card className="shadow-lg border-0 rounded-3xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-[#455A64] flex items-center gap-3">
                  <HelpCircle className="h-6 w-6" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription className="text-base">
                  Learn more about your data, privacy, and Re-verse Coins
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#F2F2F2]/50 transition-colors"
                    >
                      <span className="font-medium text-[#455A64] text-base">{faq.question}</span>
                      {expandedFAQ === index ? (
                        <ChevronUp className="h-5 w-5 text-[#4FC3F7]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-[#4FC3F7]" />
                      )}
                    </button>
                    {expandedFAQ === index && (
                      <div className="px-6 pb-4 text-gray-600 text-base leading-relaxed">{faq.answer}</div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
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
