import { Link } from 'react-router-dom';
import { ShoppingCart, Package, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '../context/CartContext';
import { useAuth } from 'zite-auth-sdk';

export default function Header() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Store className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">ShopHub</span>
        </Link>

        <nav className="flex items-center gap-4">
          {user && (
            <Link to="/orders">
              <Button variant="ghost" size="sm">
                <Package className="h-4 w-4 mr-2" />
                Orders
              </Button>
            </Link>
          )}
          
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="sm">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {itemCount > 0 && (
                <Badge className="ml-2 px-1.5 py-0.5 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {user ? (
            <Button variant="outline" size="sm" onClick={() => logout()}>
              Logout
            </Button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
