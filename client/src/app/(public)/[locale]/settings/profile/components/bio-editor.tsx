'use client';
import { useServerAction } from 'zsa-react';
import { useRef, useCallback, useState } from 'react';
import { EditorProvider } from '@tiptap/react';
import { MenuBar, extensions } from '@/lib/tiptap';
import debounce from 'lodash/debounce';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { updateArtistProfileAction } from '../actions';

interface BioEditorProps {
  initialBio: string;
  isEditable: boolean;
  onChange?: (bio: string) => void;
}

export const BioEditor = ({ initialBio, isEditable, onChange }: BioEditorProps) => {
  const { execute } = useServerAction(updateArtistProfileAction);
  const htmlRef = useRef<string>(initialBio);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const saveContent = useCallback(() => {
    if (onChange) {
      onChange(htmlRef.current);
      return;
    }

    setSaveStatus('saving');
    execute({
      bio: htmlRef.current,
      
    }).then(([, err]) => {
      if (err) {
        setSaveStatus('error');
      } else {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 1000);
      }
    });
  }, [execute, onChange]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(() => saveContent(), 500),
    [saveContent]
  );

  const renderSaveStatus = () => {
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
        return null;
    }
  };

  return (
    <div className='space-y-2'>
      {isEditable && renderSaveStatus()}
      <EditorProvider
        onUpdate={({ editor }) => {
          htmlRef.current = editor.getHTML();
          if (isEditable) {
            debouncedSave();
          }
        }}
        slotBefore={isEditable ? <MenuBar /> : null}
        extensions={extensions}
        content={initialBio}
        editable={isEditable}
      />
    </div>
  );
}; 