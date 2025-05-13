'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";

type Artwork = {
	id: string;
	title: string;
	imageUrl: string;
};

type Collection = {
	id: string;
	name: string;
	description: string;
	coverImage: string;
	artworks: Artwork[];
};

export default function CollectionDetail() {
	const params = useParams();
	const [collection, setCollection] = useState<Collection | null>(null);
	const [artworkToDelete, setArtworkToDelete] = useState<Artwork | null>(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	
	// Tạm thời dùng mock data, sau này sẽ thay bằng API call thực tế
	useEffect(() => {
		// Mock data - thay thế bằng API call thực tế sau này
		const mockCollection: Collection = {
			id: '1',
			name: 'Summer Collection',
			description: 'Artworks inspired by summer vibes and beach scenes',
			coverImage: 'https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg',
			artworks: [
				{
					id: 'a1',
					title: 'Beach Sunset',
					imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946'
				},
				{
					id: 'a2',
					title: 'Tropical Paradise',
					imageUrl: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb'
				},
				{
					id: 'a5',
					title: 'Ocean View',
					imageUrl: 'https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3'
				},
				{
					id: 'a6',
					title: 'Sandy Beach',
					imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9'
				},
				{
					id: 'a7',
					title: 'Palm Trees',
					imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5'
				},
			]
		};
		setCollection(mockCollection);
	}, [params.id]);

	const handleDeleteArtwork = (artwork: Artwork) => {
		setArtworkToDelete(artwork);
		setShowDeleteDialog(true);
	};

	const confirmDelete = () => {
		if (collection && artworkToDelete) {
			const updatedArtworks = collection.artworks.filter(
				art => art.id !== artworkToDelete.id
			);
			setCollection({
				...collection,
				artworks: updatedArtworks
			});
		}
		setShowDeleteDialog(false);
		setArtworkToDelete(null);
	};

	if (!collection) {
		return <div>Loading...</div>;
	}

	return (
		<div className="max-w-7xl mx-auto p-4">
			{/* Header */}
			<div className="mb-8">
				<div className="flex items-center gap-4 mb-6">
					<Link href="/artists/collections">
						<Button variant="ghost" size="sm">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Collections
						</Button>
					</Link>
				</div>
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
							{collection.name}
						</h1>
						<p className="mt-2 text-muted-foreground">{collection.description}</p>
					</div>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="default">
								<Plus className="w-4 h-4 mr-2" />
								Add Artwork
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add New Artwork</DialogTitle>
							</DialogHeader>
							{/* Thêm form upload artwork ở đây */}
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Grid Artworks */}
			<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{collection.artworks.map((artwork) => (
					<div
						key={artwork.id}
						className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
					>
						<Image
							src={artwork.imageUrl}
							alt={artwork.title}
							fill
							className="object-cover transition-transform group-hover:scale-110"
						/>
						<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
							<Button 
								variant="destructive" 
								size="icon" 
								className="self-end"
								onClick={() => handleDeleteArtwork(artwork)}
							>
								<Trash2 className="w-4 h-4" />
							</Button>
							<h3 className="text-white font-medium">{artwork.title}</h3>
						</div>
					</div>
				))}
			</div>

			<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Remove Artwork</DialogTitle>
						<DialogDescription>
							Are you sure you want to remove &quot;{artworkToDelete?.title}&quot; from this collection?
							This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex gap-2">
						<Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={confirmDelete}>
							Remove
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
