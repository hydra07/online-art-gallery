'use client';
import { createAxiosInstance } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
export interface FileUploadOptions {
	// type?: 'string';
	refId?: string;
	refType?: string;
}
export interface FileUpload {
	id: string;
	url: string;
	publicId: string;
	file: File;
	width: number;
	height: number;
}
export interface FileUploadProgress {
	file: File;
	progress: number;
	publicId?: string;
}

function useFileUpload(options: FileUploadOptions = {
},artwork:boolean = false) {
	const [completedUploads, setCompletedUploads] = useState<FileUpload[]>([]);
	const [pendingUploads, setPendingUploads] = useState<FileUploadProgress[]>(
		[]
	);

	const addFiles = useCallback((files: File[], multiple: boolean = true) => {
		setPendingUploads((prev) => {
			if (!multiple) {
				return files.map((file) => ({ file, progress: 0 }));
			}
			const newFiles = files
				.filter(
					(file) =>
						!prev.some(
							(item) =>
								item.file.name === file.name &&
								item.file.size === file.size &&
								item.file.lastModified === file.lastModified
						)
				)
				.map((file) => ({ file, progress: 0 }));
			return [...prev, ...newFiles];
		});
	}, []);

	const removeFiles = useCallback((file: File) => {
		setPendingUploads((prev) => prev.filter((item) => item.file !== file));
	}, []);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onUpload = useMutation<any[], Error, FileUploadProgress[]>({
		mutationFn: async (pendingUploads: FileUploadProgress[]) => {
			const uploadPromises = pendingUploads.map(
				async ({ file }): Promise<FileUpload |FileUpload[]| null> => {
					//if file in completedUploads, skip
					if (
						completedUploads.some(
							(item) =>
								// item.file === file &&
								item.file.size === file.size &&
								item.file.lastModified === file.lastModified &&
								item.file.name === file.name
						)
					)
						return null;
					const formData = new FormData();
					formData.append('file', file);
					if (options.refType)
						formData.append('refType', options.refType);
					if (options.refId) formData.append('refId', options.refId);
					// if file is an image, save width and height
					if (file.type.startsWith('image/')) {
						await new Promise<void>((resolve, reject) => {
							const reader = new FileReader();
							reader.onload = function (e) {
								const result = e.target?.result;
								if (typeof result === 'string') {
									const img = new Image();
									img.src = result;
									img.onload = function () {
										formData.append(
											'width',
											img.width.toString()
										);
										formData.append(
											'height',
											img.height.toString()
										);
										resolve();
									};
									img.onerror = reject;
								} else {
									reject(
										new Error(
											'FileReader result is not a string.'
										)
									);
								}
							};
							reader.onerror = reject;
							reader.readAsDataURL(file);
						});
					}
					const axios = await createAxiosInstance({
						// useToken: true
					});
					if (!axios) throw new Error('Axios instance not created');

					if (artwork) {
						const res = await axios.post('/upload/artwork', formData, {
						headers: {
							'Content-Type': 'multipart/form-data'
						},
						onUploadProgress(progressEvent) {
							const progress = Math.round(
								(progressEvent.loaded * 100) /
									(progressEvent.total || 1)
							);
							setPendingUploads((prev) =>
								prev.map((item) =>
									item.file === file
										? { file, progress }
										: item
								)
							);
						}
					});
					console.log(res.data);
					// res.data.file = file;
					//map file to res.data
					if (Array.isArray(res.data)) {
						res.data = res.data.map((item: any) => {
							item.file = file;
							return item;
						});
					} else {
						res.data.file = file;
					}
					return res.data as FileUpload[];
					} else {
						const res = await axios.post('/upload', formData, {
						headers: {
							'Content-Type': 'multipart/form-data'
						},
						onUploadProgress(progressEvent) {
							const progress = Math.round(
								(progressEvent.loaded * 100) /
									(progressEvent.total || 1)
							);
							setPendingUploads((prev) =>
								prev.map((item) =>
									item.file === file
										? { file, progress }
										: item
								)
							);
						}
					});
					console.log(res.data);
					res.data.file = file;
					return res.data as FileUpload;
					}
					
				}
			);

			const results = await Promise.all(uploadPromises);
			const processedResults = results.filter(
				(res) => res !== null && res !== undefined
			).map((res) => {
				if (Array.isArray(res)) {
					return res.map((item) => ({
						id: item.id,
						url: item.url,
						publicId: item.publicId,
						file: item.file,
						width: item.width,
						height: item.height
					}));
				} else {
					return {
						id: res.id,
						url: res.url,
						publicId: res.publicId,
						file: res.file,
						width: res.width,
						height: res.height
					};
				}
			}
			);
			// setCompletedUploads((prev) => [
			// 	...prev,
			// 	...results
			// 		.filter((res) => res !== null && res !== undefined)
			// 		.map((res) => ({
			// 			id: res.id, //TODO: check if id is always available
			// 			url: res.url,
			// 			publicId: res.publicId,
			// 			file: res.file,
			// 			width: res.width,
			// 			height: res.height
			// 		}))
			// ]);
			console.log('completedUploads', processedResults);
			setCompletedUploads((prev) => [
				...prev,
				...processedResults.flat()
			]);
			return results;
		}
	});
	const clearUploads = useCallback(() => {
		setPendingUploads([]);
		setCompletedUploads([]);
	}, []);
	return {
		pendingUploads,
		completedUploads,
		addFiles,
		removeFiles,
		onUpload,
		clearUploads
	};
}

export default useFileUpload;
