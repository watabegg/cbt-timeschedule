'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import SignInForm from '@/components/SignInForm'
import SignUpForm from '@/components/SignUpForm'
import { BookOpen, Clock, Target, Users } from 'lucide-react'

export default function HomeClient() {
	const { data: session, isPending } = useSession()
	const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
	const router = useRouter()

	// ログイン済みの場合はアプリページにリダイレクト
	useEffect(() => {
		if (session?.user) {
			router.push('/app')
		}
	}, [session, router])

	if (isPending) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600 dark:text-gray-400">読み込み中...</p>
				</div>
			</div>
		)
	}

	// ログイン済みの場合は何も表示しない（リダイレクト中）
	if (session?.user) {
		return null
	}

	return (
		<div className="min-h-screen">
			<div className="container mx-auto px-4 py-12">
				{/* ヒーローセクション */}
				<div className="text-center mb-16">
					<h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
						動画学習進捗管理
					</h1>
					<p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
						効率的な学習計画で試験対策を成功させましょう
					</p>
					<div className="text-center">
						<div className="inline-block bg-blue-100 dark:bg-blue-900 rounded-lg p-6">
							<BookOpen className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
								学習を始めましょう
							</h2>
						</div>
					</div>
				</div>

				{/* 機能紹介 */}
				<div className="grid md:grid-cols-3 gap-8 mb-16">
					<div className="text-center bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
						<Clock className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
							時間管理
						</h3>
						<p className="text-gray-600 dark:text-gray-400">
							試験日までの残り日数に基づいて、1日の必要視聴時間を自動計算
						</p>
					</div>
					<div className="text-center bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
						<Target className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
							進捗追跡
						</h3>
						<p className="text-gray-600 dark:text-gray-400">
							動画の視聴状況を記録し、学習の進捗を可視化
						</p>
					</div>
					<div className="text-center bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
						<Users className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
							個人管理
						</h3>
						<p className="text-gray-600 dark:text-gray-400">
							安全なアカウントシステムで、あなただけの学習データを管理
						</p>
					</div>
				</div>

				{/* 認証フォーム */}
				<div className="max-w-lg mx-auto">
					{authMode === 'signin' ? (
						<SignInForm onToggleMode={() => setAuthMode('signup')} />
					) : (
						<SignUpForm onToggleMode={() => setAuthMode('signin')} />
					)}
				</div>
			</div>
		</div>
	)
}
