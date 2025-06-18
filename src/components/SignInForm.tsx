'use client'

import { useState } from 'react'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { signIn } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { signInSchema, SignInFormData } from '@/utils/types'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

interface SignInFormProps {
	onToggleMode: () => void
}

export default function SignInForm({ onToggleMode }: SignInFormProps) {
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const router = useRouter()

	const [form, fields] = useForm({
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: signInSchema })
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	const handleSubmit = async (formData: FormData) => {
		setIsLoading(true)
		setError('')

		const submission = parseWithZod(formData, { schema: signInSchema })

		if (submission.status !== 'success') {
			setIsLoading(false)
			return
		}

		try {
			const result = await signIn.email({
				email: submission.value.email,
				password: submission.value.password,
			})

			if (result.error) {
				setError('メールアドレスまたはパスワードが正しくありません')
			} else {
				// ログイン成功時はアプリページにリダイレクト
				router.push('/app')
			}
		} catch (err) {
			setError('サインインに失敗しました。もう一度お試しください。')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
				<div className="text-center mb-8">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						サインイン
					</h2>
					<p className="text-gray-600 dark:text-gray-400">
						アカウントにサインインしてください
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
									placeholder="パスワード"
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
						{isLoading ? 'サインイン中...' : 'サインイン'}
					</button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						アカウントをお持ちでない方は{' '}
						<button
							onClick={onToggleMode}
							className="text-blue-600 hover:text-blue-500 font-medium"
						>
							こちらから登録
						</button>
					</p>
				</div>
			</div>
		</div>
	)
}
