interface IArtWorkDetailsProps {
	title?: string;
	description?: string;
}
export default function ArtWorkDetails({
	title,
	description
}: IArtWorkDetailsProps) {
	return (
		<div className='flex flex-col gap-4'>
			<div className='flex justify-between items-center'>
				<h2 className='text-xl font-bold'>{title || 'Untitled'}</h2>
				{/* Thêm mesh cho nút close */}
			</div>
			<p className='text-gray-600 leading-relaxed'>
				{description || 'No description available'}
			</p>
		</div>
	);
}
