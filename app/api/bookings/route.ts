import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import midtransClient from 'midtrans-client'

const prisma = new PrismaClient()

// Initialize Midtrans Snap API client
const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
})

export async function POST(request: Request) {
    const body = await request.json()

    // Create booking
    const booking = await prisma.booking.create({
        data: {
            userId: body.userId,
            roomId: body.roomId,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            totalPrice: body.totalPrice,
            status: 'PENDING',
        },
    })

    // Create Midtrans transaction
    const transaction = await snap.createTransaction({
        transaction_details: {
            order_id: booking.id,
            gross_amount: booking.totalPrice,
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
}