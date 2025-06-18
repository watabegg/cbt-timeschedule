import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { UserService } from '@/lib/user-service'
import { examDateSchema } from '@/utils/types'

export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const settings = await UserService.getUserSettings(Number(session.user.id))
		return NextResponse.json({ examDate: settings?.examDate || '' })
	} catch (error) {
		console.error('Error fetching exam date:', error)
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
		const result = examDateSchema.safeParse(body)

		if (!result.success) {
			return NextResponse.json(
				{ error: 'Invalid data', details: result.error.errors },
				{ status: 400 },
			)
		}

		await UserService.updateExamDate(
			Number(session.user.id),
			result.data.examDate,
		)
		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error updating exam date:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
