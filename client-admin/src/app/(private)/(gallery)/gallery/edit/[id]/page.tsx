// app/[locale]/exhibitions/templates/[id]/edit/page.tsx - Server Component
import { Suspense } from 'react';
import { getGalleryTemplate } from '@/service/gallery-service';
import EditGalleryContent from './edit-gallery-content';
import { Loader } from '@/components/gallery-loader';
import { notFound } from 'next/navigation';

export default async function EditGalleryTemplatePage({
  params
}: {
  params: { locale: string; id: string }
}) {
  // Fetch template data on the server
  const res = await getGalleryTemplate(params.id);
  const templateResponse = res.data;
  const templateData = templateResponse?.gallery;
  if (!templateData) {
    return notFound();
  } 
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    }>
      <EditGalleryContent 
        initialTemplate={templateData} 
        locale={params.locale} 
        templateId={params.id} 
      />
    </Suspense>
  );
}