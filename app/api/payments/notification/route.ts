import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import midtransClient from 'midtrans-client'

const prisma = new PrismaClient()

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
})

export async function POST(request: Request) {
  const body = await request.json()

  try {
    const notification = await snap.transaction.notification(body)
    const orderId = notification.order_id
    const transactionStatus = notification.transaction_status
    const fraudStatus = notification.fraud_status

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        await updateBookingStatus(orderId, 'CHALLENGE')
      } else if (fraudStatus === 'accept') {
        await updateBookingStatus(orderId, 'PAID')
      }
    } else if (transactionStatus === 'settlement') {
      await updateBookingStatus(orderId, 'PAID')
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      await updateBookingStatus(orderId, 'CANCELLED')
    } else if (transactionStatus === 'pending') {
      await updateBookingStatus(orderId, 'PENDING')
    }

    return NextResponse.json({ message: 'OK' })
  } catch (error) {
    console.error('Error processing payment notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function updateBookingStatus(bookingId: string, status: string) {
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  })
}