import { VideoData } from './types';

const VIDEO_DATA_KEY = 'video-data';
const EXAM_DATE_KEY = 'exam-date';

/**
 * 動画データをローカルストレージに保存する
 */
export function saveVideoData(data: VideoData[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(VIDEO_DATA_KEY, JSON.stringify(data));
  }
}

/**
 * 動画データをローカルストレージから取得する
 */
export function getVideoData(): VideoData[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(VIDEO_DATA_KEY);
    return data ? JSON.parse(data) : [];
  }
  return [];
}

/**
 * 試験日をローカルストレージに保存する
 */
export function saveExamDate(date: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(EXAM_DATE_KEY, date);
  }
}

/**
 * 試験日をローカルストレージから取得する
 */
export function getExamDate(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(EXAM_DATE_KEY) || '';
  }
  return '';
}
