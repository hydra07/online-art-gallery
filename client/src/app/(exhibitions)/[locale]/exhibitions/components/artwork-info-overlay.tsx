// src/app/(exhibitions)/[locale]/exhibitions/[linkname]/components/artwork-info-overlay.tsx
import { useState, useCallback } from 'react';
import {
	MoreHorizontal,
	ArrowLeft,
	Volume2,
	Volume1
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { OverlayButton } from './overlay-button';
import { LikeArtworkButton } from './like-artwork-button';
import { Session } from 'next-auth';

type User = Session['user'];

interface IArtworkInfoOverlayProps {
	artworkId: string;
	exhibitionId: string;
	likes?: {
		userIds: string[];
		count: number;
	};
	title?: string;
	size?: string; // Keep if used elsewhere, otherwise remove
	description?: string;
	user: User | undefined | null;
	onClose: () => void;
	// Removed onOverlayHoverChange prop
}

export function ArtworkInfoOverlay({
	title,
	artworkId,
	exhibitionId,
	likes,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	size,
	description,
	user,
	onClose
	// Removed onOverlayHoverChange from destructuring
}: IArtworkInfoOverlayProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const { isPlaying, toggle } = useSpeechSynthesis();

	const handleAudioToggle = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation(); // Add stopPropagation here too
		toggle(description || "No description available");
	}, [toggle, description]);

	const handleClose = useCallback(() => {
		onClose(); // Just call the passed onClose
	}, [onClose]);

	const handleExpandToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation(); // Add stopPropagation here too
		setIsExpanded(prev => !prev);
	};

	const fallbackTitle = 'Artwork Title';
	const fallbackDescription = 'No description available for this artwork.';

	return (
		<AnimatePresence>
			{/* No need for mouse enter/leave here */}
			<motion.div
				className='fixed bottom-2 w-[80%] ml-[10%] bg-white opacity-90 rounded-md shadow-lg pointer-events-auto'
				initial={{ y: '100%' }}
				animate={{ y: isExpanded ? '0%' : '80%' }}
				transition={{ type: 'spring', damping: 20 }}
				onClick={(e) => e.stopPropagation()}
			>
				<header className="flex items-center justify-between p-4 border-b border-gray-200">
					{/* Close button doesn't need stopPropagation as it calls handleClose which resets state */}
					<OverlayButton onClick={handleClose} aria-label='Close'>
						<ArrowLeft className="w-6 h-6" />
					</OverlayButton>

					<div className="flex items-center gap-2">
						<OverlayButton onClick={handleAudioToggle} aria-label={isPlaying ? 'Stop audio' : 'Play audio'}>
							{isPlaying ? (
								<Volume2 className="w-6 h-6 text-blue-500" />
							) : (
								<Volume1 className="w-6 h-6 text-gray-600" />
							)}
						</OverlayButton>

						{/* Like button already has stopPropagation */}
						<LikeArtworkButton
							artworkId={artworkId}
							exhibitionId={exhibitionId}
							likes={likes || { userIds: [], count: 0 }}
							user={user}
						/>

						<OverlayButton onClick={handleExpandToggle} aria-label={isExpanded ? 'Collapse' : 'Expand'}>
							<MoreHorizontal className="w-6 h-6 text-gray-600" />
						</OverlayButton>
					</div>
				</header>

				<section className="p-6 space-y-4">
					<h2 className="text-xl font-bold text-gray-900">{title || fallbackTitle}</h2>
					<p className="text-gray-600 leading-relaxed whitespace-normal break-words">{description || fallbackDescription}</p>
				</section>
			</motion.div>
		</AnimatePresence>
	);
}