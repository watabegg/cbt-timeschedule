// 動画データの型定義
export interface VideoData {
  id: string;
  section: string;
  subsection: string;
  title: string;
  duration: string; // mm:ss形式
  completed: boolean;
}

// 入力フォームの型定義
export interface InputFormData {
  section: string;
  subsection: string;
  title: string;
  duration: string;
  examDate: string;
}
