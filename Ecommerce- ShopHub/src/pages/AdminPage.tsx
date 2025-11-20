import { useState } from 'react';
import { Database, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { seedProducts } from 'zite-endpoints-sdk';
import { toast } from 'sonner';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);

  const handleSeedData = async () => {
    setLoading(true);
    try {
      const result = await seedProducts({});
      toast.success(`Successfully added ${result.count} products!`);
    } catch (error) {
      console.error('Failed to seed data:', error);
      toast.error('Failed to seed products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Setup
          </CardTitle>
          <CardDescription>
            Populate your store with 60 sample products across Electronics, Clothing, and Home categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleSeedData} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding Products...
              </>
            ) : (
              'Seed Database'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
