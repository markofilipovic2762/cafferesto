"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Clock, Calendar, User, DollarSign } from "lucide-react";

// Mock data za porudžbine
const mockOrders = [
  {
    id: 1,
    customerName: "Marko Petrović",
    items: [
      { name: "Pasta Carbonara", quantity: 1, price: 1200 },
      { name: "Tiramisu", quantity: 2, price: 650 },
    ],
    total: 2500,
    date: "2024-01-15",
    time: "14:30",
    status: "completed",
  },
  {
    id: 2,
    customerName: "Ana Jovanović",
    items: [
      { name: "Biftek na žaru", quantity: 1, price: 1800 },
      { name: "Cappuccino", quantity: 1, price: 220 },
    ],
    total: 2020,
    date: "2024-01-15",
    time: "15:45",
    status: "pending",
  },
  {
    id: 3,
    customerName: "Stefan Nikolić",
    items: [
      { name: "Bruschetta", quantity: 2, price: 450 },
      { name: "Rižoto sa gljivama", quantity: 1, price: 1100 },
      { name: "Panna Cotta", quantity: 1, price: 550 },
    ],
    total: 2550,
    date: "2024-01-14",
    time: "19:20",
    status: "completed",
  },
];

interface AdminDashboardProps {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [selectedOrder, setSelectedOrder] = useState<
    (typeof mockOrders)[0] | null
  >(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Završeno";
      case "pending":
        return "U toku";
      default:
        return "Nepoznato";
    }
  };

  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
  const todayOrders = mockOrders.filter((order) => order.date === "2024-01-15");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Nazad
          </Button>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ukupan prihod
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue} RSD</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ukupno porudžbina
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockOrders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Danas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayOrders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">U toku</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  mockOrders.filter((order) => order.status === "pending")
                    .length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Porudžbine</CardTitle>
            <CardDescription>
              Lista svih porudžbina sa detaljima
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          Porudžbina #{order.id}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">{order.total} RSD</p>
                    <p className="text-sm text-muted-foreground">
                      {order.date} u {order.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Order Details Modal */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalji porudžbine #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Kompletne informacije o porudžbini
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Kupac</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {getStatusText(selectedOrder.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Datum</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.date}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Vreme</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.time}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Stavke</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-muted rounded"
                    >
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm">
                        {item.quantity}x {item.price} RSD
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-medium">Ukupno:</span>
                <span className="font-bold text-lg">
                  {selectedOrder.total} RSD
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
