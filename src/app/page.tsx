import { Metadata } from 'next'
import HomeClient from '@/app/HomeClient'

export const metadata: Metadata = {
	title: '動画学習進捗管理 - ホーム',
	description: '効率的な学習計画で試験対策を成功させる動画学習進捗管理アプリ',
}

export default function Home() {
	return <HomeClient />
}
