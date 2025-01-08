'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Booking {
  id: string
  userId: string
  roomId: string
  startDate: string
  endDate: string
  totalPrice: number
  status: string
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifyTokenAndFetchBookings = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const verifyResponse = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        const verifyData = await verifyResponse.json()

        if (!verifyData.isAuthenticated || !verifyData.isAdmin) {
          router.push('/login')
          return
        }

        const bookingsResponse = await fetch('/api/admin/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error:', error)
        router.push('/login')
      }
    }

    verifyTokenAndFetchBookings()
  }, [router])

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`/api/admin/bookings/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    })

    if (response.ok) {
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ))
    } else {
      alert('Failed to update booking status')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>User ID</TableHead>
                {/* <TableHead>Room ID</TableHead> */}
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.userId}</TableCell>
                  {/* <TableCell>{booking.roomId}</TableCell> */}
                  <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(booking.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>${booking.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                  <TableCell>
                    <Select
                      onValueChange={(value) => updateBookingStatus(booking.id, value)}
                      defaultValue={booking.status}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}