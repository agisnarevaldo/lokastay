import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import * as jwt from 'jsonwebtoken'
import midtransClient from 'midtrans-client'

const prisma = new PrismaClient()

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
})

export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.split(' ')[1]
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload
    const userId = decoded.userId

    const body = await request.json()
    const { hotelId, startDate, endDate } = body

    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } })
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const nights = (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
    const totalPrice = hotel.price * nights

    const booking = await prisma.booking.create({
      data: {
        userId,
        hotelId,
        startDate: start,
        endDate: end,
        totalPrice,
        status: 'PENDING',
      },
    })

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: booking.id,
        gross_amount: totalPrice,
      },
      credit_card: {
        secure: true,
      },
    })

    return NextResponse.json({
      booking,
      paymentToken: transaction.token,
      paymentUrl: transaction.redirect_url,
    })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}