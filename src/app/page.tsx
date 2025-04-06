'use client';

import { useState, useEffect, useCallback } from 'react';
import InputSheet from '../components/InputSheet';
import DataSheet from '../components/DataSheet';
import { VideoData } from '../utils/types';
import { 
  timeToSeconds, 
  secondsToTime, 
  calculateRemainingDays, 
  calculateDailyViewingTime 
} from '../utils/timeUtils';
import { 
  saveVideoData, 
  getVideoData, 
  saveExamDate, 
  getExamDate 
} from '../utils/storage';

export default function Home() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [examDate, setExamDate] = useState('');
  const [dailyViewingTime, setDailyViewingTime] = useState('');
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドでのみ実行されるようにする
  useEffect(() => {
    setIsClient(true);
    
    // ローカルストレージからデータを読み込む
    const storedVideos = getVideoData();
    const storedExamDate = getExamDate();
    
    setVideos(storedVideos);
    setExamDate(storedExamDate);
    
    // 初期表示時に視聴時間を計算
    if (storedExamDate && storedVideos.length > 0) {
      calculateViewingTime(storedVideos, storedExamDate);
    }
  }, []);

  // 視聴時間の計算
  const calculateViewingTime = useCallback((videoList: VideoData[], date: string) => {
    // 未完了の動画の合計時間を計算
    const totalSeconds = videoList
      .filter(video => !video.completed)
      .reduce((total, video) => total + timeToSeconds(video.duration), 0);
    
    // 残り日数を計算
    const remainingDays = calculateRemainingDays(date);
    
    // 1日あたりの視聴時間を計算
    const dailySeconds = calculateDailyViewingTime(totalSeconds, remainingDays);
    
    // 表示用の文字列に変換
    setDailyViewingTime(secondsToTime(dailySeconds));
  }, []);

  // 動画データの追加
  const handleAddVideo = useCallback((video: VideoData) => {
    setVideos(prev => {
      const newVideos = [...prev, video];
      saveVideoData(newVideos);
      
      if (examDate) {
        calculateViewingTime(newVideos, examDate);
      }
      
      return newVideos;
    });
  }, [examDate, calculateViewingTime]);

  // 進捗状態の切り替え
  const handleToggleComplete = useCallback((id: string) => {
    setVideos(prev => {
      const newVideos = prev.map(video => 
        video.id === id ? { ...video, completed: !video.completed } : video
      );
      
      saveVideoData(newVideos);
      
      if (examDate) {
        calculateViewingTime(newVideos, examDate);
      }
      
      return newVideos;
    });
  }, [examDate, calculateViewingTime]);
  
  // 動画データの削除
  const handleDeleteVideo = useCallback((id: string) => {
    setVideos(prev => {
      const newVideos = prev.filter(video => video.id !== id);
      saveVideoData(newVideos);
      
      if (examDate) {
        calculateViewingTime(newVideos, examDate);
      }
      
      return newVideos;
    });
  }, [examDate, calculateViewingTime]);

  // 試験日の変更
  const handleExamDateChange = useCallback((date: string) => {
    setExamDate(date);
    saveExamDate(date);
    
    if (date && videos.length > 0) {
      calculateViewingTime(videos, date);
    }
  }, [videos, calculateViewingTime]);

  // クライアントサイドでのみレンダリング
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-10">
      <div className="container mx-auto px-4">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">ひとみちゃん用CBT動画進捗管理アプリ</h1>
          <p className="text-gray-600 dark:text-gray-400">CBTマジ頑張ってね</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
          <div className="lg:sticky lg:top-10 self-start">
            <InputSheet 
              onAddVideo={handleAddVideo} 
              examDate={examDate}
              onExamDateChange={handleExamDateChange}
              dailyViewingTime={dailyViewingTime}
            />
          </div>
          
          <div>
            <DataSheet 
              videos={videos} 
              onToggleComplete={handleToggleComplete}
              onDeleteVideo={handleDeleteVideo}
            />
          </div>
        </div>
        
        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} watabegg</p>
        </footer>
      </div>
    </div>
  );
}
