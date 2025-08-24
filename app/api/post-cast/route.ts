import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // For now, just log the cast content
    // In a real implementation, you would post this to Farcaster
    console.log('📝 Cast to be posted:', content)

    return NextResponse.json({
      success: true,
      message: 'Cast posted successfully',
      content
    })
  } catch (error) {
    console.error('❌ Post cast error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
