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

export async function GET(request: NextRequest) {
  const user = await verifyToken(request)
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const hotels = await prisma.hotel.findMany()
  return NextResponse.json(hotels)
}

export async function POST(request: NextRequest) {
  const user = await verifyToken(request)
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, description, price } = body

  const hotel = await prisma.hotel.create({
    data: {
      name,
      description,
      price,
    },
  })

  return NextResponse.json(hotel)
}