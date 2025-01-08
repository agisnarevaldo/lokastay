'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Hotel {
  id: string
  name: string
  address: string
}

export default function AdminHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([])

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    const response = await fetch('/api/admin/hotels')
    const data = await response.json()
    setHotels(data)
  }

  const deleteHotel = async (id: string) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
      const response = await fetch(`/api/admin/hotels/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchHotels()
      } else {
        alert('Failed to delete hotel')
      }
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Hotel Management</h1>
      <Link href="/admin/hotels/new">
        <Button className="mb-5">Add New Hotel</Button>
      </Link>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hotels.map((hotel) => (
            <TableRow key={hotel.id}>
              <TableCell>{hotel.name}</TableCell>
              <TableCell>{hotel.address}</TableCell>
              <TableCell>
                <Link href={`/admin/hotels/${hotel.id}/edit`}>
                  <Button variant="outline" className="mr-2">Edit</Button>
                </Link>
                <Button variant="destructive" onClick={() => deleteHotel(hotel.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}