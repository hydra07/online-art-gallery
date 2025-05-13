import { getExhibitionById } from "@/service/exhibition";
import ResultContent from "./_components/result-content";
import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import { checkPremium } from '@/utils/premium';


export default async function ResultPage({
	params
}: {
	params: { id: string; locale: string }
}) {


	const { id } = params;
	const resExhibition = await getExhibitionById(id);
	const exhibition = resExhibition.data?.exhibition;

	//check is artist prenium
	const user = await getCurrentUser();
	if (!user) {
		return notFound();
	}
	const premiumStatus = await checkPremium(user.accessToken);
	const { isPremium } = premiumStatus;
	
	return (
		<ResultContent exhibition={exhibition!} isPremium={isPremium!} />
	)
}