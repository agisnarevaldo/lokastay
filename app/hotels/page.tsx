'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Search } from 'lucide-react'

interface Hotel {
  id: string
  name: string
  description: string
  price: number
  address: string
  image: string | null
}

const defaultImage = '/placeholder.svg?height=200&width=300'

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])

  useEffect(() => {
    const fetchHotels = async () => {
      const response = await fetch('/api/hotels')
      if (response.ok) {
        const data = await response.json()
        setHotels(data)
        setFilteredHotels(data)
      }
    }

    fetchHotels()
  }, [])

  useEffect(() => {
    const results = hotels.filter(hotel =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredHotels(results)
  }, [searchTerm, hotels])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Available Hotels</h1>
      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search hotels by name or address"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <Card key={hotel.id} className="flex flex-col">
            <div className="relative h-48 w-full">
              <Image
                src={hotel.image || defaultImage}
                alt={hotel.name}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-t-lg"
              />
            </div>
            <CardHeader>
              <CardTitle>{hotel.name}</CardTitle>
              <CardDescription>${hotel.price.toFixed(2)} per night</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-600 mb-2">{hotel.address}</p>
              <p className="text-sm">{hotel.description.substring(0, 100)}...</p>
            </CardContent>
            <CardFooter>
              <Link href={`/hotels/${hotel.id}`} className="w-full">
                <Button className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      {filteredHotels.length === 0 && (
        <p className="text-center text-gray-600 mt-6">No hotels found matching your search criteria.</p>
      )}
    </div>
  )
}