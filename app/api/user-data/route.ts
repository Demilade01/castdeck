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

    try {
      // For now, we'll return a mock user data
      // In a real implementation, you would verify the JWT token from the Mini App SDK
      const userData = {
        fid: 12345, // Mock FID
        username: 'testuser',
        displayName: 'Test User',
        avatarUrl: null
      }

      console.log('✅ User data returned:', userData)

      return NextResponse.json(userData)
    } catch (verifyError) {
      console.error('❌ Token verification failed:', verifyError)
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('❌ User data endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
