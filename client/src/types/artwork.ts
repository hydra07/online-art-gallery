import { Artwork } from "@/app/(public)/[locale]/artists/interface";

export type ArtworkResponse = {
    artwork: Artwork;
}

export type ArtworksResponse = {
    artworks: Artwork[];
    total: number;
}

