'use client';

import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface SettingsSectionProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export function SettingsSection({ icon, title, children }: SettingsSectionProps) {
  return (
    <Card className='p-6'>
      <h2 className='text-xl font-semibold mb-6 flex items-center gap-2'>
        {icon}
        {title}
      </h2>
      {children}
    </Card>
  );
}