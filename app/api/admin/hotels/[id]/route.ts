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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const hotel = await prisma.hotel.findUnique({
    where: { id: params.id },
  })

  if (!hotel) {
    return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
  }

  return NextResponse.json(hotel)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, description, price } = body

  const hotel = await prisma.hotel.update({
    where: { id: params.id },
    data: {
      name,
      description,
      price,
    },
  })

  return NextResponse.json(hotel)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.hotel.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ message: 'Hotel deleted successfully' })
}