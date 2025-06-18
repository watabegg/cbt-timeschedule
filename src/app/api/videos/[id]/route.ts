import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { UserService } from '@/lib/user-service'

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const videoId = parseInt(params.id)
		if (isNaN(videoId)) {
			return NextResponse.json({ error: 'Invalid video ID' }, { status: 400 })
		}

		const body = await request.json()
		const { completed } = body

		if (typeof completed !== 'boolean') {
			return NextResponse.json(
				{ error: 'Invalid completion status' },
				{ status: 400 },
			)
		}

		await UserService.updateVideoCompletion(
			Number(session.user.id),
			videoId,
			completed,
		)
		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error updating video:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const videoId = parseInt(params.id)
		if (isNaN(videoId)) {
			return NextResponse.json({ error: 'Invalid video ID' }, { status: 400 })
		}

		await UserService.deleteVideo(Number(session.user.id), videoId)
		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error deleting video:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
