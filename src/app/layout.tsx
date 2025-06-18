import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: '動画学習進捗管理',
	description: '効率的な学習計画で試験対策を成功させる動画学習進捗管理アプリ',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="ja">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`}
			>
				<div className="flex flex-col min-h-screen">
					<main className="flex-1">{children}</main>
					<footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 py-6">
						<div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
							<p>© {new Date().getFullYear()} 動画学習進捗管理アプリ</p>
						</div>
					</footer>
				</div>
			</body>
		</html>
	)
}
