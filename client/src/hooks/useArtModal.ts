import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { subscribeWithSelector } from 'zustand/middleware';
import { Artwork } from '@/types/marketplace';

interface ArtModalState {
	selected: Artwork | null;
	setSelected: (item: Artwork | null) => void;
	reset: () => void;
	isOpen: boolean;
	isClosing: boolean;
	startClosing: () => void;
}

export const useArtModal = create<ArtModalState>()(
	subscribeWithSelector((set) => ({
		selected: null,
		isOpen: false,
		isClosing: false,
		setSelected: (item) => set(state => {
			// Skip update if item is the same (by ID)
			if (item === null && state.selected === null) return state;
			if (item && state.selected && item._id === state.selected._id) return state;
			
			// Batch update both selected and isOpen in one operation
			return { selected: item, isOpen: !!item, isClosing: false };
		}),
		startClosing: () => set({ isClosing: true }),
		reset: () => set({ selected: null, isOpen: false, isClosing: false })
	}))
);

// Highly optimized selectors that only trigger re-renders when relevant values change
export const useSelectedArtId = () => useArtModal(state => state.selected?._id);
export const useSelectedArt = () => useArtModal(state => state.selected);
export const useIsArtModalOpen = () => useArtModal(state => state.isOpen);
export const useIsArtModalClosing = () => useArtModal(state => state.isClosing);

// Action selectors that never cause re-renders
export const useSetSelectedArt = () => useArtModal.getState().setSelected;
export const useStartClosingArtModal = () => useArtModal.getState().startClosing;
export const useResetArtModal = () => useArtModal.getState().reset;

// Observer utility to get current state without subscribing to changes
export const getArtModalState = () => useArtModal.getState();
