import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import * as jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

async function verifyToken(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1]
  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload
    return decoded
  } catch (error) {
    return null
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await verifyToken(request)
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { status } = body

  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}