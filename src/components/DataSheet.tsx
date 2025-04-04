'use client';

import { useCallback } from 'react';
import { VideoData } from '../utils/types';

interface DataSheetProps {
  videos: VideoData[];
  onToggleComplete: (id: string) => void;
  onDeleteVideo: (id: string) => void;
}

export default function DataSheet({ videos, onToggleComplete, onDeleteVideo }: DataSheetProps) {
  const handleToggleComplete = useCallback((id: string) => {
    onToggleComplete(id);
  }, [onToggleComplete]);
  
  const handleDelete = useCallback((id: string) => {
    if (confirm('この動画データを削除してもよろしいですか？')) {
      onDeleteVideo(id);
    }
  }, [onDeleteVideo]);

  // セクションごとにグループ化
  const groupedVideos = videos.reduce((acc, video) => {
    if (!acc[video.section]) {
      acc[video.section] = {};
    }
    
    if (!acc[video.section][video.subsection]) {
      acc[video.section][video.subsection] = [];
    }
    
    acc[video.section][video.subsection].push(video);
    return acc;
  }, {} as Record<string, Record<string, VideoData[]>>);

  if (videos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-6 text-blue-600 dark:text-blue-400 border-b pb-2">動画データ一覧</h2>
        <div className="flex flex-col items-center justify-center py-8">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-center">データがありません。入力フォームから動画データを追加してください。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-blue-600 dark:text-blue-400 border-b pb-2">動画データ一覧</h2>
      
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">進捗</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">動画タイトル</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">動画時間</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">セクション</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">サブセクション</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {Object.entries(groupedVideos).map(([section, subsections]) => (
              Object.entries(subsections).map(([subsection, videos]) => (
                videos.map((video, index) => (
                  <tr key={video.id} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleComplete(video.id)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="進捗状態を切り替え"
                      >
                        {video.completed ? '✅' : ''}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{video.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">{video.duration}</td>
                    {index === 0 && (
                      <td 
                        className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300" 
                        rowSpan={videos.length}
                      >
                        {section}
                      </td>
                    )}
                    {index === 0 && (
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400" 
                        rowSpan={videos.length}
                      >
                        {subsection}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors"
                        title="削除"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
