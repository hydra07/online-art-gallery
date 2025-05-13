import { Settings2 } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className='mb-8'>
      <h1 className='text-3xl font-bold mb-4 flex items-center gap-2'>
        <Settings2 className='w-8 h-8' />
        {title}
      </h1>
      <p className='text-muted-foreground'>{description}</p>
    </div>
  );
}