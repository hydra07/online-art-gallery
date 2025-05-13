import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadToCloudinary(
	file: File,
	options: {
		folder?: string;
		publicId?: string;
		resourceType?: 'auto' | 'image' | 'video';
	}
) {
	const { folder = 'charms', publicId, resourceType = 'auto' } = options;
	return new Promise<{ secure_url: string; public_id: string }>(
		(resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					folder,
					public_id: publicId,
					resource_type: resourceType
				},
				(error, result) => {
					if (error) {
						reject(
							new Error(
								`Failed to upload image to Cloudinary: ${error.message}`
							)
						);
					} else if (result && 'secure_url' in result) {
						resolve({
							secure_url: result.secure_url,
							public_id: result.public_id
						});
					} else {
						reject(new Error('Invalid response from Cloudinary'));
					}
				}
			);

			file.arrayBuffer()
				.then((buffer) => {
					const uint8Array = new Uint8Array(buffer);
					uploadStream.end(uint8Array);
				})
				.catch((error) => {
					reject(new Error(`Failed to read file: ${error.message}`));
				});
		}
	);
}

export async function getCloudinaryUrl(
	publicId: string,
	options: {
		width?: number;
		height?: number;
		crop?: string;
		format?: string;
	} = {}
) {
	const { width, height, crop = 'fill', format = 'auto' } = options;

	return cloudinary.url(publicId, {
		width,
		height,
		crop,
		format,
		secure: true
	});
}

export async function uploadMultipleToCloudinary(
	files: File[],
	options: {
		folder?: string;
		publicId?: string;
		resourceType?: 'auto' | 'image' | 'video';
	}
) {
	return Promise.all(files.map((file) => uploadToCloudinary(file, options)));
}

export async function deleteFromCloudinary(publicId: string) {
	return new Promise<void>((resolve, reject) => {
		cloudinary.uploader.destroy(publicId, (error) => {
			if (error) {
				reject(
					new Error(
						`Failed to delete image from Cloudinary: ${error.message}`
					)
				);
			} else {
				resolve();
			}
		});
	});
}
