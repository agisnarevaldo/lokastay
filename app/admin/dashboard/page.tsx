'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Trash2, Plus } from 'lucide-react'

interface Hotel {
  id: string
  name: string
  description: string
  price: number
}

export default function AdminDashboard() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchHotels = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const response = await fetch('/api/admin/hotels', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setHotels(data)
        } else {
          throw new Error('Failed to fetch hotels')
        }
      } catch (error) {
        console.error('Error:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHotels()
  }, [router])

  const deleteHotel = async (id: string) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/hotels/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        setHotels(hotels.filter(hotel => hotel.id !== id))
      } else {
        alert('Failed to delete hotel')
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hotel Management</h1>
        <Link href="/admin/hotels/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Hotel
          </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hotels.map((hotel) => (
            <TableRow key={hotel.id}>
              <TableCell className="font-medium">{hotel.name}</TableCell>
              <TableCell>{hotel.description.substring(0, 100)}...</TableCell>
              <TableCell>${hotel.price.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/admin/hotels/${hotel.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => deleteHotel(hotel.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}