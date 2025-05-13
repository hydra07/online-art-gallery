import { getExhibition } from "@/service/exhibition-service";
import ExhibitionLoading from "./loading";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ExhibitionPreview } from "../../exhibition-preview";

export default async function ExhibitionPreviewPage({ params }: { params: { id: string } }) {
  const response = await getExhibition(params.id);
  
  if (!response.data || !response.data.exhibition) {
    throw notFound();
  }

  const exhibition = response.data.exhibition;

  return (
    <Suspense fallback={<ExhibitionLoading />}>
      <ExhibitionPreview exhibition={exhibition} />
    </Suspense>
  );
}