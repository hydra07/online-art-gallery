const demo = [
	{
		id: '1',
		title: 'Sunset',
		description: 'A beautiful over the ocean',
		category: ['Landscape', 'Nature'],
		dimensions: { width: 100, height: 80 },
		images: [
			{
				url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
				type: 'main',
				order: 1
			}
		],
		status: 'Available',
		price: 5000000,
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01'),
		viewCount: 150
	},
	{
		id: '2',
		title: 'Mountain View',
		description: 'Majestic mountain peaks at sunrise',
		category: ['Landscape', 'Nature'],
		dimensions: { width: 120, height: 90 },
		images: [
			{
				url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9',
				type: 'main',
				order: 1
			}
		],
		status: 'Sold',
		price: 7500000,
		createdAt: new Date('2024-01-02'),
		updatedAt: new Date('2024-01-02'),
		viewCount: 200
	},
	{
		id: '3',
		title: 'Abstract Thoughts',
		description: 'An abstract of modern life',
		category: ['Abstract', 'Modern'],
		dimensions: { width: 80, height: 100 },
		images: [
			{
				url: 'https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3',
				type: 'main',
				order: 1
			}
		],
		status: 'Hidden',
		price: 1000000,
		createdAt: new Date('2024-01-03'),
		updatedAt: new Date('2024-01-03'),
		viewCount: 75
	},
	{
		id: '4',
		title: 'Urban Dreams',
		description: 'A cityscape at twilight',
		category: ['Urban', 'Architecture'],
		dimensions: { width: 150, height: 100 },
		images: [
			{
				url: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb',
				type: 'main',
				order: 1
			}
		],
		status: 'Available',
		price: 850000,
		createdAt: new Date('2024-01-04'),
		updatedAt: new Date('2024-01-04'),
		viewCount: 180
	},
	{
		id: '5',
		title: 'Floral Symphony',
		description: 'Vibrant garden flowers in bloom',
		category: ['Nature', 'Still Life'],
		dimensions: { width: 90, height: 90 },
		images: [
			{
				url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946',
				type: 'main',
				order: 1
			}
		],
		status: 'Available',
		price: 6000000,
		createdAt: new Date('2024-01-05'),
		updatedAt: new Date('2024-01-05'),
		viewCount: 120
	},
	{
		id: '6',
		title: 'Desert Whispers',
		description: 'Minimalist desert landscape at dawn',
		category: ['Landscape', 'Minimalist'],
		dimensions: { width: 120, height: 80 },
		images: [
			{
				url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35',
				type: 'main',
				order: 1
			}
		],
		status: 'Selling',
		price: 900000,
		createdAt: new Date('2024-01-06'),
		updatedAt: new Date('2024-01-06'),
		viewCount: 95
	}
];

export const ITEMS_PER_PAGE = 12;

export type StatusOption = {
  value: string;
  label: string;
  color: string;
  isTranslationKey?: boolean;
};

/**
 * Returns status options with translated labels
 * @param t - Translation function that takes a key and returns the translated string
 * @returns Array of status options with translated labels
 */
export const ARTWORK_STATUS = (t: (key: string) => string): StatusOption[] => {
  return [
    // { value: 'all', label: t('status.all'), color: 'bg-gray-500' },
    { value: 'available', label: t('status.available'), color: 'bg-emerald-500' },
    { value: 'sold', label: t('status.sold'), color: 'bg-red-500' },
    { value: 'hidden', label: t('status.hidden'), color: 'bg-gray-700' },
    { value: 'selling', label: t('status.selling'), color: 'bg-teal-500' },
  ];
};