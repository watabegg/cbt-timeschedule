import { Metadata } from 'next'
import AppClient from '@/app/app/AppClient'

export const metadata: Metadata = {
	title: '動画学習進捗管理 - アプリ',
	description: '効率的な学習計画で試験対策を成功させましょう',
}

export default function AppPage() {
	return <AppClient />
}
