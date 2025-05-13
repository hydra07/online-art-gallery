import ExhibitionContent from "./exhibition-content";
import { notFound } from "next/navigation";
import { getExhibitionByLinkName } from "@/service/exhibition";
import { ExhibitionStatus } from "@/types/exhibition";

type PageProps = {
	params: {
		locale: string;
		linkname: string;
	};
	searchParams: Record<string, string | string[] | undefined>;
};

export default async function ExhibitionPage({ params }: PageProps) {
	const { linkname } = params;
	
	try {
		const { data } = await getExhibitionByLinkName(linkname);
		const exhibitionData = data?.exhibition;

		if (!exhibitionData || exhibitionData.status !== ExhibitionStatus.PUBLISHED) {
			return notFound();
		}

		return <ExhibitionContent exhibitionData={exhibitionData} />;
	} catch (error) {
		console.error('Error fetching exhibition:', error);
		return notFound();
	}
}