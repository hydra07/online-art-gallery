'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ThumbsUp, Heart, Laugh, Angry } from 'lucide-react';

type ReactionType = 'like' | 'love' | 'haha' | 'angry' | null;

const Reaction = React.forwardRef<
	HTMLInputElement,
	React.InputHTMLAttributes<HTMLInputElement> & {
		initialCount?: number;
		onReactionChange?: (reaction: ReactionType) => void;
	}
>(({ initialCount = 0, onReactionChange, className, ...props }, ref) => {
	const [count, setCount] = useState(initialCount);
	const [currentReaction, setCurrentReaction] = useState<ReactionType>(null);
	const [showReactions, setShowReactions] = useState(false);

	const reactionConfig = {
		like: {
			icon: ThumbsUp,
			color: 'text-blue-600',
			label: 'Thích',
			fillWhenActive: true
		},
		love: {
			icon: Heart,
			color: 'text-red-600',
			label: 'Yêu thích',
			fillWhenActive: true
		},
		haha: {
			icon: Laugh,
			color: 'text-amber-500',
			label: 'Haha',
			fillWhenActive: false
		},
		angry: {
			icon: Angry,
			color: 'text-red-500',
			label: 'Phẫn nộ',
			fillWhenActive: false
		}
	};

	const handleReaction = (type: ReactionType) => {
		if (currentReaction === type) {
			setCount((prev) => prev - 1);
			setCurrentReaction(null);
		} else {
			if (!currentReaction) setCount((prev) => prev + 1);
			setCurrentReaction(type);
		}
		onReactionChange?.(type);
		setShowReactions(false);
	};

	const getCurrentIcon = () => {
		if (!currentReaction) return ThumbsUp;
		return reactionConfig[currentReaction].icon;
	};

	const getCurrentColor = () => {
		if (!currentReaction) return 'text-gray-600';
		return reactionConfig[currentReaction].color;
	};

	const shouldFillIcon = (type: ReactionType) => {
		if (!type) return false;
		return reactionConfig[type].fillWhenActive;
	};

	return (
		<div className='relative group'>
			<div className='relative'>
				<button
					onClick={() => handleReaction('like')}
					className={cn(
						'flex items-center gap-1 px-3 py-2 rounded-full transition-all',
						'hover:bg-gray-100',
						getCurrentColor()
					)}
				>
					{React.createElement(getCurrentIcon(), {
						className: cn(
							'w-5 h-5',
							currentReaction &&
								shouldFillIcon(currentReaction) &&
								'fill-current'
						)
					})}
					<span className='ml-1'>{count}</span>
				</button>

				{/* Invisible area to maintain hover */}
				<div className='absolute bottom-full left-0 w-full h-3' />

				{/* Reaction Menu */}
				<div
					className={cn(
						'absolute bottom-full left-0 mb-2 flex items-center gap-1 bg-white rounded-full shadow-lg p-1',
						'opacity-0 group-hover:opacity-100 invisible group-hover:visible',
						'transition-all duration-200'
					)}
				>
					{Object.entries(reactionConfig).map(([type, config]) => (
						<button
							key={type}
							onClick={() => handleReaction(type as ReactionType)}
							className={cn(
								'p-2 rounded-full transition-all hover:scale-125',
								config.color,
								currentReaction === type && 'bg-gray-100'
							)}
							title={config.label}
						>
							{React.createElement(config.icon, {
								className: cn(
									'w-5 h-5',
									currentReaction === type &&
										shouldFillIcon(type as ReactionType) &&
										'fill-current'
								)
							})}
						</button>
					))}
				</div>
			</div>
		</div>
	);
});

Reaction.displayName = 'Reaction';

export { Reaction };
