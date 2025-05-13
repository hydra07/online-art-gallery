import { ARTWORK_URL } from '@/utils/constants';
import { GalleryRequestResponse, GalleryTemplateData } from '@/types/gallery';
import { GetGalleriesResponse } from '@/types/gallery';
import { ApiResponse } from '@/types/response';
import { createApi } from '@/lib/axios';
import { handleApiError } from '@/utils/error-handler';

const exhibitions = [
    {
        id: "6071b3e5c1b4d82edc4eda30",
        name: "Modern Abstract Exhibition 2023",
        galleryModel: {
            id: 'modern-a2',
            name: 'Modern A2 Gallery',
            description: 'A spacious modern gallery with open layout',
            dimension: {
                xAxis: 40,
                yAxis: 40,
                zAxis: 40
            },
            wallThickness: 0.2,
            wallHeight: 3,
            modelPath: '/modern-a2-gallery.glb',
            modelRotation: [0, 0, 0] as [number, number, number],
            modelPosition: [0, 0, 0] as [number, number, number],
            modelScale: 4,
            customCollider: {
                shape: 'box' as const,
                args: [4, 4, 4] as [number, number, number],
                position: [0, 1.5, 0] as [number, number, number],
            },
        },
        title: "Modern Abstract Exhibition",
        author: "Jane Smith",
        date: "31.1.2025",
        description: "Experience a stunning collection of contemporary abstract artworks in this immersive virtual gallery.",
        thumbnail: "https://images.unsplash.com/photo-1561214115-f2f134cc4912",
        backgroundImage: "https://res.cloudinary.com/djvlldzih/image/upload/v1738920776/gallery/arts/phiadv4m1kbsxidfostr.jpg",
        walls: {
            back: {
                artworkCount: 3,
                artworks: [
                    {
                        id: "1",
                        url: ARTWORK_URL.ARTWORK_1,
                        positionIndex: 0, // Vị trí trái
                        frame: { color: '#4a2c12', thickness: 0.05 }
                    },
                    {
                        id: "2",
                        url: ARTWORK_URL.ARTWORK_2,
                        positionIndex: 1, // Vị trí giữa
                    },
                    {
                        id: "3",
                        url: ARTWORK_URL.ARTWORK_3,
                        positionIndex: 2, // Vị trí phải
                        frame: { color: '#4a2c12', thickness: 0.05 }
                    }
                ]
            },
            left: {
                artworkCount: 2,
                artworks: [
                    {
                        id: "4",
                        url: ARTWORK_URL.ARTWORK_4,
                        positionIndex: 0, // Vị trí trước
                        frame: { color: '#4a2c12', thickness: 0.05 }
                    },
                    {
                        id: "5",
                        url: ARTWORK_URL.ARTWORK_2,
                        positionIndex: 1, // Vị trí sau
                        frame: { color: '#3d2815', thickness: 0.05 }
                    }
                ]
            },
            right: {
                artworkCount: 2, // Tổng số vị trí có sẵn
                artworks: [
                    {
                        id: "6",
                        url: ARTWORK_URL.ARTWORK_1,
                        positionIndex: 1,
                        frame: { color: '#4a2c12', thickness: 0.05 }
                    }
                    // Không đặt tranh ở vị trí thứ hai (positionIndex: 1)
                ]
            }
        }
    },
    {
        id: "6071b3e5c1b4d82edc4eda31",
        name: "Contemporary Art Showcase 2025",
        galleryModel: {
            id: 'modern-a1',
            name: 'Modern A1 Gallery',
            description: 'An elegant minimalist gallery with perfect lighting',
            dimension: {
                xAxis: 18.8,
                yAxis: 14,
                zAxis: 30
            },
            wallThickness: 0.2,
            wallHeight: 3,
            modelPath: '/modern-a1-gallery.glb',
            modelPosition: [0, 0, 0] as [number, number, number],
            modelRotation: [0, 0, 0] as [number, number, number],
            modelScale: 3,
        },
        title: "Contemporary Art Showcase",
        author: "Alex Johnson",
        date: "15.3.2025",
        description: "A curated selection of contemporary masterpieces from emerging artists around the world.",
        thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
        backgroundImage: "https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg",
        walls: {
            back: {
                artworkCount: 3,
                artworks: [
                    {
                        id: "2",
                        url: ARTWORK_URL.ARTWORK_2,
                        positionIndex: 1
                    }
                ]
            },
            front: {
                artworkCount: 1,
                artworks: [
                    {
                        id: "8",
                        url: ARTWORK_URL.ARTWORK_1,
                        positionIndex: 0,
                    }
                ]
            },
            left: {
                artworkCount: 2,
                artworks: [
                    {
                        id: "4",
                        url: ARTWORK_URL.ARTWORK_2,
                        positionIndex: 0,
                    },
                    {
                        id: "5",
                        url: ARTWORK_URL.ARTWORK_3,
                        positionIndex: 1,
                    }
                ]
            },
            right: {
                artworkCount: 2,
                artworks: [
                    // Vị trí tùy chỉnh hoàn toàn (không sử dụng positionIndex)
                    {
                        id: "6",
                        url: ARTWORK_URL.ARTWORK_4,
                        position: [19.9, 2.5, -6], // Tọa độ tùy chỉnh
                        rotation: [0, -Math.PI / 2, 0], // Xoay tùy chỉnh                   
                    }
                ]
            }
        }
    },
];

export async function getExhibitions(id: string) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
        const data = exhibitions.find(exhibition => exhibition.id === id);
        return data;
    } catch (error) {
        console.error('Error fetching exhibitions:', error);
        throw error;
    }
}



// Function to upload an asset to cloud storage
export async function uploadAsset(file: File) {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'gallery_assets'); // Your Cloudinary upload preset

    try {
        // Replace with your actual upload endpoint
        const response = await fetch('https://api.cloudinary.com/v1_1/your-cloud-name/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed with status ${response.status}`);
        }

        const data = await response.json();

        return {
            url: data.secure_url,
            publicId: data.public_id,
            width: data.width,
            height: data.height,
            format: data.format,
        };
    } catch (error) {
        console.error('Error uploading asset:', error);
        throw new Error('Failed to upload asset');
    }
}

// Function to save or update a gallery template
export async function saveGalleryTemplate(templateData: GalleryTemplateData): Promise<GalleryTemplateData> {
    try {
        // For new templates (no ID)
        if (!templateData.id) {
            // In a real app, call your API endpoint
            // const response = await fetch('/api/gallery/templates', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(templateData),
            // });

            // For this example, we'll simulate an API response

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Return mock response with generated ID
            return {
                ...templateData,
                id: `template_${Date.now()}`,
            };
        }
        // For updating existing templates
        else {
            // const response = await fetch(`/api/gallery/templates/${templateData.id}`, {
            //   method: 'PUT',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(templateData),
            // });


            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Return the updated template
            return templateData;
        }
    } catch (error) {
        console.error('Error saving gallery template:', error);
        throw new Error('Failed to save gallery template');
    }
}

export async function getGalleryTemplates(params?: {
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
    search?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter?: Record<string, any>;
}): Promise<ApiResponse<GetGalleriesResponse>> {
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        if (params?.sort) queryParams.set('sort', JSON.stringify(params.sort));
        if (params?.search) queryParams.set('search', params.search);
        if (params?.filter) queryParams.set('filter', JSON.stringify(params.filter)); 

        const url = `/gallery/public${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const res = await createApi().get(url);
        return res.data;
    } catch (error) {
        console.error('Error getting gallery templates:', error);
        throw handleApiError<GetGalleriesResponse>(
            error,
            'Failed to fetch gallery templates'
        );
    }
}

// Function to get a single gallery template by ID
export async function getGalleryTemplate(id: string): Promise<ApiResponse<GalleryRequestResponse>> {
    try {
        const res = await createApi().get(`/gallery/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error getting gallery template ${id}:`, error);
        throw handleApiError<GalleryRequestResponse>(
            error,
            'Failed to fetch gallery template'
        );
    }
}
