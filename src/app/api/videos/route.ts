import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { UserService } from '@/lib/user-service'
import { videoSchema } from '@/utils/types'

export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const videos = await UserService.getUserVideos(Number(session.user.id))
		return NextResponse.json({ videos })
	} catch (error) {
		console.error('Error fetching videos:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = await request.json()
		const result = videoSchema.safeParse(body)

		if (!result.success) {
			return NextResponse.json(
				{ error: 'Invalid data', details: result.error.errors },
				{ status: 400 },
			)
		}

		const video = await UserService.createVideo(
			Number(session.user.id),
			result.data,
		)
		return NextResponse.json({ video })
	} catch (error) {
		console.error('Error creating video:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
