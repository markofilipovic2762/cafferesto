"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/auth-modal";
import { ShoppingCart } from "@/components/shopping-cart";
import { AdminDashboard } from "@/components/admin-dashboard";
import {
  ChefHat,
  ShoppingBag,
  User,
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price_rs: number;
  image_url?: string;
  category: string;
};

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const restaurantId = searchParams.get("id");
  const brojStola = searchParams.get("brojStola");

  const [user, setUser] = useState<{ name: string; isAdmin: boolean } | null>(
    null
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [cart, setCart] = useState<
    Array<{ id: number; name: string; price: number; quantity: number }>
  >([]);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );
  const [menuData, setMenuData] = useState<[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantName, setRestaurantName] = useState("");

  useEffect(() => {
    const fetchImeRestorana = async () => {
      if (!restaurantId) return;

      const res = await fetch(
        `http://192.168.1.164:5000/restaurants/${restaurantId}`
      );
      const data = await res.json();

      setRestaurantName(data.name);
    };
    fetchImeRestorana();
  }, [restaurantId]);

  // Fetch menija sa backend-a
  useEffect(() => {
    if (!restaurantId) return;

    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://192.168.1.164:5000/menu/${restaurantId}`
        );
        const data = await res.json();

        setMenuData(data);

        if (brojStola) {
          localStorage.setItem("brojStola", brojStola);
        }
      } catch (err) {
        console.error("Greška pri fetchovanju menija:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  console.log("Menu data:", menuData);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const addToCart = (item: { id: number; name: string; price_rs: number }) => {
    setCart((prev: any[]) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleLogin = (name: string, isAdmin: boolean) => {
    setUser({ name, isAdmin });
    setShowAuthModal(false);
    if (isAdmin) {
      setShowAdminDashboard(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setShowAdminDashboard(false);
    setCart([]);
  };

  if (showAdminDashboard && user?.isAdmin) {
    return <AdminDashboard onBack={() => setShowAdminDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2 ml-8">
            <ChefHat className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Restoran</h1>
          </div>

          <div className="flex items-center space-x-4">
            {cart.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCart(true)}
                className="relative"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Korpa
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              </Button>
            )}

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm">Zdravo, {user.name}!</span>
                {user.isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdminDashboard(true)}
                  >
                    Admin Panel
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button className="mr-4" onClick={() => setShowAuthModal(true)}>
                <User className="h-4 w-4" />
                Prijavi se
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-2 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">
            Dobrodošli u restoran {restaurantName}
          </h2>
          <p className="text-muted-foreground">
            {brojStola && `Sto broj ${brojStola}`} – izaberite iz našeg menija
          </p>
        </div>

        {/* Menu Categories */}
        {loading ? (
          <p>Učitavanje menija...</p>
        ) : (
          <div className="space-y-6">
            {menuData.map((item: any) => {
              const isOpen = openCategories[item.name];
              return (
                <div key={item.id}>
                  <button
                    onClick={() => toggleCategory(item.name)}
                    className="flex items-center justify-between w-full text-2xl font-semibold mb-2 text-primary hover:underline"
                  >
                    {item.name}
                    {isOpen ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {isOpen ? null : <hr />}

                  {isOpen && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {item.items.map((item: any) => (
                        <Card
                          key={item.id}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">
                                {item.name}
                              </CardTitle>
                              <Badge variant="secondary" className="ml-2">
                                {item.price_rs} RSD
                              </Badge>
                            </div>
                            <CardDescription>
                              {item.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="mb-3">
                              <div className="w-full h-40 bg-muted flex items-center justify-center rounded-md">
                                {item.image_url ? (
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="object-cover w-full h-full rounded-md"
                                  />
                                ) : (
                                  <span>Nema slike</span>
                                )}
                              </div>
                            </div>
                            <Button
                              onClick={() => addToCart(item)}
                              className="w-full"
                            >
                              Dodaj u korpu
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modals */}
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />

      <ShoppingCart
        open={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        totalPrice={getTotalPrice()}
        user={user}
        onLogin={() => {
          setShowCart(false);
          setShowAuthModal(true);
        }}
      />
    </div>
  );
}
