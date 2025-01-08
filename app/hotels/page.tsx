'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface Hotel {
  id: string
  name: string
  description: string
  price: number
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])

  useEffect(() => {
    const fetchHotels = async () => {
      const response = await fetch('/api/hotels')
      if (response.ok) {
        const data = await response.json()
        setHotels(data)
      }
    }

    fetchHotels()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Available Hotels</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <Card key={hotel.id}>
            <CardHeader>
              <CardTitle>{hotel.name}</CardTitle>
              <CardDescription>${hotel.price.toFixed(2)} per night</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{hotel.description}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/hotels/${hotel.id}`}>
                <Button>View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}