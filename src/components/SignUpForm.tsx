'use client'

import { useState } from 'react'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { signUp } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/utils/types'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

interface SignUpFormProps {
	onToggleMode: () => void
}

export default function SignUpForm({ onToggleMode }: SignUpFormProps) {
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const router = useRouter()

	const [form, fields] = useForm({
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: signUpSchema })
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	const handleSubmit = async (formData: FormData) => {
		setIsLoading(true)
		setError('')

		const submission = parseWithZod(formData, { schema: signUpSchema })

		if (submission.status !== 'success') {
			setIsLoading(false)
			return
		}

		try {
			const result = await signUp.email({
				email: submission.value.email,
				password: submission.value.password,
				name: submission.value.nickname,
			})

			if (result.error) {
				setError(
					'アカウント作成に失敗しました。メールアドレスまたはニックネームが既に使用されている可能性があります。',
				)
			} else {
				// アカウント作成成功時はアプリページにリダイレクト
				router.push('/app')
			}
		} catch (err) {
			setError('アカウント作成に失敗しました。もう一度お試しください。')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
				<div className="text-center mb-8">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						アカウント作成
					</h2>
					<p className="text-gray-600 dark:text-gray-400">
						新しいアカウントを作成してください
					</p>
				</div>

				<form id={form.id} onSubmit={form.onSubmit} action={handleSubmit}>
					{error && (
						<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
							{error}
						</div>
					)}

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								ニックネーム
							</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
								<input
									key={fields.nickname.key}
									name={fields.nickname.name}
									type="text"
									placeholder="ニックネーム"
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
									required
								/>
							</div>
							{fields.nickname.errors && (
								<p className="mt-1 text-sm text-red-600">
									{fields.nickname.errors[0]}
								</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								メールアドレス
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
								<input
									key={fields.email.key}
									name={fields.email.name}
									type="email"
									placeholder="email@example.com"
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
									required
								/>
							</div>
							{fields.email.errors && (
								<p className="mt-1 text-sm text-red-600">
									{fields.email.errors[0]}
								</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								パスワード
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
								<input
									key={fields.password.key}
									name={fields.password.name}
									type={showPassword ? 'text' : 'password'}
									placeholder="パスワード（6文字以上）"
									className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
							</div>
							{fields.password.errors && (
								<p className="mt-1 text-sm text-red-600">
									{fields.password.errors[0]}
								</p>
							)}
						</div>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isLoading ? 'アカウント作成中...' : 'アカウント作成'}
					</button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						既にアカウントをお持ちの方は{' '}
						<button
							onClick={onToggleMode}
							className="text-blue-600 hover:text-blue-500 font-medium"
						>
							こちらからサインイン
						</button>
					</p>
				</div>
			</div>
		</div>
	)
}
