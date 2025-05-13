"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { vietnamCurrency } from "@/utils/converters";
import { Eye, ImageDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getExhibitions } from "@/service/dashboard";
import { ArtworksResponse } from "@/types/artwork";
import { getCurrentUser } from "@/lib/session";
import { getArtistArtworks } from "@/service/artwork";

export default function TabChart() {
  const [isMobile, setIsMobile] = useState(false);
  const [exhibitionData, setExhibitionData] = useState<any>();
  const [token, setToken] = useState("");
  const [artworkData, setArtworkData] = useState<ArtworksResponse | null>(null);
  const [sortMetric, setSortMetric] = useState<"views" | "buyers" | "revenue">(
    "views"
  );
  const [sortExMetric, setExSortMetric] = useState<
    "visitors" | "totalTime" | "likes"
  >("visitors");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setToken(user.accessToken);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchArtworks = async () => {
      if (!token) return;
      try {
        const res = await getArtistArtworks(token, {
          skip: 0,
          take: 0
        });
        if (res?.data) {
          setArtworkData(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch artwork data:", error);
      }
    };
    fetchArtworks();
  }, [token]);

  useEffect(() => {
    const fetchExhibitions = async () => {
      if (!token) return;
      try {
        const res = await getExhibitions(token);
        if (res?.data) {
          setExhibitionData(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch exhibitions:", error);
      }
    };

    fetchExhibitions();
  }, [token]);

  const getSortedArtworks = () => {
    const artworks = artworkData?.artworks || [];
    return [...artworks]
      .sort((a, b) => {
        if (sortMetric === "views") {
          return b.views - a.views;
        } else if (sortMetric === "buyers") {
          return b.buyers.length - a.buyers.length;
        } else if (sortMetric === "revenue") {
          const revenueA = a.buyers.length * a.price * 0.97;
          const revenueB = b.buyers.length * b.price * 0.97;
          return revenueB - revenueA;
        }
        return 0;
      })
      .slice(0, 5);
  };

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

  const topArtworks = getSortedArtworks();
  const sortedExhibitions = getSortedExhibitions();

  return (
    <Tabs defaultValue="artworks" className="space-y-4 md:space-y-6">
      <TabsList className="rounded-lg bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800 shadow-sm">
        <TabsTrigger
          value="artworks"
          className="text-sm md:text-base text-emerald-700 dark:text-emerald-200 data-[state=active]:bg-teal-500 data-[state=active]:text-white rounded-md"
        >
          Analytics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="artworks">
        <div className="grid gap-4 md:gap-6 md:grid-cols-2">
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
                    className="text-sm md:text-base text-emerald-700 dark:text-emerald-200 bg-transparent border border-emerald-300 dark:border-emerald-600 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-600"
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

          {/* Top Artworks */}
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <CardHeader className="flex border-b border-gray-200 dark:border-gray-700 py-2 md:py-3 bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800 items-center">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-base md:text-lg font-semibold text-emerald-700 dark:text-emerald-200">
                  Top Performing Artworks
                </h2>
                <div className="ml-auto">
                  <select
                    value={sortMetric}
                    onChange={(e) =>
                      setSortMetric(
                        e.target.value as "views" | "buyers" | "revenue"
                      )
                    }
                    className="text-sm md:text-base text-emerald-700 dark:text-emerald-200 bg-transparent border border-emerald-300 dark:border-emerald-600 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-600"
                  >
                    <option value="views">Views</option>
                    <option value="buyers">Buyers</option>
                    <option value="revenue">Revenue</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 md:p-6 space-y-3 md:space-y-4">
              {topArtworks.map((artwork) => (
                <div
                  key={artwork._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 relative">
                      <Image
                        src={artwork.url}
                        alt={artwork.title}
                        fill
                        className="rounded-lg object-cover shadow-sm"
                      />
                    </div>
                    <div>
                      <div className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-200">
                        {artwork.title}
                      </div>
                      <div className="text-xs md:text-sm text-teal-600 dark:text-teal-400 flex gap-2 md:gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 md:w-4 md:h-4" />{" "}
                          {artwork.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <ImageDown className="w-3 h-3 md:w-4 md:h-4" />{" "}
                          {artwork.buyers.length}
                        </span>
                        <span className="flex items-center gap-1">
                          {vietnamCurrency(
                            artwork.buyers.length * artwork.price * 0.97
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs md:text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {vietnamCurrency(artwork.price || 0)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
