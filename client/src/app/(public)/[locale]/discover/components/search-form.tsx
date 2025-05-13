import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { FormEvent } from 'react';

interface SearchFormProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  t: (key: string) => string;
}

export function SearchForm({
  searchInput,
  onSearchInputChange,
  onSubmit,
  t
}: SearchFormProps) {
  return (
    <form onSubmit={onSubmit} className='flex gap-3 max-w-xl'>
      <div className='flex-1 relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
        <Input
          placeholder={t('search_placeholder')}
          className='w-full pl-9 h-10 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/60'
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
        />
      </div>
      <Button type="submit" className='h-10 px-4 bg-white text-purple-600 hover:bg-white/90'>
        {t('search')}
      </Button>
    </form>
  );
}