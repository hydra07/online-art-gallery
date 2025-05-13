import { Exhibition } from "@/types/exhibition";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Cylinder, Ticket, Info, User, BarChart2 } from "lucide-react";
import { vietnamCurrency } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";

interface ExhibitionPreviewProps {
  exhibition: Exhibition;
}

export function ExhibitionPreview({ exhibition }: ExhibitionPreviewProps) {
  const defaultContent = exhibition.contents.find(c => 
    exhibition.languageOptions?.find(l => l.isDefault && l.code === c.languageCode)
  ) || exhibition.contents[0];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section - Improved contrast and content positioning */}
      <div className="relative h-[60vh] w-full rounded-lg overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={exhibition.welcomeImage || "/modern_c1_plan.png"}
            alt={defaultContent?.name || "Exhibition"}
            fill
            className="object-cover brightness-40"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-5xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              {exhibition.status}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {defaultContent?.name || "Untitled Exhibition"}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pink-400" />
                <span>
                  {new Date(exhibition.startDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Cylinder className="w-5 h-5 text-pink-400" />
                <span>{exhibition.gallery?.name || "Virtual Gallery"}</span>
              </div>             
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - With fixed sidebar */}
      <div className="max-w-7xl mx-auto  py-12">
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Exhibition Details */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="flex items-center gap-2 text-2xl font-semibold mb-4">
                  <Info className="w-6 h-6 text-pink-500 dark:text-pink-400" />
                  About the Exhibition
                </h2>
                <div className="prose prose-lg max-w-none dark:prose-invert text-gray-700 dark:text-gray-300">
                  {defaultContent?.description || "No description available"}
                </div>
              </CardContent>
            </Card>

            {/* Featured Artworks - Improved grid and card design */}
            {exhibition.artworkPositions && exhibition.artworkPositions.length > 0 && (
              <Card className="mt-8">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-6">Artworks</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {exhibition.artworkPositions.map((position, idx) => (
                      <div 
                        key={idx} 
                        className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={position.artwork.url}
                            alt={position.artwork.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{position.artwork.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {position.artwork.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Fixed Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Curator Info Card */}
              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <h3 className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300 mb-4">
                    <User className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                    Curator
                  </h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-gray-100 dark:border-gray-700">
                      <AvatarImage src={exhibition.author.image} alt={exhibition.author.name} />
                      <AvatarFallback>{exhibition.author.name?.charAt(0) || ''}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{exhibition.author.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{exhibition.author.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Exhibition Stats Card */}
              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <h3 className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300 mb-4">
                    <BarChart2 className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                    Exhibition Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Artworks</span>
                      <span className="font-medium">{exhibition.artworkPositions?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Visitors</span>
                      <span className="font-medium">{exhibition.result?.visits || 0}</span>
                    </div>
                    {exhibition.ticket && (
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Registered</span>
                        <span className="font-medium">{exhibition.ticket.registeredUsers?.length || 0}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Ticket Information Card */}
              {exhibition.ticket && (
                <Card className="shadow-sm">
                  <CardContent className="pt-6">
                    <h3 className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300 mb-4">
                      <Ticket className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                      Ticket Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                        <span className="font-medium">
                          {exhibition.ticket.requiresPayment ? "Paid" : "Free"}
                        </span>
                      </div>
                      {exhibition.ticket.requiresPayment && (
                        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Price</span>
                          <span className="font-medium">{vietnamCurrency(exhibition.ticket.price)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Mobile version of the sidebar (shown only on smaller screens) */}
          <div className="lg:hidden col-span-1 space-y-6 mt-8">
            {/* Curator Info Card - Mobile */}
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <h3 className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300 mb-4">
                  <User className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                  Curator
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-gray-100 dark:border-gray-700">
                    <AvatarImage src={exhibition.author.image} alt={exhibition.author.name} />
                    <AvatarFallback>{exhibition.author.name?.charAt(0) || ''}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{exhibition.author.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{exhibition.author.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rest of the cards for mobile... */}
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <h3 className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300 mb-4">
                  <BarChart2 className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                  Exhibition Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Artworks</span>
                    <span className="font-medium">{exhibition.artworkPositions?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Visitors</span>
                    <span className="font-medium">{exhibition.result?.visits || 0}</span>
                  </div>
                  {exhibition.ticket && (
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Registered</span>
                      <span className="font-medium">{exhibition.ticket.registeredUsers?.length || 0}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Ticket Information for mobile */}
            {exhibition.ticket && (
              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <h3 className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300 mb-4">
                    <Ticket className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                    Ticket Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                      <span className="font-medium">
                        {exhibition.ticket.requiresPayment ? "Paid" : "Free"}
                      </span>
                    </div>
                    {exhibition.ticket.requiresPayment && (
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Price</span>
                        <span className="font-medium">{vietnamCurrency(exhibition.ticket.price)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}