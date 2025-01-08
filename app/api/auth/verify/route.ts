import { NextRequest, NextResponse } from 'next/server'
import * as jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ isAuthenticated: false, isAdmin: false }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload
    return NextResponse.json({
      isAuthenticated: true,
      isAdmin: decoded.isAdmin,
    })
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json({ isAuthenticated: false, isAdmin: false }, { status: 401 })
  }
}