import { useState, useEffect } from 'react';
import { Package, Clock, Truck, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserOrders, GetUserOrdersOutputType } from 'zite-endpoints-sdk';
import { useAuth } from 'zite-auth-sdk';

type OrderType = GetUserOrdersOutputType['orders'][0];

const statusIcons = {
  Pending: Clock,
  Shipped: Truck,
  Delivered: CheckCircle,
};

const statusColors = {
  Pending: 'bg-yellow-500',
  Shipped: 'bg-blue-500',
  Delivered: 'bg-green-500',
};

export default function OrdersPage() {
  const { user, loginWithRedirect, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      loginWithRedirect({ redirectUrl: window.location.href });
      return;
    }

    const fetchOrders = async () => {
      
      setLoading(true);
      try {
        const result = await getUserOrders({ userId: user.id });
        setOrders(result.orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading, loginWithRedirect]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
        <p className="text-muted-foreground">
          Your order history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = order.orderStatus || 'Pending';
          const StatusIcon = statusIcons[status as keyof typeof statusIcons] || Clock;
          const statusColor = statusColors[status as keyof typeof statusColors] || 'bg-gray-500';

          return (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Order #{order.orderId}
                  </CardTitle>
                  <Badge className={statusColor}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold">
                      ${order.totalAmount?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  
                  {Array.isArray(order.product) && (
                    <div className="text-sm text-muted-foreground">
                      {order.product.length} item{order.product.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
