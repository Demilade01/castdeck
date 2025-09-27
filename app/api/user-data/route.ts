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

        const fid = payload.sub || payload.fid

        if (!fid) {
          return NextResponse.json(
            { error: 'Invalid token: missing user ID' },
            { status: 401 }
          )
        }

        // Fetch user data from Farcaster API using the fid
        try {
          const farcasterResponse = await fetch(`https://hub-api.pinata.cloud/v1/userDataByFid?fid=${fid}`)

          if (!farcasterResponse.ok) {
            console.error('Failed to fetch user data from Farcaster API:', farcasterResponse.status)
            // Fallback: return minimal data with just fid
            return NextResponse.json({
              fid: fid,
              username: `user_${fid}`,
              displayName: `User ${fid}`,
              avatarUrl: null
            })
          }

          const userDataResponse = await farcasterResponse.json()
          console.log('Farcaster user data response:', userDataResponse)

          // Extract user data from Farcaster API response
          const userData = {
            fid: fid,
            username: null as string | null,
            displayName: null as string | null,
            avatarUrl: null as string | null
          }

          // Parse the user data array from Farcaster API
          if (userDataResponse.data && Array.isArray(userDataResponse.data)) {
            userDataResponse.data.forEach((item: any) => {
              switch (item.type) {
                case 'USER_DATA_TYPE_USERNAME':
                  userData.username = item.value
                  break
                case 'USER_DATA_TYPE_DISPLAY':
                  userData.displayName = item.value
                  break
                case 'USER_DATA_TYPE_PFP':
                  userData.avatarUrl = item.value
                  break
              }
            })
          }

          // Provide fallback values if data is missing
          if (!userData.username) userData.username = `user_${fid}`
          if (!userData.displayName) userData.displayName = `User ${fid}`

          return NextResponse.json(userData)

        } catch (farcasterError) {
          console.error('Error fetching from Farcaster API:', farcasterError)
          // Fallback: return minimal data
          return NextResponse.json({
            fid: fid,
            username: `user_${fid}`,
            displayName: `User ${fid}`,
            avatarUrl: null
          })
        }
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
