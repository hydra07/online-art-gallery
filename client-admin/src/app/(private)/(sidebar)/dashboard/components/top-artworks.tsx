"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { vietnamCurrency } from "@/utils";
import { getAllArtwork } from "@/service/analytics-service";

interface ArtworkDisplay {
  id: string;
  title: string;
  image: string;
  artist: string;
  views: number;
  revenue: number;
  buyers: string[];
  price: number;
}

interface Artwork {
  _id: string;
  title: string;
  url: string;
  artistId?: {
    _id: string;
    name: string;
  };
  views?: number;
  buyers?: string[];
  price?: number;
  status: string;
}

export function TopArtworks() {
  const [artworks, setArtworks] = useState<ArtworkDisplay[]>([]);
  const [sortMetric, setSortMetric] = useState<"views" | "buyers" | "revenue">(
    "views"
  );

  useEffect(() => {
    async function fetchArtworks() {
      const res = await getAllArtwork({
        skip: 0,
        take: 0
      });
      if (!res?.data?.artworks) return;

      const sorted = res.data.artworks
        .filter(
          (artwork: Artwork) =>
            artwork.status === "selling" || artwork.status === "available"
        )
        .map((artwork: Artwork) => ({
          id: artwork._id,
          title: artwork.title,
          image: artwork.url,
          artist: artwork.artistId?.name || "Unknown",
          views: artwork.views || 0,
          revenue: (artwork.buyers?.length || 0) * (artwork.price || 0),
          buyers: artwork.buyers || [],
          price: artwork.price || 0,
        }));

      setArtworks(sorted);
    }

    fetchArtworks();
  }, []);

  const getSortedArtworks = () => {
    return [...artworks]
      .sort((a, b) => {
        if (sortMetric === "views") {
          return b.views - a.views;
        } else if (sortMetric === "buyers") {
          return b.buyers.length - a.buyers.length;
        } else if (sortMetric === "revenue") {
          return b.revenue - a.revenue;
        }
        return 0;
      })
      .slice(0, 5); // Return the top 5 artworks based on selected metric
  };

  const topArtworks = getSortedArtworks();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <p className="text-xl font-semibold">Top Artworks</p>
        <div className="flex items-center space-x-4">
          <label className="text-sm text-muted-foreground">Sort by:</label>
          <select
            value={sortMetric}
            onChange={(e) =>
              setSortMetric(e.target.value as "views" | "buyers" | "revenue")
            }
            className="text-sm text-emerald-700 dark:text-emerald-200 bg-transparent border border-emerald-300 dark:border-emerald-600 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-600"
          >
            <option value="views">Views</option>
            <option value="buyers">Buyers</option>
            <option value="revenue">Revenue</option>
          </select>
        </div>
      </div>

      {topArtworks.map((artwork) => (
        <div
          key={artwork.id}
          className="flex items-center space-x-4 border-b pb-4"
        >
          <div className="relative h-20 w-20 overflow-hidden rounded-md shadow-md">
            <Image
              src={artwork.image}
              alt={artwork.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{artwork.title}</p>
              <p className="text-sm text-muted-foreground">
                {vietnamCurrency(artwork.revenue)}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">{artwork.artist}</p>
            <p className="text-xs text-muted-foreground">
              {artwork.views.toLocaleString()} views
            </p>
            <p className="text-xs text-muted-foreground">
              {artwork.buyers.length.toLocaleString()} buyers
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 