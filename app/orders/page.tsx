"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import LoadingSpinner from "@/components/loading-spinner"

interface OrderItem {
  id: number
  productName: string
  brandName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

interface Order {
  id: number
  items: OrderItem[]
  totalAmount: number
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  whatsappNumber: string
  deliveryAddress: string
  customerNotes?: string
  createdAt: string
  updatedAt: string
}

const statusConfig = {
  PENDING: { icon: Clock, color: "bg-yellow-500", label: "Pending" },
  CONFIRMED: { icon: CheckCircle, color: "bg-blue-500", label: "Confirmed" },
  SHIPPED: { icon: Truck, color: "bg-purple-500", label: "Shipped" },
  DELIVERED: { icon: Package, color: "bg-green-500", label: "Delivered" },
  CANCELLED: { icon: XCircle, color: "bg-red-500", label: "Cancelled" },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user && token) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [user, token])

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get("/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setOrders(response.data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your orders</p>
        <Button asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
      </div>
    )
  }

  if (loading) return <LoadingSpinner />

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-muted-foreground mb-6">
          You haven't placed any orders yet. Start shopping to see your orders here.
        </p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          {orders.length} order{orders.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const StatusIcon = statusConfig[order.status].icon

          return (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <Badge className={`${statusConfig[order.status].color} text-white`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig[order.status].label}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Total: ${order.totalAmount.toFixed(2)}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Items ({order.items.length})</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">{item.brandName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${item.subtotal.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × ${item.unitPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-1">Delivery Address</h4>
                    <p className="text-muted-foreground">{order.deliveryAddress}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">WhatsApp Number</h4>
                    <p className="text-muted-foreground">{order.whatsappNumber}</p>
                  </div>
                </div>

                {order.customerNotes && (
                  <div className="text-sm">
                    <h4 className="font-medium mb-1">Order Notes</h4>
                    <p className="text-muted-foreground">{order.customerNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
