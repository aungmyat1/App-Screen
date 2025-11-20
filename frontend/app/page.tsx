'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  PlayIcon, 
  AppleIcon, 
  DownloadIcon, 
  StarIcon, 
  CheckIcon,
  CopyIcon
} from 'lucide-react';

const features = [
  {
    title: 'Batch Downloads',
    description: 'Download all screenshots from multiple apps at once with a simple list of URLs.',
    icon: '📋',
  },
  {
    title: 'Cross-Platform',
    description: 'Supports both the Google Play Store and the Apple App Store seamlessly.',
    icon: '🔄',
  },
  {
    title: 'High Resolution',
    description: 'Get the highest quality screenshots available on the app stores.',
    icon: '🖼️',
  },
  {
    title: 'Organized Output',
    description: 'Screenshots are neatly organized into folders named after the app.',
    icon: '📁',
  },
  {
    title: 'Developer API',
    description: 'Integrate screenshot downloading into your own services with our REST API.',
    icon: '⚙️',
  },
  {
    title: 'Flexible Input',
    description: 'Provide app names, IDs, or direct store URLs. We find the app for you.',
    icon: '🔍',
  },
];

const testimonials = [
  {
    quote: "AppScreens has been a game-changer for our ASO process. The speed and quality are unmatched. We save hours every week!",
    name: "Sarah L.",
    role: "Marketing Manager @ AppCo",
  },
  {
    quote: "The developer API is incredibly easy to use. We integrated it into our CI/CD pipeline to automate our store listing updates.",
    name: "Mike R.",
    role: "Lead iOS Developer @ MobileFirst",
  },
  {
    quote: "As a freelance designer, I need to quickly grab screenshots for mockups. This tool is simple, fast, and reliable. Highly recommended.",
    name: "Jessica P.",
    role: "UI/UX Designer",
  },
];

export default function Home() {
  const { user } = useAuth();
  const [appUrl, setAppUrl] = useState('');
  const [selectedStore, setSelectedStore] = useState<'google' | 'apple'>('google');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setError(null);
    setIsLoading(true);

    // In a real implementation, this would call the backend API
    // For now, we'll just simulate the process
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (Math.random() > 0.15) { // 85% success rate
        alert('Download started successfully!');
        setAppUrl('');
      } else {
        throw new Error('Failed to fetch screenshots from the server.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Download App Screenshots in <span className="text-primary">Seconds</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Instantly grab high-quality screenshots from any app on the Google Play Store or Apple App Store. 
            Perfect for designers, developers, and marketers.
          </p>
          
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <Label htmlFor="app-url" className="sr-only">App URL or ID</Label>
                <Input
                  id="app-url"
                  type="text"
                  value={appUrl}
                  onChange={(e) => setAppUrl(e.target.value)}
                  placeholder="Enter app name, ID, or URL..."
                  className="w-full px-4 py-6 text-lg rounded-md"
                  disabled={isLoading}
                />
              </div>
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg"
                onClick={handleDownload}
                disabled={isLoading || !appUrl}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Downloading...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <DownloadIcon className="mr-2 h-5 w-5" />
                    Download
                  </div>
                )}
              </Button>
            </div>
            {error && <p className="mt-2 text-red-500 text-left">{error}</p>}
            
            <div className="mt-4 flex justify-center gap-4">
              <Button
                variant={selectedStore === 'google' ? 'default' : 'outline'}
                onClick={() => setSelectedStore('google')}
                className="flex items-center gap-2"
              >
                <PlayIcon className="h-5 w-5" />
                Google Play
              </Button>
              <Button
                variant={selectedStore === 'apple' ? 'default' : 'outline'}
                onClick={() => setSelectedStore('apple')}
                className="flex items-center gap-2"
              >
                <AppleIcon className="h-5 w-5" />
                Apple App Store
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose AppScreens?</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Our service is packed with features designed to save you time and effort.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Trusted by Developers Worldwide</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our users are saying.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  <div className="mt-6 flex items-center">
                    <div className="ml-4">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-primary-foreground/90">
            Join thousands of developers and designers who use AppScreens to streamline their workflow.
          </p>
          <div className="mt-8">
            <Button size="lg" variant="secondary" className="mr-4">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}