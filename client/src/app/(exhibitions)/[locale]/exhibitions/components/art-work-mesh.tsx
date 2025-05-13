// src/app/(exhibitions)/[locale]/exhibitions/[linkname]/components/art-work-mesh.tsx
'use client'
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Mesh, Vector3, BoxGeometry, PlaneGeometry, MeshStandardMaterial, MeshBasicMaterial } from "three";
import { Vec3 } from "@/types/gallery";
import { useRaycaster } from "@/hooks/useRaycaster";
import { ArtworkPortal } from "./artwork-portal";
import { ArtworkInfoOverlay } from './artwork-info-overlay';
import { useCameraTransition } from '@/hooks/useCameraTransition';
import { useCameraStore } from '@/store/cameraStore';
import { TEXTURE_URL } from '@/utils/constants';
import { useCloudinaryAsset } from '@/hooks/useCloudinaryAsset';
import { GalleryArtwork } from './gallery';
import { Session } from "next-auth";

// Constants
const FRAME_THICKNESS = 0.1;
const BASE_HEIGHT = 2;
const METALNESS = 0.1;
const ROUGHNESS = 0.8;
const ENV_MAP_INTENSITY = 0.5;

// Props for frame mesh
interface FrameMeshProps {
    width: number;
    height: number;
}

// Define geometry creation functions for the frame
const FRAME_GEOMETRY = {
    createHorizontal: (width: number) =>
        new BoxGeometry(width + FRAME_THICKNESS * 2, FRAME_THICKNESS, 0.1),
    createVertical: (height: number) =>
        new BoxGeometry(FRAME_THICKNESS, height, 0.1)
};

// Frame component
const FrameMesh: React.FC<FrameMeshProps> = React.memo(({ width, height }) => {
    const frameTexture = useCloudinaryAsset(TEXTURE_URL.FLOOR);
    const frameMaterial = useMemo(
        () =>
            new MeshStandardMaterial({
                map: frameTexture,
                metalness: METALNESS,
                roughness: ROUGHNESS,
                envMapIntensity: ENV_MAP_INTENSITY
            }),
        [frameTexture]
    );
    const geometries = useMemo(
        () => ({
            horizontal: FRAME_GEOMETRY.createHorizontal(width),
            vertical: FRAME_GEOMETRY.createVertical(height)
        }),
        [width, height]
    );
    return (
        <group>
            <mesh position={[0, height / 2 + FRAME_THICKNESS / 2, 0]} geometry={geometries.horizontal} material={frameMaterial} />
            <mesh position={[0, -height / 2 - FRAME_THICKNESS / 2, 0]} geometry={geometries.horizontal} material={frameMaterial} />
            <mesh position={[-width / 2 - FRAME_THICKNESS / 2, 0, 0]} geometry={geometries.vertical} material={frameMaterial} />
            <mesh position={[width / 2 + FRAME_THICKNESS / 2, 0, 0]} geometry={geometries.vertical} material={frameMaterial} />
        </group>
    );
});

interface ArtworkMeshProps {
    galleryArtwork: GalleryArtwork;
    session: Session | null;
}

// Main artwork component
export const ArtworkMesh: React.FC<ArtworkMeshProps> = React.memo(
    ({ galleryArtwork, session }) => {
        // State:
        // showDetails: Has the interaction process started (prevents re-triggering intersect)?
        // shouldShowModal: Should the modal content actually be rendered?
        const [showDetails, setShowDetails] = useState(false);
        const [shouldShowModal, setShouldShowModal] = useState(false);
        const meshRef = useRef<Mesh>(null);
        const interactionTimerRef = useRef<NodeJS.Timeout | null>(null); // Timer for modal delay
        const { setTargetPosition, setIsTransitioningBack  } = useCameraStore();

        // Hooks
        useCameraTransition(); // Listens to targetPosition changes

        // Props extraction
        const { artwork, placement, exhibitionId, likes } = galleryArtwork;
        const user = session?.user;

        // --- Interaction Handlers ---

        const handleIntersect = useCallback(() => {
            // Ignore if interaction already started or mesh doesn't exist
            if (showDetails || !meshRef.current) {
                // console.log("Intersect ignored: showDetails =", showDetails);
                return;
            }

            // console.log("Intersect triggered - Starting interaction");
            setShowDetails(true); // Lock this interaction sequence

            // Trigger camera transition
            const worldPosition = new Vector3();
            meshRef.current.getWorldPosition(worldPosition);
            setTargetPosition(worldPosition);

            // Clear any previous timer just in case
            if (interactionTimerRef.current) {
                clearTimeout(interactionTimerRef.current);
            }

            // Set timer to show the modal content after a delay
            interactionTimerRef.current = setTimeout(() => {
                // console.log("Timeout finished - Setting shouldShowModal=true");
                // No need to check showDetails here again, handleClose clears the timer
                setShouldShowModal(true);
                interactionTimerRef.current = null; // Clear ref after execution
            }, 1000); // 1 second delay

        }, [showDetails, meshRef, setTargetPosition]); // Dependencies

        const handleClose = useCallback((e?: React.MouseEvent | MouseEvent) => {
            // If event exists and it's coming from a button click, ignore it
            if (e?.target instanceof HTMLButtonElement) {
              return;
            }            // console.log("handleClose called");

            // Clear the timer if it's still pending
            if (interactionTimerRef.current) {
                // console.log("Clearing pending interaction timer");
                clearTimeout(interactionTimerRef.current);
                interactionTimerRef.current = null;
            }

            // Reset all states
            setShouldShowModal(false);
            setShowDetails(false); // Unlock for next interaction
            // --- SET FLAG BEFORE RESETTING POSITION ---
            setIsTransitioningBack(true);
            // Reset camera target (triggers useCameraTransition to move back)
            setTargetPosition(null);

        }, [setTargetPosition, setIsTransitioningBack]); // Dependency

        const handleMiss = useCallback(() => {
            // Only trigger close if the interaction sequence HAD started.
            // This prevents closing if the mouse just brushes past without clicking.
            if (showDetails) {
                handleClose();
            }
        }, [showDetails, handleClose]); // Dependencies

        // Setup raycaster
        useRaycaster({
            meshRef,
            onIntersect: handleIntersect,
            onMiss: handleMiss
        });

        // Cleanup timer on component unmount
        useEffect(() => {
            return () => {
                if (interactionTimerRef.current) {
                    clearTimeout(interactionTimerRef.current);
                }
            };
        }, []);

        // --- Rendering Logic ---
        const texture = useCloudinaryAsset(artwork.lowResUrl);
        texture.colorSpace = 'srgb';
        const artworkMaterial = useMemo(() => new MeshBasicMaterial({ map: texture, toneMapped: false }), [texture]);
        const { geometry, dimensions } = useMemo(() => {
            if (!texture?.image) return { geometry: undefined, dimensions: { width: 0, height: 0}}; // Handle texture loading
            const { width, height } = texture.image;
            const aspectRatio = width / height;
            const dims = { width: BASE_HEIGHT * aspectRatio, height: BASE_HEIGHT };
            return { geometry: new PlaneGeometry(dims.width, dims.height), dimensions: dims };
        }, [texture]);

        // Memoize overlay content to prevent unnecessary re-renders
        const overlayContent = useMemo(() => (
            shouldShowModal ? (
                artwork._id && exhibitionId ? (
                    <ArtworkPortal isOpen={true} onClose={handleClose}>
                    <ArtworkInfoOverlay
                        artworkId={artwork._id}
                        exhibitionId={exhibitionId}
                        title={artwork.title}
                        likes={likes}
                        description={artwork.description}
                        user={user}
                        onClose={handleClose} // Pass the stable handleClose
                    />
                    </ArtworkPortal>
                ) : null
            ) : null
        // Dependencies: only re-render if modal should show/hide or data changes
        ), [shouldShowModal, handleClose, artwork._id, exhibitionId, artwork.title, likes, artwork.description, user]);

        // Don't render mesh if geometry isn't ready
        if (!geometry) return null;

        return (
            <group
                position={placement.position as Vec3}
                rotation={placement.rotation as Vec3 || [0, 0, 0]}>
                <mesh
                    ref={meshRef}
                    geometry={geometry}
                    material={artworkMaterial}
                />
                <FrameMesh
                    width={dimensions.width}
                    height={dimensions.height}
                />
                {overlayContent}
            </group>
        );
    }
);

FrameMesh.displayName = 'FrameMesh';
ArtworkMesh.displayName = 'ArtworkMesh';    