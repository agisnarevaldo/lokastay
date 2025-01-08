import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const hotels = await prisma.hotel.findMany()
  return NextResponse.json(hotels)
}

export async function POST(request: Request) {
  const body = await request.json()
  const hotel = await prisma.hotel.create({
    data: {
      name: body.name,
      description: body.description,
      address: body.address,
    },
  })
  return NextResponse.json(hotel)
}