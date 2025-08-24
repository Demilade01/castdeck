import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    // Extract the token from the Bearer header
    const token = authHeader.substring(7)

    // For now, return an error indicating authentication is required
    // In a real implementation, you would verify the JWT token from the Mini App SDK
    return NextResponse.json(
      { error: 'Authentication required - please use Mini App SDK' },
      { status: 401 }
    )
  } catch (error) {
    console.error('❌ User data endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
