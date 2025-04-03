'use client';

import { useState, useCallback } from 'react';
import { VideoData, InputFormData } from '../utils/types';
import { isValidTimeFormat } from '../utils/timeUtils';
import { saveExamDate, getExamDate } from '../utils/storage';

interface InputSheetProps {
  onAddVideo: (video: VideoData) => void;
  examDate: string;
  onExamDateChange: (date: string) => void;
  dailyViewingTime: string;
}

export default function InputSheet({ 
  onAddVideo, 
  examDate, 
  onExamDateChange,
  dailyViewingTime 
}: InputSheetProps) {
  const [formData, setFormData] = useState<InputFormData>({
    section: '',
    subsection: '',
    title: '',
    duration: '',
    examDate: examDate || '',
  });
  const [error, setError] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'examDate') {
      onExamDateChange(value);
    }
    
    setError('');
  }, [onExamDateChange]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!formData.section || !formData.subsection || !formData.title || !formData.duration) {
      setError('すべての項目を入力してください！');
      return;
    }
    
    if (!isValidTimeFormat(formData.duration)) {
      setError('動画時間は mm:ss 形式で入力してください！');
      return;
    }
    
    // 新しい動画データを作成
    const newVideo: VideoData = {
      id: Date.now().toString(),
      section: formData.section,
      subsection: formData.subsection,
      title: formData.title,
      duration: formData.duration,
      completed: false,
    };
    
    // 親コンポーネントに通知
    onAddVideo(newVideo);
    
    // フォームをリセット（セクションとサブセクションは保持）
    setFormData(prev => ({
      ...prev,
      title: '',
      duration: '',
    }));
    
    setError('');
  }, [formData, onAddVideo]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-blue-600 dark:text-blue-400 border-b pb-2">動画データ入力</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <p className="font-medium">エラー</p>
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">セクション</label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">サブセクション</label>
            <input
              type="text"
              name="subsection"
              value={formData.subsection}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 transition-colors"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">動画タイトル</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 transition-colors"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">動画時間 (mm:ss)</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="例: 5:30"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">試験日</label>
            <input
              type="date"
              name="examDate"
              value={formData.examDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 transition-colors"
            />
          </div>
        </div>
        
        {dailyViewingTime && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="font-medium text-blue-800 dark:text-blue-300">1日あたりの視聴時間: <span className="font-bold text-lg">{dailyViewingTime}</span></p>
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md shadow-sm transition-colors mt-6"
        >
          データ追加
        </button>
      </form>
    </div>
  );
}
