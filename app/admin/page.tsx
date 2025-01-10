'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Trash2 } from 'lucide-react'

interface Hotel {
  id: string
  name: string
  address: string
  description: string
}

export default function AdminHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('/api/admin/hotels');
        if (response.ok) {
          const data = await response.json();
          setHotels(data);
        } else {
          console.error('Failed to fetch hotels');
          alert('Failed to fetch hotels. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
        alert('An error occurred while fetching hotels');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const deleteHotel = async (id: string) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
      try {
        const response = await fetch(`/api/admin/hotels/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setHotels(hotels.filter(hotel => hotel.id !== id));
        } else {
          const errorData = await response.json();
          console.error('Failed to delete hotel:', errorData);
          alert(`Failed to delete hotel: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting hotel:', error);
        alert('An error occurred while deleting the hotel');
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Hotels</h1>
        <Link href="/admin/hotels/new">
          <Button>Add New Hotel</Button>
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotels.map((hotel) => (
              <TableRow key={hotel.id}>
                <TableCell className="font-medium">{hotel.name}</TableCell>
                <TableCell>{hotel.address}</TableCell>
                <TableCell>{hotel.description.substring(0, 100)}...</TableCell>
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
    </div>
  )
}