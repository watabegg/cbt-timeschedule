/**
 * mm:ss形式の時間文字列を秒数に変換する
 */
export function timeToSeconds(timeStr: string): number {
  if (!timeStr || !timeStr.match(/^\d+:\d{2}$/)) {
    return 0;
  }
  
  const [minutes, seconds] = timeStr.split(':').map(Number);
  return minutes * 60 + seconds;
}

/**
 * 秒数をmm:ss形式の文字列に変換する
 */
export function secondsToTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}分 ${seconds}秒`;
}

/**
 * 秒数をhh:mm:ss形式の文字列に変換する
 */
export function secondsToTimeHMS(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');
}

/**
 * 日付文字列から残り日数を計算する
 */
export function calculateRemainingDays(examDateStr: string): number {
  if (!examDateStr) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const examDate = new Date(examDateStr);
  examDate.setHours(0, 0, 0, 0);
  
  const diffTime = examDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(1, diffDays); // 最低でも1日は返す
}

/**
 * 総視聴時間と残り日数から1日あたりの視聴時間を計算する
 */
export function calculateDailyViewingTime(totalSeconds: number, remainingDays: number): number {
  if (remainingDays <= 0) return 0;
  return Math.ceil(totalSeconds / remainingDays);
}

/**
 * 時間形式が正しいかチェックする (mm:ss形式)
 */
export function isValidTimeFormat(timeStr: string): boolean {
  return Boolean(timeStr && timeStr.match(/^\d+:\d{2}$/));
}
