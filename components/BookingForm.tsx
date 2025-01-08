'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BookingForm({ hotelId, rooms }: { hotelId: string, rooms: any[] }) {
  const [roomId, setRoomId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'user-id', // Replace with actual user ID from authentication
        roomId,
        startDate,
        endDate,
        totalPrice: calculateTotalPrice(),
      }),
    })

    const data = await response.json()
    
    // Redirect to Midtrans payment page
    router.push(data.paymentUrl)
  }

  const calculateTotalPrice = () => {
    const room = rooms.find(r => r.id === roomId)
    if (!room) return 0
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    const nights = (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
    
    return room.price * nights
  }

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Book a Room</h3>
      <div className="mb-4">
        <label htmlFor="room" className="block text-gray-700 mb-2">Select Room</label>
        <select
          id="room"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              Room {room.number} - {room.type} (${room.price}/night)
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="startDate" className="block text-gray-700 mb-2">Check-in Date</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="endDate" className="block text-gray-700 mb-2">Check-out Date</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Book Now
      </button>
    </form>
  )
}