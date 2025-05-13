import FileUploader from '@/components/ui.custom/file-uploader';

export default function Test() {
	return (
		<section className='container mx-auto p-4 w-52'>
			<h2 className='text-xl font-semibold mb-2'>Single File Upload</h2>
			<FileUploader
				previewLayout='vertical'
				multiple
				// accept={{ 'image/*': ['jpg', 'jpeg', 'png', 'gif'] }}
			/>
		</section>
	);
}
