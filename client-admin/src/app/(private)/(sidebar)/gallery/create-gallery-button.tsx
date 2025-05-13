import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function CreateGalleryButton() {
  return (
    <Button size="lg" asChild className="transition-all hover:scale-105">
      <Link href="/gallery/creator">
        <Plus className="mr-2 h-5 w-5" /> New Template
      </Link>
    </Button>
  );
}