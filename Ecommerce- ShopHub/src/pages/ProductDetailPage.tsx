import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getProductById } from 'zite-endpoints-sdk';
import { GetProductsOutputType } from 'zite-endpoints-sdk';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

type ProductType = GetProductsOutputType['products'][0];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const result = await getProductById({ productId: id });
        setProduct(result);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success('Added to cart!');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-24 mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Product not found</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Back to Home
        </Button>
      </div>
    );
  }

  const imageUrl = product.image?.[0]?.url || 'https://via.placeholder.com/600';

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          <img
            src={imageUrl}
            alt={product.productName || 'Product'}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {product.productName || 'Untitled Product'}
            </h1>
            {product.category && (
              <Badge variant="secondary">{product.category}</Badge>
            )}
          </div>

          <div className="text-4xl font-bold text-primary">
            ${product.price?.toFixed(2) || '0.00'}
          </div>

          <div>
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">
              {product.description || 'No description available'}
            </p>
          </div>

          {product.stockQuantity !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4" />
              <span>
                {product.stockQuantity > 0
                  ? `${product.stockQuantity} in stock`
                  : 'Out of stock'}
              </span>
            </div>
          )}

          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className="w-full md:w-auto"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
