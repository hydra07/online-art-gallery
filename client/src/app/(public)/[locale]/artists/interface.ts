export type Artwork = {
    _id: string;
    title: string;
    description: string;
    category: string[];
    dimensions: { width: number; height: number; _id: string };
    url: string;
    status: 'available'  | 'hidden' | 'selling';
    artType: 'digitalart' | 'painting';    
    buyers: string[];
    views: number;
    price: number;
    createdAt: string;
    updatedAt: string;
    __v: number;

    moderationStatus: string;
};