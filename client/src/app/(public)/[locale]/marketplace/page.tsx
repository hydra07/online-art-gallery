'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { History, Heart, Share2, Coins } from 'lucide-react';

interface NFTArtwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
  price: number;
  currency: 'ETH' | 'MATIC';
  likes: number;
  history: {
    date: string;
    price: number;
    action: 'Listed' | 'Sold' | 'Bid';
  }[];
  bids: {
    bidder: string;
    amount: number;
    date: string;
  }[];
}

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState('buy');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const mockNFTs: NFTArtwork[] = [
    {
      id: '1',
      title: 'Digital Dreams',
      artist: 'CryptoArtist',
      description: 'A mesmerizing digital artwork exploring the boundaries of imagination',
      imageUrl: '/artwork1.jpg',
      price: 0.5,
      currency: 'ETH',
      likes: 120,
      history: [
        { date: '2024-03-01', price: 0.5, action: 'Listed' },
        { date: '2024-02-28', price: 0.4, action: 'Bid' }
      ],
      bids: [
        { bidder: '0x1234...', amount: 0.45, date: '2024-02-28' }
      ]
    },
    // Add more mock NFTs...
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">NFT Marketplace</h1>
        <Button variant="outline" onClick={() => setActiveTab('sell')}>
          List Your NFT
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="buy">Buy NFTs</TabsTrigger>
          <TabsTrigger value="sell">Sell NFTs</TabsTrigger>
          <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
        </TabsList>

        <TabsContent value="buy">
          <div className="flex gap-4 mb-6">
            <Input 
              placeholder="Search NFTs..." 
              className="max-w-sm"
            />
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-1">Under 1 ETH</SelectItem>
                <SelectItem value="1-5">1-5 ETH</SelectItem>
                <SelectItem value="over-5">Over 5 ETH</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Listed</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockNFTs.map((nft) => (
              <Card key={nft.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={nft.imageUrl}
                      alt={nft.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Heart className="w-4 h-4" /> {nft.likes}
                      </Badge>
                      <Button size="icon" variant="ghost" className="bg-white/80">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2">{nft.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-4">by {nft.artist}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5" />
                      <span className="font-bold">{nft.price} ETH</span>
                    </div>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <History className="w-4 h-4" />
                      History
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Place Bid</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Add other tab contents */}
      </Tabs>
    </div>
  );
} 