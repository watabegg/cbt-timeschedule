'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession, signOut } from '@/lib/auth-client'
import useSWR, { mutate } from 'swr'
import InputSheet from '@/components/InputSheet'
import DataSheet from '@/components/DataSheet'
import ConfirmDialog from '@/components/ConfirmDialog'
import { VideoData } from '@/utils/types'
import {
	timeToSeconds,
	secondsToTime,
	calculateRemainingDays,
	calculateDailyViewingTime,
} from '@/utils/timeUtils'
import { LogOut, User } from 'lucide-react'

// SWRのフェッチャー関数
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AppClient() {
	const { data: session, isPending: authPending } = useSession()
	const [dailyViewingTime, setDailyViewingTime] = useState('')
	const [showConfirmDialog, setShowConfirmDialog] = useState(false)

	// SWRでデータを取得
	const {
		data: videosData,
		error: videosError,
		isLoading: videosLoading,
	} = useSWR(session?.user ? '/api/videos' : null, fetcher)

	const {
		data: examDateData,
		error: examDateError,
		isLoading: examDateLoading,
	} = useSWR(session?.user ? '/api/settings/exam-date' : null, fetcher)

	const videos = videosData?.videos || []
	const examDate = examDateData?.examDate || ''
	const isLoading = authPending || videosLoading || examDateLoading

	// 視聴時間の計算
	const calculateViewingTime = useCallback(
		(videoList: VideoData[], date: string) => {
			// 未完了の動画の合計時間を計算
			const totalSeconds = videoList
				.filter((video) => !video.completed)
				.reduce((total, video) => total + timeToSeconds(video.duration), 0)

			// 残り日数を計算
			const remainingDays = calculateRemainingDays(date)

			// 1日あたりの視聴時間を計算
			const dailySeconds = calculateDailyViewingTime(
				totalSeconds,
				remainingDays,
			)

			// 表示用の文字列に変換
			setDailyViewingTime(secondsToTime(dailySeconds))
		},
		[],
	)

	// データが更新されたときに視聴時間を再計算
	useEffect(() => {
		if (examDate && videos.length > 0) {
			calculateViewingTime(videos, examDate)
		}
	}, [videos, examDate, calculateViewingTime])

	// 動画データの追加
	const handleAddVideo = useCallback(
		async (
			videoData: Omit<
				VideoData,
				'id' | 'completed' | 'deleted' | 'createdAt' | 'updatedAt'
			>,
		) => {
			try {
				const response = await fetch('/api/videos', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(videoData),
				})

				if (response.ok) {
					// SWRのキャッシュを更新
					await mutate('/api/videos')
				}
			} catch (error) {
				console.error('Failed to add video:', error)
			}
		},
		[],
	)

	// 進捗状態の切り替え
	const handleToggleComplete = useCallback(
		async (id: number) => {
			const video = videos.find((v: VideoData) => v.id === id)
			if (!video) return

			try {
				const response = await fetch(`/api/videos/${id}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ completed: !video.completed }),
				})

				if (response.ok) {
					// SWRのキャッシュを更新
					await mutate('/api/videos')
				}
			} catch (error) {
				console.error('Failed to update video:', error)
			}
		},
		[videos],
	)

	// 動画データの削除
	const handleDeleteVideo = useCallback(async (id: number) => {
		try {
			const response = await fetch(`/api/videos/${id}`, {
				method: 'DELETE',
			})

			if (response.ok) {
				// SWRのキャッシュを更新
				await mutate('/api/videos')
			}
		} catch (error) {
			console.error('Failed to delete video:', error)
		}
	}, [])

	// 試験日の変更
	const handleExamDateChange = useCallback(async (date: string) => {
		try {
			const response = await fetch('/api/settings/exam-date', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ examDate: date }),
			})

			if (response.ok) {
				// SWRのキャッシュを更新
				await mutate('/api/settings/exam-date')
			}
		} catch (error) {
			console.error('Failed to update exam date:', error)
		}
	}, [])

	// 全データ削除処理
	const handleClearAllData = useCallback(async () => {
		try {
			// 全ての動画を削除
			await Promise.all(
				videos.map((video: VideoData) =>
					fetch(`/api/videos/${video.id}`, {
						method: 'DELETE',
					}),
				),
			)

			// 試験日をクリア
			await fetch('/api/settings/exam-date', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ examDate: '' }),
			})

			// SWRのキャッシュを更新
			await mutate('/api/videos')
			await mutate('/api/settings/exam-date')

			setShowConfirmDialog(false)
		} catch (error) {
			console.error('Failed to clear data:', error)
		}
	}, [videos])

	const handleSignOut = async () => {
		await signOut()
	}

	// 認証チェック
	if (authPending) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600 dark:text-gray-400">
						認証状態を確認中...
					</p>
				</div>
			</div>
		)
	}

	if (!session?.user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
						アクセスが拒否されました
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						このページにアクセスするにはログインが必要です。
					</p>
					<a
						href="/"
						className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
					>
						ホームに戻る
					</a>
				</div>
			</div>
		)
	}

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600 dark:text-gray-400">
						データを読み込み中...
					</p>
				</div>
			</div>
		)
	}

	if (videosError || examDateError) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600 mb-4">
						エラーが発生しました
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						データの読み込みに失敗しました。ページを再読み込みしてください。
					</p>
					<button
						onClick={() => window.location.reload()}
						className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
					>
						再読み込み
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="py-10">
			<div className="container mx-auto px-4">
				<header className="mb-10 flex justify-between items-center">
					<div className="text-center flex-1">
						<h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
							動画学習進捗管理
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							効率的な学習で目標達成を
						</p>
					</div>

					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
							<User className="h-5 w-5" />
							<span>{session?.user?.name || session?.user?.email}</span>
						</div>
						<button
							onClick={handleSignOut}
							className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
						>
							<LogOut className="h-4 w-4" />
							サインアウト
						</button>
					</div>
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
					<div className="lg:sticky lg:top-10 self-start">
						<InputSheet
							onAddVideo={handleAddVideo}
							examDate={examDate}
							onExamDateChange={handleExamDateChange}
							dailyViewingTime={dailyViewingTime}
						/>
					</div>

					<div>
						<DataSheet
							videos={videos}
							onToggleComplete={handleToggleComplete}
							onDeleteVideo={handleDeleteVideo}
						/>
						<div className="mt-6 text-right">
							<button
								onClick={() => setShowConfirmDialog(true)}
								className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
							>
								全データ削除
							</button>
						</div>
					</div>
				</div>

				{showConfirmDialog && (
					<ConfirmDialog
						isOpen={showConfirmDialog}
						title="全データ削除の確認"
						message="本当にすべてのデータを削除しますか？この操作は元に戻せません。"
						onConfirm={handleClearAllData}
						onCancel={() => setShowConfirmDialog(false)}
						type="danger"
					/>
				)}
			</div>
		</div>
	)
}
