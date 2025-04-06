'use client';

import { useState, useCallback, useMemo } from 'react';
import { VideoData } from '../utils/types';
import { timeToSeconds, secondsToTimeHMS } from '../utils/timeUtils';
import ConfirmDialog from './ConfirmDialog';

interface DataSheetProps {
  videos: VideoData[];
  onToggleComplete: (id: string) => void;
  onDeleteVideo: (id: string) => void;
}

type SortField = 'title' | 'duration' | 'section' | 'subsection' | 'completed' | 'id';
type SortDirection = 'asc' | 'desc';
type FilterType = 'all' | 'completed' | 'incomplete';

export default function DataSheet({ videos, onToggleComplete, onDeleteVideo }: DataSheetProps) {
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'info' | 'warning' | 'danger';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'info'
  });
  
  // フィルタリングされたビデオデータ
  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      if (filterType === 'all') return true;
      if (filterType === 'completed') return video.completed;
      return !video.completed;
    });
  }, [videos, filterType]);
  
  // ソートされたビデオデータ
  const sortedVideos = useMemo(() => {
    return [...filteredVideos].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'duration':
          comparison = timeToSeconds(a.duration) - timeToSeconds(b.duration);
          break;
        case 'section':
          comparison = a.section.localeCompare(b.section);
          break;
        case 'subsection':
          comparison = a.subsection.localeCompare(b.subsection);
          break;
        case 'completed':
          comparison = (a.completed === b.completed) ? 0 : a.completed ? 1 : -1;
          break;
        case 'id':
          comparison = a.id.localeCompare(b.id);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredVideos, sortField, sortDirection]);
  
  // セクションごとにグループ化
  const groupedVideos = useMemo(() => {
    return sortedVideos.reduce((acc, video) => {
      if (!acc[video.section]) {
        acc[video.section] = {};
      }
      
      if (!acc[video.section][video.subsection]) {
        acc[video.section][video.subsection] = [];
      }
      
      acc[video.section][video.subsection].push(video);
      return acc;
    }, {} as Record<string, Record<string, VideoData[]>>);
  }, [sortedVideos]);
  
  // 統計情報の計算
  const stats = useMemo(() => {
    const totalCount = videos.length;
    const completedCount = videos.filter(v => v.completed).length;
    const incompleteCount = totalCount - completedCount;
    
    const totalSeconds = videos.reduce((total, video) => {
      return total + timeToSeconds(video.duration);
    }, 0);
    
    const completedSeconds = videos
      .filter(v => v.completed)
      .reduce((total, video) => total + timeToSeconds(video.duration), 0);
    
    const incompleteSeconds = totalSeconds - completedSeconds;
    
    return {
      totalCount,
      completedCount,
      incompleteCount,
      totalTime: secondsToTimeHMS(totalSeconds),
      completedTime: secondsToTimeHMS(completedSeconds),
      incompleteTime: secondsToTimeHMS(incompleteSeconds)
    };
  }, [filteredVideos]);
  
  const handleToggleComplete = useCallback((id: string) => {
    const video = videos.find(v => v.id === id);
    if (!video) return;
    
    const title = video.completed ? '完了状態の変更' : '完了としてマーク';
    const message = video.completed 
      ? 'この動画見終わってないの！？' 
      : 'この動画見終わったの！？やるやん';
    
    setDialogState({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onToggleComplete(id);
        setDialogState(prev => ({ ...prev, isOpen: false }));
      },
      type: 'info'
    });
  }, [videos, onToggleComplete]);
  
  const handleDelete = useCallback((id: string) => {
    const video = videos.find(v => v.id === id);
    if (!video) return;
    
    setDialogState({
      isOpen: true,
      title: '動画データの削除',
      message: `「${video.title}」を削除してもよろしいですか？`,
      onConfirm: () => {
        onDeleteVideo(id);
        setDialogState(prev => ({ ...prev, isOpen: false }));
      },
      type: 'danger'
    });
  }, [videos, onDeleteVideo]);
  
  const closeDialog = useCallback(() => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
  }, []);
  
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      // 同じフィールドをクリックした場合は、ソート方向を切り替える
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // 異なるフィールドをクリックした場合は、そのフィールドで昇順ソート
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);
  
  const getSortIcon = useCallback((field: SortField) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <span className="ml-1">↑</span> 
      : <span className="ml-1">↓</span>;
  }, [sortField, sortDirection]);

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
      {/* 確認ダイアログ */}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        title={dialogState.title}
        message={dialogState.message}
        onConfirm={dialogState.onConfirm}
        onCancel={closeDialog}
        type={dialogState.type}
      />
      <h2 className="text-xl font-bold mb-6 text-blue-600 dark:text-blue-400 border-b pb-2">動画データ一覧</h2>
      
      {/* フィルターと統計情報 */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterType === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            すべて ({stats.totalCount})
          </button>
          <button
            onClick={() => setFilterType('completed')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterType === 'completed' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            完了 ({stats.completedCount})
          </button>
          <button
            onClick={() => setFilterType('incomplete')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterType === 'incomplete' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            未完了 ({stats.incompleteCount})
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">総時間: <span className="font-mono font-bold">{stats.totalTime}</span></p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-300">完了: <span className="font-mono font-bold">{stats.completedTime}</span></p>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">未完了: <span className="font-mono font-bold">{stats.incompleteTime}</span></p>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-lg border-2 border-gray-300 dark:border-gray-600">
        <table className="min-w-full divide-y-2 divide-gray-300 dark:divide-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => handleSort('completed')}
              >
                進捗{getSortIcon('completed')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => handleSort('title')}
              >
                動画タイトル{getSortIcon('title')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => handleSort('duration')}
              >
                動画時間{getSortIcon('duration')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => handleSort('id')}
              >
                作成日{getSortIcon('id')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => handleSort('section')}
              >
                セクション{getSortIcon('section')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => handleSort('subsection')}
              >
                サブセクション{getSortIcon('subsection')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedVideos.map((video) => (
              <tr key={video.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleComplete(video.id)}
                    className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title={video.completed ? "完了を取り消す" : "完了としてマーク"}
                  >
                    {video.completed ? '✅' : ''}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{video.title}</td>
                <td className="px-6 py-4 whitespace-nowrap font-mono">{video.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap font-mono">{new Date(Number(video.id)).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '/')}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300">{video.section}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{video.subsection}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
