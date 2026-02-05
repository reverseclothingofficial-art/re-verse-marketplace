"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Coins, TrendingUp, TrendingDown, RefreshCw, AlertTriangle, Sparkles, Gift, Trophy, Star } from "lucide-react"
import Navbar from "@/components/navbar"
import { useCookieContext } from "@/context/cookieContext"

interface CoinTransaction {
  _id: string
  user: string
  coinsUsed: number
  rupeeValue: number
  transactionType: "debit" | "credit"
  description: string
  createdAt: string
  updatedAt: string
}

interface CoinTransactionsResponse {
  totalTransactions: number
  page: number
  limit: number
  totalPages: number
  transactions: CoinTransaction[]
}

export default function CoinsPage() {
  const [transactions, setTransactions] = useState<CoinTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [availableCoins, setAvailableCoins] = useState(0) // Mock data - should come from API
  const { cookieValue } = useCookieContext()

  const [userdata, setuserdata] = useState<any>()
  const api = process.env.NEXT_PUBLIC_API_URL

  // 1. Memoize userProfile to avoid recreation on every render
//   const { cookieValue } = useCookieContext()
//   const api = process.env.NEXT_PUBLIC_API_URL

//   const [userdata, setuserdata] = useState<any>()
//   const [availableCoins, setAvailableCoins] = useState<number>(0)
//   const [transactions, setTransactions] = useState<any[]>([])
//   const [loading, setLoading] = useState<boolean>(false)
//   const [loadingMore, setLoadingMore] = useState<boolean>(false)
//   const [page, setPage] = useState<number>(1)
//   const [hasMore, setHasMore] = useState<boolean>(true)
//   const [totalTransactions, setTotalTransactions] = useState<number>(0)
//   const [error, setError] = useState<string | null>(null)

  // Fetch user profile and available coins
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
      setAvailableCoins(data.reversePoints)
    } catch (err) {
      console.log(err)
    }
  }, [api, cookieValue])

  useEffect(() => {
    if (cookieValue) {
      userProfile()
    }
  }, [userProfile, cookieValue])

  // Fetch coin transactions paginated
  const fetchTransactions = useCallback(
    async (pageNum: number, isLoadMore = false) => {
      if (!cookieValue) return
      try {
        if (!isLoadMore) setLoading(true)
        else setLoadingMore(true)

        const response = await fetch(
          `${api}/api/coin/transactions?page=${pageNum}&limit=10`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookieValue}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch transactions")
        }

        const data = await response.json()

        if (isLoadMore) {
          setTransactions((prev) => [...prev, ...data.transactions])
        } else {
          setTransactions(data.transactions)
        }

        setTotalTransactions(data.totalTransactions)
        setHasMore(pageNum < data.totalPages)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [api, cookieValue]
  )

  // Fetch transactions on first load or when cookieValue changes
  useEffect(() => {
    if (cookieValue) {
      setPage(1)
      fetchTransactions(1)
    }
    // eslint-disable-next-line
  }, [fetchTransactions, cookieValue])

  // Load more handler
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchTransactions(nextPage, true)
    }
  }

  // Refresh handler
  const handleRefresh = () => {
    setPage(1)
    setTransactions([])
    fetchTransactions(1)
  }

  // Date formatting
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTransactionIcon = (type: "debit" | "credit") => {
    return type === "credit" ? (
      <div className="p-2 rounded-full bg-gradient-to-br from-reverse-green/20 to-reverse-blue/20 border border-reverse-green/30">
        <TrendingUp className="h-4 w-4 text-reverse-green" />
      </div>
    ) : (
      <div className="p-2 rounded-full bg-gradient-to-br from-reverse-coral/20 to-red-100 border border-reverse-coral/30">
        <TrendingDown className="h-4 w-4 text-reverse-coral" />
      </div>
    )
  }

  const getTransactionColor = (type: "debit" | "credit") => {
    return type === "credit" ? "text-reverse-green" : "text-reverse-coral"
  }

  if (loading && transactions.length === 0) {
    return (
      <>
        <Navbar isLoggedIn={true} variant="floating" />
        <div className="min-h-screen bg-gradient-to-br from-reverse-gray via-white to-reverse-blue/5">
          <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="space-y-8">
              {/* Header Skeleton */}
              <div className="text-center space-y-4">
                <Skeleton className="h-12 w-64 mx-auto rounded-2xl" />
                <Skeleton className="h-5 w-80 mx-auto rounded-full" />
              </div>

              {/* Balance Card Skeleton */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-reverse-blue/10 to-reverse-green/10">
                  <Skeleton className="h-7 w-48 rounded-xl" />
                </CardHeader>
                <CardContent className="space-y-6 pt-8">
                  <Skeleton className="h-16 w-48 rounded-2xl" />
                  <Skeleton className="h-5 w-64 rounded-full" />
                </CardContent>
              </Card>

              {/* Alerts Skeleton */}
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
              </div>

              {/* Transactions Skeleton */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-reverse-primary/5 to-reverse-blue/5">
                  <Skeleton className="h-7 w-48 rounded-xl" />
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-6 bg-gradient-to-r from-reverse-gray/30 to-white rounded-2xl border border-reverse-primary/10"
                    >
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-3">
                          <Skeleton className="h-5 w-40 rounded-full" />
                          <Skeleton className="h-4 w-32 rounded-full" />
                        </div>
                      </div>
                      <div className="text-right space-y-3">
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-4 w-16 rounded-full" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar isLoggedIn={cookieValue?true:false} variant="floating" userdata={userdata} />
      <div className="min-h-screen bg-gradient-to-br from-reverse-gray via-white to-reverse-blue/5">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4 animate-in slide-in-from-top-4 duration-1000">
              <div className="relative inline-block">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-reverse-primary via-reverse-blue to-reverse-green bg-clip-text text-transparent">
                  Re-verse Coins
                </h1>
                <div className="absolute -inset-2 bg-gradient-to-r from-reverse-blue/20 via-reverse-green/20 to-reverse-coral/20 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
              </div>
              <p className="text-reverse-primary/70 text-lg max-w-2xl mx-auto">
                Manage your sustainable rewards and view your eco-friendly transaction history
              </p>
            </div>

            {/* Available Balance Card */}
            <Card className="overflow-hidden border-0 shadow-2xl hover-lift-smooth animate-in slide-in-from-bottom-4 duration-1000 delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-reverse-blue via-reverse-green to-reverse-coral opacity-10"></div>
              <CardHeader className="relative bg-gradient-to-r from-reverse-blue/10 via-reverse-green/10 to-reverse-coral/10 backdrop-blur-sm border-b border-white/20">
                <CardTitle className="flex items-center gap-3 text-reverse-primary text-xl">
                  <div className="relative">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-reverse-blue to-reverse-green shadow-lg">
                      <Coins className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-reverse-blue to-reverse-green rounded-2xl blur opacity-40 animate-pulse"></div>
                  </div>
                  Available Balance
                  <Sparkles className="h-5 w-5 text-reverse-coral animate-pulse" />
                </CardTitle>
              </CardHeader>
              <CardContent className="relative pt-8 pb-8">
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-reverse-blue to-reverse-green bg-clip-text text-transparent">
                      {availableCoins?.toLocaleString()}
                    </span>
                    <span className="text-2xl font-semibold text-reverse-primary/70">Coins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gradient-to-r from-reverse-green to-reverse-blue text-white border-0 px-4 py-2 text-sm font-semibold">
                      ₹{(availableCoins * 0.1).toFixed(2)} Value
                    </Badge>
                    <Badge variant="outline" className="border-reverse-coral text-reverse-coral px-4 py-2">
                      <Trophy className="h-3 w-3 mr-1" />
                      Eco Warrior
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Information */}
            <div className="grid gap-4 md:grid-cols-2 animate-in slide-in-from-bottom-4 duration-1000 delay-300">
              <Alert className="border-0 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg hover-lift-smooth">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
                    <AlertTriangle className="h-4 w-4 text-white" />
                  </div>
                  <AlertDescription className="text-amber-800 font-medium">
                    <strong className="text-amber-900">Important Notice:</strong>
                    <br />
                    Re-verse Coins once used cannot be refunded upon cancellation or return of orders.
                  </AlertDescription>
                </div>
              </Alert>

              <Alert className="border-0 bg-gradient-to-r from-reverse-green/10 to-reverse-blue/10 shadow-lg hover-lift-smooth">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-reverse-green to-reverse-blue shadow-md">
                    <Gift className="h-4 w-4 text-white" />
                  </div>
                  <AlertDescription className="text-reverse-primary font-medium">
                    <strong className="text-reverse-primary">Earn More Coins:</strong>
                    <br />
                    Get 10% of your total order value as Re-verse Coins upon successful completion.
                  </AlertDescription>
                </div>
              </Alert>
            </div>

            {/* Transaction History */}
            <Card className="overflow-hidden border-0 shadow-2xl animate-in slide-in-from-bottom-4 duration-1000 delay-400">
              <CardHeader className="bg-gradient-to-r from-reverse-primary/5 via-reverse-blue/5 to-reverse-green/5 backdrop-blur-sm border-b border-white/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-3 text-reverse-primary text-xl">
                    <Star className="h-5 w-5 text-reverse-coral" />
                    Transaction History
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={loading}
                    className="border-reverse-blue text-reverse-blue hover:bg-reverse-blue hover:text-white transition-all duration-300 rounded-full px-6 bg-transparent"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {error ? (
                  <div className="text-center py-12 px-6">
                    <div className="p-4 rounded-full bg-reverse-coral/10 w-fit mx-auto mb-4">
                      <AlertTriangle className="h-8 w-8 text-reverse-coral" />
                    </div>
                    <p className="text-reverse-coral mb-6 font-medium">{error}</p>
                    <Button
                      onClick={handleRefresh}
                      className="bg-gradient-to-r from-reverse-blue to-reverse-green text-white border-0 hover:shadow-lg transition-all duration-300 rounded-full px-8"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-12 px-6">
                    <div className="p-6 rounded-full bg-gradient-to-br from-reverse-blue/10 to-reverse-green/10 w-fit mx-auto mb-6">
                      <Coins className="h-12 w-12 text-reverse-primary/50" />
                    </div>
                    <p className="text-reverse-primary/70 text-lg">No transactions found</p>
                    <p className="text-reverse-primary/50 text-sm mt-2">
                      Start shopping to earn your first Re-verse Coins!
                    </p>
                  </div>
                ) : (
                  <div className="p-6 space-y-4">
                    {transactions.map((transaction, index) => (
                      <div key={transaction._id}>
                        <div className="group flex items-center justify-between p-6 hover:bg-gradient-to-r hover:from-reverse-gray/30 hover:to-white rounded-2xl transition-all duration-300 hover:shadow-lg border border-transparent hover:border-reverse-primary/10">
                          <div className="flex items-center space-x-4">
                            {getTransactionIcon(transaction.transactionType)}
                            <div className="space-y-2">
                              <p className="font-semibold text-reverse-primary text-sm sm:text-base group-hover:text-reverse-blue transition-colors duration-300">
                                {transaction.description ||
                                  (transaction.transactionType === "credit"
                                    ? "Coins Earned from Purchase"
                                    : "Coins Redeemed")}
                              </p>
                              <p className="text-xs sm:text-sm text-reverse-primary/60 font-medium">
                                {formatDate(transaction.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <p
                              className={`font-bold text-sm sm:text-base ${getTransactionColor(transaction.transactionType)}`}
                            >
                              {transaction.transactionType === "credit" ? "+" : "-"}
                              {transaction.coinsUsed.toLocaleString()} Coins
                            </p>
                            <Badge
                              variant="outline"
                              className={`text-xs ${transaction.transactionType === "credit" ? "border-reverse-green text-reverse-green" : "border-reverse-coral text-reverse-coral"}`}
                            >
                              ₹{transaction.rupeeValue.toFixed(2)}
                            </Badge>
                          </div>
                        </div>
                        {index < transactions.length - 1 && <Separator className="my-2 bg-reverse-primary/10" />}
                      </div>
                    ))}

                    {/* Load More Button */}
                    {hasMore && (
                      <div className="text-center pt-6">
                        <Button
                          onClick={handleLoadMore}
                          disabled={loadingMore}
                          className="w-full sm:w-auto bg-gradient-to-r from-reverse-blue to-reverse-green text-white border-0 hover:shadow-xl transition-all duration-300 rounded-full px-8 py-3"
                        >
                          {loadingMore ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Loading More...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Load More Transactions
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {/* Transaction Summary */}
                    <div className="pt-6 border-t border-reverse-primary/10">
                      <div className="text-center">
                        <Badge className="bg-gradient-to-r from-reverse-primary to-reverse-blue text-white border-0 px-6 py-2">
                          Showing {transactions.length} of {totalTransactions.toLocaleString()} transactions
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conversion Info */}
            <Card className="overflow-hidden border-0 bg-gradient-to-r from-reverse-gray/50 via-white to-reverse-blue/5 shadow-xl animate-in slide-in-from-bottom-4 duration-1000 delay-500">
              <CardContent className="pt-8 pb-8">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-2">
                    <div className="p-2 rounded-full bg-gradient-to-br from-reverse-coral to-reverse-blue">
                      <Coins className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-reverse-primary">Conversion Rates</h3>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <Badge className="bg-gradient-to-r from-reverse-blue to-reverse-green text-white border-0 px-6 py-3 text-sm font-semibold rounded-full">
                      1 Re-verse Coin = ₹0.10
                    </Badge>
                    <span className="text-reverse-primary/50">•</span>
                    <Badge className="bg-gradient-to-r from-reverse-green to-reverse-coral text-white border-0 px-6 py-3 text-sm font-semibold rounded-full">
                      10 Coins = ₹1.00
                    </Badge>
                    <span className="text-reverse-primary/50">•</span>
                    <Badge className="bg-gradient-to-r from-reverse-coral to-reverse-blue text-white border-0 px-6 py-3 text-sm font-semibold rounded-full">
                      100 Coins = ₹10.00
                    </Badge>
                  </div>
                  <p className="text-reverse-primary/60 text-sm max-w-2xl mx-auto">
                    Every purchase contributes to a sustainable future while rewarding you with Re-verse Coins
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
