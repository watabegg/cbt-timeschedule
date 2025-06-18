'use client'

import { useSession } from '@/lib/auth-client'
import { ReactNode } from 'react'

interface AuthGuardProps {
	children: ReactNode
	fallback?: ReactNode
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
	const { data: session, isPending } = useSession()

	if (isPending) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600 dark:text-gray-400">読み込み中...</p>
				</div>
			</div>
		)
	}

	if (!session?.user) {
		return fallback || null
	}

	return <>{children}</>
}
