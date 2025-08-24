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

    // Verify and decode the JWT token to get real user data
    try {
      // TODO: Add proper JWT verification library
      // For now, we'll decode the token to see what's in it
      const tokenParts = token.split('.')
      if (tokenParts.length === 3) {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString())
        console.log('JWT payload:', payload)

        // Extract user data from the token payload
        const userData = {
          fid: payload.sub || payload.fid,
          username: payload.username,
          displayName: payload.displayName,
          avatarUrl: payload.avatarUrl
        }

        return NextResponse.json(userData)
      }
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError)
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Invalid token format' },
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
