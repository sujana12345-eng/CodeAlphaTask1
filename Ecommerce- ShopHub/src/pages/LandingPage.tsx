import { useNavigate } from 'react-router-dom';
import { Store, ShoppingBag, Heart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from 'zite-auth-sdk';

export default function LandingPage() {
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth();

  const handleGetStarted = () => {
    loginWithRedirect({ redirectUrl: '/home' });
  };

  const handleBrowseAsGuest = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Store className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold">ShopHub</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Your One-Stop Shop for Everything You Need
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Wide Selection</h3>
                <p className="text-sm text-muted-foreground">
                  Browse thousands of products across multiple categories
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Secure Shopping</h3>
                <p className="text-sm text-muted-foreground">
                  Safe and secure payment with buyer protection
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Easy Returns</h3>
                <p className="text-sm text-muted-foreground">
                  Hassle-free returns and excellent customer service
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="pt-8 pb-8 text-center space-y-4">
              <h2 className="text-2xl font-bold">Get Started</h2>
              <p className="text-muted-foreground">
                Sign in to unlock personalized shopping and track your orders
              </p>
              <div className="space-y-3">
                <Button size="lg" className="w-full" onClick={handleGetStarted}>
                  Login / Sign Up
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={handleBrowseAsGuest}
                >
                  Browse as Guest
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
