'use client';

import { useServerAction } from 'zsa-react';
import { updateBlogAction } from './action';
import { useRef, useCallback, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { EditorProvider } from '@tiptap/react';
import { MenuBar, extensions } from '@/lib/tiptap';
import debounce from 'lodash/debounce';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { BlogStatus } from '@/utils/enums';


interface DraftBlogFormProps {
  _id: string;
  content: string;
  blogTitle: string;
  isAdminOrAuthor: boolean;
  status: BlogStatus;
}

export const DraftBlogForm = ({
  _id,
  content,
  blogTitle,
  isAdminOrAuthor,
  status
}: DraftBlogFormProps) => {
  const { execute } = useServerAction(updateBlogAction);
  const htmlRef = useRef<string>(content);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [title, setTitle] = useState<string>(blogTitle);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const titleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if blog is editable
  const isEditable = isAdminOrAuthor && status !== BlogStatus.PUBLISHED;

  const saveContent = useCallback(
    (updatedTitle: string) => {
      if (!isEditable) return;

      setSaveStatus('saving');
      execute({
        id: _id,
        content: htmlRef.current,
        title: updatedTitle
      }).then(([, err]) => {
        if (err) {
          setSaveStatus('error');
        } else {
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 1000);
        }
      });
    },
    [execute, _id, isEditable]
  );

  const debouncedSave = useCallback(
    debounce((updatedTitle: string) => saveContent(updatedTitle), 500),
    [saveContent]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditable) return;

    const newTitle = e.target.value;
    setTitle(newTitle);
    setIsUpdatingTitle(true);

    if (titleTimeoutRef.current) {
      clearTimeout(titleTimeoutRef.current);
    }

    titleTimeoutRef.current = setTimeout(() => {
      setIsUpdatingTitle(false);
      debouncedSave(newTitle);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (titleTimeoutRef.current) {
        clearTimeout(titleTimeoutRef.current);
      }
    };
  }, []);

  const renderSaveStatus = () => {
    if (!isEditable) return null;

    switch (saveStatus) {
      case 'saving':
        return (
          <div className='flex items-center text-slate-500'>
            <Loader2 className='animate-spin mr-2 h-4 w-4' />
            <span>Saving...</span>
          </div>
        );
      case 'saved':
        return (
          <div className='flex items-center text-green-500'>
            <CheckCircle className='mr-2 h-4 w-4' />
            <span>Saved</span>
          </div>
        );
      case 'error':
        return (
          <div className='flex items-center text-red-500'>
            <AlertCircle className='mr-2 h-4 w-4' />
            <span>Error saving</span>
          </div>
        );
      default:
        return (
          <div className='flex items-center invisible'>
            <AlertCircle className='mr-2 h-4 w-4' />
            <span>Placeholder...</span>
          </div>
        );
    }
  };

  return (
    <div className={cn('p-4 pt-0 rounded space-y-4')}>
      {renderSaveStatus()}
      <div className='mb-2'>
        <input
          type='text'
          value={title}
          onChange={handleTitleChange}
          disabled={!isEditable}
          className={cn(
            'p-2 rounded w-full text-2xl font-bold bg-transparent focus:outline-none focus:ring-0 border-none',
            !isEditable && 'cursor-not-allowed opacity-75'
          )}
        />
      </div>
      <EditorProvider
        onUpdate={({ editor }) => {
          if (!isEditable) return;
          htmlRef.current = editor.getHTML();
          debouncedSave(title);
        }}
        slotBefore={isEditable ? <MenuBar /> : null}
        extensions={extensions}
        content={content}
        editable={isEditable}
        immediatelyRender={false}
      />
    </div>
  );
};