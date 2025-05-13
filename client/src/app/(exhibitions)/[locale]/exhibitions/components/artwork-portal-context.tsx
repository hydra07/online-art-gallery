import { createContext, useContext, useState } from 'react';

interface ArtworkDetails {
	id: string;
	title?: string;
	description?: string;
}

interface ArtworkPortalContextType {
	activeArtwork: ArtworkDetails | null;
	setActiveArtwork: (artwork: ArtworkDetails | null) => void;
	showPortal: (artwork: ArtworkDetails) => void;
	hidePortal: () => void;
}

const ArtworkPortalContext = createContext<ArtworkPortalContextType | null>(
	null
);

export function ArtworkPortalProvider({
	children
}: {
	children: React.ReactNode;
}) {
	const [activeArtwork, setActiveArtwork] = useState<ArtworkDetails | null>(
		null
	);

	const showPortal = (artwork: ArtworkDetails) => {
		setActiveArtwork(artwork);
	};

	const hidePortal = () => {
		setActiveArtwork(null);
	};

	return (
		<ArtworkPortalContext.Provider
			value={{ activeArtwork, setActiveArtwork, showPortal, hidePortal }}
		>
			{children}
		</ArtworkPortalContext.Provider>
	);
}

export function useArtworkPortal() {
	const context = useContext(ArtworkPortalContext);
	if (!context) {
		throw new Error(
			'useArtworkPortal must be used within an ArtworkPortalProvider'
		);
	}
	return context;
}
