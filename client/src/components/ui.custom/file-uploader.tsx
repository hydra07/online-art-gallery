'use client';

// import { Button } from '@/components/ui/button';
import { Lightbox } from '@/components/ui.custom/lightbox';
import useFileUpload, {
	FileUpload,
	FileUploadProgress
} from '@/hooks/useFileUploads';
import { formatFileSize } from '@/utils/converters';
import { AnimatePresence, motion } from 'framer-motion';
import { File, Upload, X } from 'lucide-react';
import Image from 'next/image';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
	multiple?: boolean;
	accept?: Record<string, string[]>;
	maxFiles?: number;
	maxSize?: number;
	icon?: React.ReactNode;
	previewLayout?: 'horizontal' | 'vertical';
	onFilesChange?: (files: File[]) => void;
	options?: {
		refId?: string;
		refType?: string;
	};
	// onFileUpload?: (
	// 	url: string | string[],
	// 	width?: number,
	// 	height?: number,
	// 	_id?: string
	// ) => void; // Thêm onUpload để lưu path file
	onFileUpload?: (
		files: {
			url: string;
			width?: number;
			height?: number;
			_id?: string;
		}[]
	) => void;
	artwork?: boolean;
}

const DropZone = memo(
	({
		getInputProps,
		isDragAccept,
		isDragReject,
		isDragActive,
		multiple,
		maxFiles,
		maxSize,
		icon
	}: {
		getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
		isDragAccept: boolean;
		isDragReject: boolean;
		isDragActive: boolean;
		multiple: boolean;
		maxFiles: number;
		maxSize: number;
		icon?: React.ReactNode;
	}) => {
		const motionProps = {
			initial: { opacity: 0.6 },
			animate: { opacity: 1 },
			transition: { duration: 0.2 }
		};
		const getDropzoneColor = () => {
			if (isDragAccept) return 'border-green-500 bg-green-50';
			if (isDragReject) return 'border-red-500 bg-red-50';
			return 'border-gray-300 hover:border-primary';
		};

		const getDropzoneIconColor = () => {
			if (isDragAccept) return 'text-green-500';
			if (isDragReject) return 'text-red-500';
			return isDragActive ? 'text-primary' : 'text-gray-400';
		};

		const getDropzoneTextColor = () => {
			if (isDragAccept) return 'text-green-600';
			if (isDragReject) return 'text-red-600';
			return isDragActive ? 'text-primary' : 'text-gray-500';
		};
		return (
			<div className='rounded-lg'>
				<motion.div
					className={`p-4 sm:p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200 ${getDropzoneColor()}`}
					{...motionProps}
				>
					<input {...getInputProps()} />
					<motion.div
						initial={{ scale: 1 }}
						animate={{ scale: isDragActive ? 1.1 : 1 }}
						transition={{ duration: 0.2 }}
					>
						{icon ? (
							<div className={`flex justify-center items-center mx-auto transition-colors duration-200 ${getDropzoneIconColor()}`}>
								{icon}
							</div>
						) : (
							<Upload
								className={`mx-auto h-8 w-8 sm:h-12 sm:w-12 transition-colors duration-200 ${getDropzoneIconColor()}`}
							/>
						)}
					</motion.div>
					<p
						className={`mt-2 text-xs sm:text-sm transition-colors duration-200 ${getDropzoneTextColor()}`}
					>
						{isDragReject
							? 'Some files are not allowed!'
							: "Drag 'n' drop some files here, or click to select files"}
					</p>
					<p
						className={`mt-1 text-xs transition-colors duration-200 ${getDropzoneTextColor()}`}
					>
						{multiple
							? `Up to ${maxFiles} files, each up to ${formatFileSize(
								maxSize
							)}`
							: `One file up to ${formatFileSize(maxSize)}`}
					</p>
				</motion.div>
			</div>
		);
	}
);
DropZone.displayName = 'DropZone';

const Preview = memo(
	({
		pendingUploads,
		completedUploads,
		setLightboxImage,
		removeFiles,
		previewLayout
	}: {
		pendingUploads: FileUploadProgress[];
		completedUploads: FileUpload[];
		setLightboxImage: (image: { src: string; alt: string } | null) => void;
		removeFiles: (file: File) => void;
		previewLayout: 'horizontal' | 'vertical';
	}) => {
		const getPreviewContainerClass = () => {
			if (previewLayout === 'horizontal') {
				return 'flex flex-nowrap gap-2 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory';
			}
			// return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 min-w-36';
			return 'grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4';
		};

		const getPreviewItemClass = () => {
			if (previewLayout === 'horizontal') {
				return 'flex-none w-36 xs:w-40 sm:w-48 md:w-52 lg:w-56 snap-start';
			}
			return 'w-full';
		};
		return (
			<AnimatePresence>
				{pendingUploads.length > 0 && (
					<motion.div
						className={getPreviewContainerClass()}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
					>
						{pendingUploads.map((item, index) => (
							<motion.div
								key={`${item.file.name}-${index}`}
								className={`${getPreviewItemClass()} relative group`}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{
									duration: 0.2,
									delay: index * 0.1
								}}
							>
								{item.file.type.startsWith('image/') ? (
									<div className='flex flex-col w-full'>
										<div className='w-full aspect-[5/3] overflow-hidden rounded-lg shadow-md'>
											<div
												className='h-full w-full cursor-pointer relative'
												onClick={() =>
													setLightboxImage({
														src: URL.createObjectURL(
															item.file
														),
														alt: item.file.name
													})
												}
											>
												<Image
													src={URL.createObjectURL(
														item.file
													)}
													alt={item.file.name}
													fill
													style={{
														objectFit: 'cover'
													}}
													className='transition-transform duration-200'
												/>
												{!completedUploads.some(
													(upload) =>
														upload.file.name ===
														item.file.name
												) && (
														<motion.div
															className='flex items-center justify-center space-x-2 w-full h-full absolute inset-0 bg-black/50'
															initial={{ opacity: 0 }}
															animate={{ opacity: 1 }}
															exit={{ opacity: 0 }}
															transition={{
																duration: 0.3
															}}
														>
															{/* Spinning Loader */}
															<motion.div
																className='w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin'
																style={{
																	animationDuration:
																		'0.75s'
																}}
															/>
															<motion.p
																className='text-white text-sm font-medium'
																transition={{
																	repeat: Infinity,
																	repeatType:
																		'reverse',
																	duration: 0.5
																}}
															>
																Uploading...
															</motion.p>
														</motion.div>
													)}

												<motion.div
													className='absolute inset-0 bg-black/50 flex items-center justify-center opacity-0'
													initial={{ opacity: 0 }}
													whileHover={{
														opacity: 1
													}}
													exit={{ opacity: 0 }} // Thêm exit animation
													transition={{
														duration: 0.2
													}}
												>
													<motion.button
														className='absolute top-1 right-1 sm:top-2 sm:right-2 h-4 w-4 sm:h-5 sm:w-5 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center'
														whileHover={{
															rotate: 180
														}}
														transition={{
															duration: 0.3,
															ease: 'easeInOut'
														}}
														onClick={(e) => {
															e.stopPropagation();
															removeFiles(
																item.file
															);
														}}
													>
														<X className='h-2 w-2 sm:h-3 sm:w-3 text-white' />
													</motion.button>
												</motion.div>
											</div>
										</div>
										<div className='mt-1 sm:mt-2 px-1'>
											<p className='text-xs sm:text-sm text-gray-700 font-medium truncate'>
												{item.file.name}
											</p>
											<p className='text-xs text-gray-500'>
												{formatFileSize(item.file.size)}
											</p>
										</div>
									</div>
								) : (
									<div className='p-2 sm:p-4 border rounded-lg relative group shadow-sm hover:shadow-md transition-shadow duration-200'>
										{!completedUploads.some(
											(upload) =>
												upload.file.name ===
												item.file.name
										) && (
												<motion.div
													className='flex items-center justify-center space-x-2 w-full h-full border rounded-lg absolute inset-0 bg-black/50'
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													transition={{
														duration: 0.3
													}}
												>
													{/* Spinning Loader */}
													<motion.div
														className='w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin'
														style={{
															animationDuration:
																'0.75s'
														}}
													/>
													<motion.p
														className='text-white text-sm font-medium'
														transition={{
															repeat: Infinity,
															repeatType: 'reverse',
															duration: 0.5
														}}
													>
														Uploading...
													</motion.p>
												</motion.div>
											)}
										<div className='flex items-start space-x-2 sm:space-x-3'>
											<div className='flex-shrink-0'>
												<File className='h-6 w-6 sm:h-8 sm:w-8 text-blue-500' />
											</div>
											<div className='flex-1 min-w-0'>
												<p className='text-xs sm:text-sm text-gray-700 font-medium truncate'>
													{item.file.name}
												</p>
												<p className='text-xs text-gray-500 mt-0.5 sm:mt-1'>
													{formatFileSize(
														item.file.size
													)}
												</p>
											</div>
											<motion.button
												className='flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100'
												whileHover={{ scale: 1.1 }}
												onClick={() =>
													removeFiles(item.file)
												}
											>
												<X className='h-3 w-3 sm:h-4 sm:w-4 text-red-600' />
											</motion.button>
										</div>
									</div>
								)}
							</motion.div>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		);
	}
);
Preview.displayName = 'Preview';

const FileUploader: React.FC<FileUploaderProps> = ({
	multiple = false,
	accept,
	icon,
	maxFiles = 5,
	maxSize = 5 * 1024 * 1024, // 5MB
	previewLayout = 'horizontal',
	onFilesChange,
	options,
	onFileUpload,
	artwork = false
}) => {
	const {
		pendingUploads,
		completedUploads,
		addFiles,
		removeFiles,
		onUpload,
	} = useFileUpload(options,artwork);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			addFiles(acceptedFiles, multiple);
			if (onFilesChange) {
				onFilesChange(acceptedFiles);
			}
		},
		[multiple, onFilesChange, addFiles]
	);

	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject
	} = useDropzone({
		onDrop,
		accept,
		multiple,
		maxFiles,
		maxSize
	});

	const [lightboxImage, setLightboxImage] = useState<{
		src: string;
		alt: string;
	} | null>(null);

	const dropzoneProps = getRootProps();

	// const handleUpload = () => {
	// 	if (pendingUploads.length === 0) {
	// 		alert('No files to upload!');
	// 		return;
	// 	}
	// 	onUpload.mutate(pendingUploads, {
	// 		onSuccess: (data) => {
	// 			console.log('Upload successful!', data);
	// 		},
	// 		onError: (error) => {
	// 			console.error('Upload failed:', error);
	// 		}
	// 	});
	// };

	const prevPendingUploadsRef = useRef(pendingUploads);
	const areUploadsEqual = (
		a: FileUploadProgress[],
		b: FileUploadProgress[]
	) => {
		if (a.length !== b.length) return false;
		return a.every((upload, index) => {
			const otherUpload = b[index];
			return (
				upload.file.name === otherUpload.file.name &&
				upload.file.size === otherUpload.file.size &&
				upload.file.type === otherUpload.file.type
			);
		});
	};
	const uploadedFilesRef = useRef(new Set<string>());
	useEffect(() => {
		if (pendingUploads.length === 0) return;
		if (areUploadsEqual(pendingUploads, prevPendingUploadsRef.current))
			return;

		onUpload.mutate(pendingUploads, {
			onSuccess: (data) => {
				console.log('Upload successful!', data);
			},
			onError: (error) => {
				console.error('Upload failed:', error);
			}
		});

		prevPendingUploadsRef.current = [...pendingUploads];
	}, [pendingUploads, onUpload]);

	useEffect(() => {
		if (!onFileUpload || completedUploads.length === 0) return;
		console.log(artwork)
		if (artwork) {
  
  onFileUpload(completedUploads)

//   if (newCompletedFiles.length > 0) {
//     const newFiles = newCompletedFiles.map((file) => ({
//       url: file.url,
//       width: file.width,
//       height: file.height,
//       id: file.id,
//     }));

//     console.log('🎉 Final newFiles to upload:', newFiles);
//     onFileUpload(newFiles);
//   }
}
 else {

			const newCompletedFiles = completedUploads.filter((completedFile) => {
				const isPending = pendingUploads.some(
					(pendingFile) =>
						pendingFile.file.name === completedFile.file.name &&
						pendingFile.file.size === completedFile.file.size &&
						pendingFile.file.type === completedFile.file.type
				);
	
				const fileKey = `${completedFile.file.name}-${completedFile.file.size}`;
				const isNewFile = !uploadedFilesRef.current.has(fileKey);
	
				if (isPending && isNewFile) {
					uploadedFilesRef.current.add(fileKey);
					return true;
				}
				return false;
			});
	
	
			if (newCompletedFiles.length > 0) {
				// const newUrls = newCompletedFiles.map((file) => file.url);
				// onFileUpload(newUrls);
				const newFiles = newCompletedFiles.map((file) => ({
					url: file.url,
					width: file.width,
					height: file.height,
					id: file.id
				}));
				console.log('New files:', newFiles);
				onFileUpload(newFiles);
			}
		}


	}, [completedUploads, onFileUpload, pendingUploads]);
	return (
		<>
			<div className='space-y-4 w-full max-w-full p-2'>
				{/* <Button
					onClick={handleUpload}
					disabled={pendingUploads.length === 0}
					className={`flex items-center px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed ${
						pendingUploads.length > 0
							? 'bg-green-500 hover:bg-green-700 focus:ring-green-400'
							: 'bg-blue-500 text-white hover:bg-blue-700 focus:ring-blue-400'
					}`}
				>
					<UploadIcon className='h-4 w-4 mr-2' />
					Upload
				</Button> */}
				<div className='p-1 shadow rounded-lg' {...dropzoneProps}>
					<DropZone
						getInputProps={getInputProps}
						isDragAccept={isDragAccept}
						isDragReject={isDragReject}
						isDragActive={isDragActive}
						multiple={multiple}
						maxFiles={maxFiles}
						maxSize={maxSize}
						icon={icon}
					/>
				</div>
				<Preview
					pendingUploads={pendingUploads}
					completedUploads={completedUploads}
					setLightboxImage={setLightboxImage}
					removeFiles={removeFiles}
					previewLayout={previewLayout}
				/>
			</div>
			{lightboxImage && (
				<Lightbox
					src={lightboxImage.src}
					alt={lightboxImage.alt}
					onClose={() => setLightboxImage(null)}
				/>
			)}
		</>
	);
};

export default FileUploader;
