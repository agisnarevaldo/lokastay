import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password } = body

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role, isAdmin: user.isAdmin },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  )

  return NextResponse.json({
    isAdmin: user.isAdmin,
    token: token,
    message: 'Login successful'
  })
}