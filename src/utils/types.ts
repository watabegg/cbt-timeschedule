import { z } from 'zod'

// Zodバリデーションスキーマ
export const videoSchema = z.object({
	section: z.string().min(1, '分野は必須です'),
	subsection: z.string().min(1, '詳細分野は必須です'),
	title: z.string().min(1, 'タイトルは必須です'),
	duration: z
		.string()
		.regex(/^\d{1,3}:\d{2}$/, '時間はmm:ss形式で入力してください'),
})

export const examDateSchema = z.object({
	examDate: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, '試験日はYYYY-MM-DD形式で入力してください'),
})

export const signInSchema = z.object({
	email: z.string().email('有効なメールアドレスを入力してください'),
	password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
})

export const signUpSchema = z.object({
	email: z.string().email('有効なメールアドレスを入力してください'),
	password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
	nickname: z
		.string()
		.min(1, 'ニックネームは必須です')
		.max(100, 'ニックネームは100文字以内で入力してください'),
})

// 型定義
export type VideoFormData = z.infer<typeof videoSchema>
export type ExamDateFormData = z.infer<typeof examDateSchema>
export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>

// データベースから取得する動画データの型
export interface VideoData {
	id: number
	section: string
	subsection: string
	title: string
	duration: string
	completed: boolean
	deleted: boolean
	createdAt: Date
	updatedAt: Date
}

// 入力フォームの型定義（後方互換性のため残す）
export interface InputFormData {
	section: string
	subsection: string
	title: string
	duration: string
	examDate: string
}
