'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { addDays, format } from 'date-fns'

interface Hotel {
  id: string
  name: string
  description: string
  price: number
}

export default function HotelBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'))
  const router = useRouter()

  useEffect(() => {
    const fetchHotel = async () => {
      const response = await fetch(`/api/hotels/${id}`)
      if (response.ok) {
        const data = await response.json()
        setHotel(data)
      }
    }

    fetchHotel()
  }, [id])

  const handleBooking = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        hotelId: hotel?.id,
        startDate,
        endDate,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      // Redirect to Midtrans payment page
      window.location.href = data.paymentUrl
    } else {
      alert('Booking failed. Please try again.')
    }
  }

  if (!hotel) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>{hotel.name}</CardTitle>
          <CardDescription>${hotel.price.toFixed(2)} per night</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{hotel.description}</p>
          <div className="space-y-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Check-in Date</label>
              <Input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Check-out Date</label>
              <Input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={format(addDays(new Date(startDate), 1), 'yyyy-MM-dd')}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleBooking}>Book Now</Button>
        </CardFooter>
      </Card>
    </div>
  )
}