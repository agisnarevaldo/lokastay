import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const hotel = await prisma.hotel.findUnique({
    where: { id: params.id },
    include: { rooms: true },
  })
  if (!hotel) {
    return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
  }
  return NextResponse.json(hotel)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const hotel = await prisma.hotel.update({
    where: { id: params.id },
    data: {
      name: body.name,
      description: body.description,
      address: body.address,
    },
  })
  return NextResponse.json(hotel)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.hotel.delete({
    where: { id: params.id },
  })
  return NextResponse.json({ message: 'Hotel deleted successfully' })
}