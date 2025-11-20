import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '../context/CartContext';
import { useAuth } from 'zite-auth-sdk';
import { createOrder } from 'zite-endpoints-sdk';
import { toast } from 'sonner';

export default function CartPage() {
  const navigate = useNavigate();
  const { user, loginWithRedirect } = useAuth();
  const { items, removeFromCart, updateQuantity, clearCart, totalAmount } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingAddress, setShippingAddress] = useState('');

  const shippingCost = totalAmount > 100 ? 0 : 10;
  const tax = totalAmount * 0.08;
  const finalTotal = totalAmount + shippingCost + tax;

  const handleCheckout = async () => {
    if (!user) {
      loginWithRedirect({ redirectUrl: window.location.href });
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!shippingAddress.trim()) {
      toast.error('Please enter a shipping address');
      return;
    }

    setLoading(true);
    try {
      const productIds = items.map((item) => String(item.product.id));
      await createOrder({
        userId: String(user.id),
        productIds,
        totalAmount: finalTotal,
      });
      
      clearCart();
      toast.success(`Order placed successfully! Payment method: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid'}`);
      navigate('/orders');
    } catch (error) {
      console.error('Failed to create order:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some products to get started
        </p>
        <Button onClick={() => navigate('/home')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => {
                const imageUrl = item.product.image?.[0]?.url || 'https://via.placeholder.com/150';
                
                return (
                  <div key={item.product.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                      <img
                        src={imageUrl}
                        alt={item.product.productName || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 truncate">
                        {item.product.productName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        ${item.product.price?.toFixed(2) || '0.00'} each
                      </p>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="font-bold text-lg">
                        ${((item.product.price || 0) * item.quantity).toFixed(2)}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter your full shipping address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Banknote className="h-5 w-5" />
                    <div>
                      <div className="font-semibold">Cash on Delivery</div>
                      <div className="text-xs text-muted-foreground">Pay when you receive</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="prepaid" id="prepaid" />
                  <Label htmlFor="prepaid" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <div className="font-semibold">Prepaid</div>
                      <div className="text-xs text-muted-foreground">Card/UPI/Net Banking</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>

              {totalAmount < 100 && (
                <p className="text-xs text-muted-foreground text-center">
                  Add ${(100 - totalAmount).toFixed(2)} more for free shipping!
                </p>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By placing order, you agree to our terms and conditions
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
