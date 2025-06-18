import { db } from '@/db'
import { videos, userSettings } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { NewVideo, Video, NewUserSettings, UserSettings } from '@/db/schema'

export class UserService {
	// 動画関連の操作
	static async createVideo(
		userId: number,
		videoData: Omit<NewVideo, 'userId'>,
	): Promise<Video> {
		const [video] = await db
			.insert(videos)
			.values({
				...videoData,
				userId,
			})
			.returning()
		return video
	}

	static async getUserVideos(userId: number): Promise<Video[]> {
		return await db
			.select()
			.from(videos)
			.where(and(eq(videos.userId, userId), eq(videos.deleted, false)))
			.orderBy(videos.createdAt)
	}

	static async updateVideoCompletion(
		userId: number,
		videoId: number,
		completed: boolean,
	): Promise<void> {
		await db
			.update(videos)
			.set({ completed, updatedAt: new Date() })
			.where(and(eq(videos.id, videoId), eq(videos.userId, userId)))
	}

	static async deleteVideo(userId: number, videoId: number): Promise<void> {
		await db
			.update(videos)
			.set({ deleted: true, updatedAt: new Date() })
			.where(and(eq(videos.id, videoId), eq(videos.userId, userId)))
	}

	// ユーザー設定関連の操作
	static async getUserSettings(userId: number): Promise<UserSettings | null> {
		const [settings] = await db
			.select()
			.from(userSettings)
			.where(eq(userSettings.userId, userId))
		return settings || null
	}

	static async updateExamDate(userId: number, examDate: string): Promise<void> {
		const existingSettings = await this.getUserSettings(userId)

		if (existingSettings) {
			await db
				.update(userSettings)
				.set({ examDate, updatedAt: new Date() })
				.where(eq(userSettings.userId, userId))
		} else {
			await db.insert(userSettings).values({
				userId,
				examDate,
			})
		}
	}
}
