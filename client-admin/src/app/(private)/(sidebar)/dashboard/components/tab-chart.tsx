"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAllUser, getAllArtwork } from "@/service/analytics-service";
import { getExhibitions } from "@/service/exhibition-service";
import { getCurrentUser } from "@/lib/session";
import { TopArtworks } from "./top-artworks";

interface Artist {
  _id: string;
  name: string;
  image: string;
  followers: string[];
  artworks: number;
  revenue: number;
}

interface ExhibitionResult {
  visits?: number;
  totalTime?: number;
  likes?: string[];
}

interface ExhibitionContent {
  name?: string;
}

interface Exhibition {
  _id: string;
  result?: ExhibitionResult;
  contents?: ExhibitionContent[];
}

interface ExhibitionData {
  exhibitions: Exhibition[];
  pagination?: {
    total: number;
  };
}

export default function TabChart() {
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [sortMetric, setSortMetric] = useState<"followers" | "artworks">(
    "followers"
  );

  const [exhibitionData, setExhibitionData] = useState<ExhibitionData | undefined>();
  const [sortExMetric, setExSortMetric] = useState<
    "visitors" | "totalTime" | "likes"
  >("visitors");

  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();
      if (user) setToken(user.accessToken);
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchExhibitions = async () => {
      if (!token) return;
      try {
        const res = await getExhibitions({ status: "PUBLISHED" });
        if (res?.data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setExhibitionData(res.data.exhibitions as any);
        }
      } catch (error) {
        console.error("Failed to fetch exhibitions:", error);
      }
    };

    fetchExhibitions();
  }, [token]);

  const getSortedExhibitions = () => {
    const exhibitions = exhibitionData?.exhibitions || [];
    return [...exhibitions]
      .sort((a, b) => {
        const resultA = a.result || {};
        const resultB = b.result || {};
        if (sortExMetric === "visitors")
          return (resultB.visits || 0) - (resultA.visits || 0);
        if (sortExMetric === "totalTime")
          return (resultB.totalTime || 0) - (resultA.totalTime || 0);
        if (sortExMetric === "likes")
          return (resultB.likes?.length || 0) - (resultA.likes?.length || 0);
        return 0;
      })
      .slice(0, 5);
  };
  useEffect(() => {
    async function fetchTopArtists() {
      try {
        const [userRes, artworkRes] = await Promise.all([
          getAllUser(),
          getAllArtwork({
            skip: 0,
            take: 0
          }),
        ]);

        if (userRes?.data && artworkRes?.data?.artworks) {
          const artworks = artworkRes.data.artworks;
          const artists = userRes.data.filter(
            (user: {role: string[]; isBanned: boolean}) => user.role.includes("artist") && !user.isBanned
          );

          const artistWithArtworkCount = artists.map((artist: any) => {
            const artistArtworks = artworks.filter(
              (artwork: {artistId?: {_id: string}}) => artwork.artistId?._id === artist._id
            );
            return {
              _id: artist._id,
              name: artist.name,
              image: artist.image,
              followers: artist.followers || [],
              artworks: artistArtworks.length,
              revenue: artist.revenue || 0,
            };
          });

          const sorted = artistWithArtworkCount
            .sort((a: Artist, b: Artist) => {
              if (sortMetric === "followers") {
                return b.followers.length - a.followers.length;
              } else {
                return b.artworks - a.artworks;
              }
            })
            .slice(0, 5);

          setTopArtists(sorted);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchTopArtists();
  }, [sortMetric]);

  return (
    <Tabs defaultValue="artists" className="mb-8">
      <TabsList>
        <TabsTrigger value="artists">Artist Analytics</TabsTrigger>
        <TabsTrigger value="exhibitions">Exhibition Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="artists">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader />
            <CardContent>
              <TopArtworks />
            </CardContent>
          </Card>

          <Card>
            <CardHeader />
            <div className="flex items-center justify-between mb-6 px-6">
              <p className="text-xl font-semibold">Top Artist</p>
              <div className="flex items-center space-x-4">
                <label className="text-sm text-muted-foreground">
                  Sort by:
                </label>
                <select
                  value={sortMetric}
                  onChange={(e) =>
                    setSortMetric(e.target.value as "followers" | "artworks")
                  }
                  className="text-sm text-emerald-700 dark:text-emerald-200 bg-transparent border border-emerald-300 dark:border-emerald-600 rounded-md px-2 py-1"
                >
                  <option value="followers">Followers</option>
                  <option value="artworks">Artworks</option>
                </select>
              </div>
            </div>
            <CardContent>
              <div className="space-y-4">
                {topArtists.map((artist) => (
                  <div
                    key={artist._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{artist.name}</div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-gray-600">
                        {artist.artworks} artworks
                      </div>
                      <div className="text-gray-400">
                        {artist.followers.length} followers
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="exhibitions">
        <div className="space-y-6">
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 py-2 md:py-3 bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-base md:text-lg font-semibold text-emerald-700 dark:text-emerald-200">
                  Exhibition Details
                </h2>
                <div className="ml-auto">
                  <select
                    value={sortExMetric}
                    onChange={(e) =>
                      setExSortMetric(
                        e.target.value as "visitors" | "totalTime" | "likes"
                      )
                    }
                    className="text-sm md:text-base text-emerald-700 dark:text-emerald-200 bg-transparent border border-emerald-300 dark:border-emerald-600 rounded-md px-2 py-1"
                  >
                    <option value="visitors">Visitors</option>
                    <option value="totalTime">Time</option>
                    <option value="likes">Likes</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 md:p-6 space-y-4 md:space-y-6">
              {getSortedExhibitions().length > 0 ? (
                getSortedExhibitions().map((exh) => {
                  const exhibitionName =
                    exh.contents?.[0]?.name || "Untitled Exhibition";
                  const visitors = exh.result?.visits ?? 0;
                  const totalTime = exh.result?.totalTime ?? 0;
                  const likes = exh.result?.likes?.length ?? 0;

                  return (
                    <div key={exh._id} className="space-y-2">
                      <div className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-200">
                        {exhibitionName}
                      </div>
                      <div className="grid grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
                        <div>
                          <div className="text-teal-600 dark:text-teal-400">
                            Visitors
                          </div>
                          <div className="font-medium text-gray-700 dark:text-gray-200">
                            {visitors.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-teal-600 dark:text-teal-400">
                            Total Time
                          </div>
                          <div className="font-medium text-gray-700 dark:text-gray-200">
                            {Math.round(totalTime / 60)} mins
                          </div>
                        </div>
                        <div>
                          <div className="text-teal-600 dark:text-teal-400">
                            Likes
                          </div>
                          <div className="font-medium text-amber-500 dark:text-amber-400">
                            ★ {likes}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No exhibition data available.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
} 