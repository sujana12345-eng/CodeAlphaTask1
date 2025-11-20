import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  text: string;
  isBot: boolean;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hi! I\'m your ShopHub assistant. How can I help you today?', isBot: true },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    
    setTimeout(() => {
      const response = getBotResponse(userMessage.toLowerCase());
      setMessages((prev) => [...prev, { text: response, isBot: true }]);
    }, 500);

    setInput('');
  };

  const getBotResponse = (query: string): string => {
    if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
      return 'Hello! Welcome to ShopHub. How can I assist you today?';
    }
    
    if (query.includes('product') || query.includes('item') || query.includes('find')) {
      return 'You can browse our products by category: Electronics, Clothing, Home, Accessories, and Health. Use the search bar to find specific items!';
    }
    
    if (query.includes('order') || query.includes('track')) {
      return 'To track your orders, please login and visit the Orders page from the navigation menu. You can see all your order history and current status there.';
    }
    
    if (query.includes('return') || query.includes('refund') || query.includes('exchange')) {
      return 'We offer easy returns within 30 days of purchase. Please contact our support team at support@shophub.com with your order number for assistance.';
    }
    
    if (query.includes('payment') || query.includes('pay') || query.includes('cod') || query.includes('prepaid')) {
      return 'We accept two payment methods:\n• Cash on Delivery (COD) - Pay when you receive\n• Prepaid - Card, UPI, or Net Banking\nYou can choose your preferred method at checkout.';
    }
    
    if (query.includes('shipping') || query.includes('delivery') || query.includes('ship')) {
      return 'Standard delivery takes 3-5 business days. FREE shipping on orders over $100! Express delivery available for select items.';
    }
    
    if (query.includes('account') || query.includes('login') || query.includes('signup') || query.includes('register')) {
      return 'You can create an account or login by clicking the "Login / Sign Up" button. This allows you to track orders and save your preferences.';
    }
    
    if (query.includes('cart') || query.includes('checkout')) {
      return 'Click the cart icon in the navigation to view your items. At checkout, you\'ll need to provide a shipping address and choose your payment method.';
    }
    
    if (query.includes('price') || query.includes('cost') || query.includes('how much')) {
      return 'Our products range from budget-friendly to premium options. You can filter by category to find items in your price range. All prices are displayed on product cards.';
    }
    
    if (query.includes('contact') || query.includes('support') || query.includes('help')) {
      return 'Need more help? Contact us:\n📧 Email: support@shophub.com\n📞 Phone: 1-800-SHOPHUB\n⏰ Hours: Mon-Fri 9AM-6PM';
    }
    
    if (query.includes('category') || query.includes('categories')) {
      return 'We have 5 main categories:\n• Electronics - Tech gadgets and accessories\n• Clothing - Fashion and apparel\n• Home - Kitchen, bedding, and decor\n• Accessories - Wallets, bags, jewelry\n• Health - Fitness and wellness products';
    }
    
    if (query.includes('thank')) {
      return 'You\'re welcome! Happy shopping! 😊';
    }
    
    return 'I\'m here to help! You can ask me about:\n• Products and categories\n• Orders and tracking\n• Payment methods\n• Shipping and delivery\n• Returns and refunds\n• Account help\n\nWhat would you like to know?';
  };

  return (
    <>
      {!isOpen && (
        <Button
          size="lg"
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-[500px] shadow-2xl flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">ShopHub Support</h3>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary-foreground/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                      msg.isBot
                        ? 'bg-muted text-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question..."
              className="flex-1"
            />
            <Button size="sm" onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
