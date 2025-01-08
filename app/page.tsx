import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Hotel, CreditCard, Clock } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Stay with LokaStay</h1>
          <p className="text-xl mb-8">Discover amazing hotels and book your dream vacation today.</p>
          <Link href="/hotels">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Browse Hotels
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose LokaStay?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Search className="h-10 w-10 text-blue-600" />}
              title="Easy Search"
              description="Find the perfect hotel with our powerful search tools."
            />
            <FeatureCard
              icon={<Hotel className="h-10 w-10 text-blue-600" />}
              title="Wide Selection"
              description="Choose from thousands of hotels worldwide."
            />
            <FeatureCard
              icon={<CreditCard className="h-10 w-10 text-blue-600" />}
              title="Secure Booking"
              description="Book with confidence using our secure payment system."
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-blue-600" />}
              title="24/7 Support"
              description="Our customer support team is always here to help."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Stay?</h2>
          <p className="text-xl mb-8">Join thousands of happy travelers who have found their ideal accommodations with LokaStay.</p>
          <Link href="/register">
            <Button size="lg">Sign Up Now</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon}
          <span className="ml-4">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}