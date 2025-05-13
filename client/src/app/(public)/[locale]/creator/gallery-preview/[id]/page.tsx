import PreviewMode from "@/app/(exhibitions)/[locale]/exhibitions/components/preview-mode";
import { getGalleryTemplate } from "@/service/gallery";
import { notFound } from "next/navigation";

export default async function GalleryPreview({params} : {params: {locale: string, id: string}}) {
  const galleryId = params.id;
  const galleryResponse = await getGalleryTemplate(galleryId);
  const gallery = galleryResponse.data?.gallery;
  if (!gallery) {
    return notFound();
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      <PreviewMode templateData={gallery} />
    </div>
  );
}