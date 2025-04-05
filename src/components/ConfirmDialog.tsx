'use client';

import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'info' | 'warning' | 'danger';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = '確認',
  cancelText = 'キャンセル',
  onConfirm,
  onCancel,
  type = 'info'
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // ダイアログが開いたときにフォーカスを確認ボタンに移動
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [isOpen]);

  // ESCキーでダイアログを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  // ダイアログの外側をクリックしたときに閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node) && isOpen) {
        onCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  // タイプに応じたスタイルを設定
  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          header: 'bg-yellow-500',
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600',
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          )
        };
      case 'danger':
        return {
          header: 'bg-red-500',
          confirmButton: 'bg-red-500 hover:bg-red-600',
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          )
        };
      default: // info
        return {
          header: 'bg-blue-500',
          confirmButton: 'bg-blue-500 hover:bg-blue-600',
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center dialog-bg animate-fadeIn">
      <div 
        ref={dialogRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden w-full max-w-md mx-4 animate-scaleIn"
      >
        <div className={`${typeStyles.header} px-4 py-3 flex items-center`}>
          <div className="mr-3">
            {typeStyles.icon}
          </div>
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300">{message}</p>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 ${typeStyles.confirmButton} text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
