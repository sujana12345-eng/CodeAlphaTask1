import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GetProductsOutputType } from 'zite-endpoints-sdk';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

type ProductType = GetProductsOutputType['products'][0];

type ProductCardProps = {
  product: ProductType;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success('Added to cart!');
  };

  const imageUrl = product.image?.[0]?.url || 'https://via.placeholder.com/300';

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
            <img
              src={imageUrl}
              alt={product.productName || 'Product'}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold line-clamp-2">
                {product.productName || 'Untitled Product'}
              </h3>
              {product.category && (
                <Badge variant="secondary" className="shrink-0">
                  {product.category}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description || 'No description available'}
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <span className="text-2xl font-bold">
            ${product.price?.toFixed(2) || '0.00'}
          </span>
          <Button size="sm" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
