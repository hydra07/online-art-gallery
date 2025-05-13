"use client";

import { Artist } from "@/types/artist";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { ArrowLeft, AtSign, Star, User, Users, Instagram, Twitter, Globe } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface ArtistDetailProps {
    artist: Artist;
}

export function ArtistDetail({ artist }: ArtistDetailProps) {
    const router = useRouter();

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header with Back Button */}
            <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="mb-4"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Artists
            </Button>

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                    <AvatarImage src={artist.image} alt={artist.name} />
                    <AvatarFallback className="text-4xl">{artist.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold tracking-tight">{artist.name}</h1>
                            {artist.artistProfile?.isFeatured && (
                                <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">
                                    <Star className="h-3 w-3 mr-1 fill-current" />
                                    Featured Artist
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <AtSign className="h-4 w-4" />
                            {artist.email}
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <div className="font-medium">{artist.followers.length}</div>
                                <div className="text-sm text-muted-foreground">Followers</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <div className="font-medium">{artist.following.length}</div>
                                <div className="text-sm text-muted-foreground">Following</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="my-8" />

            {/* Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Left Column - Bio */}
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Biography</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            {artist.artistProfile?.bio || "No biography available"}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Experience</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            {artist.artistProfile?.experience || "No experience information available"}
                        </p>
                    </div>

                    {artist.artistProfile?.genre && artist.artistProfile.genre.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Genres</h2>
                            <div className="flex flex-wrap gap-2">
                                {artist.artistProfile.genre.map((genre) => (
                                    <Badge key={genre} variant="secondary">
                                        {genre}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Additional Info */}
                <div className="space-y-8">
                    {/* Social Links */}
                    {artist.artistProfile?.socialLinks && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Connect</h2>
                            <div className="space-y-3">
                                {artist.artistProfile.socialLinks.instagram && (
                                    <Link 
                                        href={artist.artistProfile.socialLinks.instagram}
                                        target="_blank"
                                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <Instagram className="h-5 w-5" />
                                        <span>Instagram</span>
                                    </Link>
                                )}
                                {artist.artistProfile.socialLinks.twitter && (
                                    <Link 
                                        href={artist.artistProfile.socialLinks.twitter}
                                        target="_blank"
                                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <Twitter className="h-5 w-5" />
                                        <span>Twitter</span>
                                    </Link>
                                )}
                                {artist.artistProfile.socialLinks.website && (
                                    <Link 
                                        href={artist.artistProfile.socialLinks.website}
                                        target="_blank"
                                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <Globe className="h-5 w-5" />
                                        <span>Website</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Account Info */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Account Details</h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <div className="text-muted-foreground">Member Since</div>
                                <div className="font-medium">{format(new Date(artist.createdAt), 'PPP')}</div>
                            </div>
                            <div>
                                <div className="text-muted-foreground">Last Updated</div>
                                <div className="font-medium">{format(new Date(artist.updatedAt), 'PPP')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}