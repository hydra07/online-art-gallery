// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
// import { Heart, MessageSquare, Share2 } from 'lucide-react';
// import Image from 'next/image';
// import { ArtPost } from '../page';

// interface ArtCardProps {
//   post: ArtPost;
// }

// export function ArtCard({ post }: ArtCardProps) {
//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center space-x-4">
//         <Avatar>
//           <AvatarImage src={post.artist.avatar} />
//           <AvatarFallback>{post.artist.name[0]}</AvatarFallback>
//         </Avatar>
//         <div>
//           <h3 className="font-semibold">{post.artist.name}</h3>
//           <p className="text-sm text-muted-foreground">
//             {new Date(post.createdAt).toLocaleDateString()}
//           </p>
//         </div>
//       </CardHeader>
//       <CardContent className="p-0">
//         <div className="relative aspect-[4/3]">
//           <Image
//             src={post.image}
//             alt={post.title}
//             fill
//             className="object-cover"
//           />
//         </div>
//         <div className="p-6">
//           <h2 className="text-xl font-bold mb-2">{post.title}</h2>
//           <p className="text-muted-foreground">{post.description}</p>
//           <div className="flex gap-2 mt-4">
//             {post.tags.map((tag) => (
//               <span
//                 key={tag}
//                 className="bg-muted px-2 py-1 rounded-full text-xs"
//               >
//                 #{tag}
//               </span>
//             ))}
//           </div>
//         </div>
//       </CardContent>
//       <CardFooter className="border-t">
//         <div className="flex items-center space-x-4 w-full">
//           <Button variant="ghost" size="sm">
//             <Heart className="w-4 h-4 mr-2" />
//             {post.likes}
//           </Button>
//           <Button variant="ghost" size="sm">
//             <MessageSquare className="w-4 h-4 mr-2" />
//             {post.comments}
//           </Button>
//           <Button variant="ghost" size="sm" className="ml-auto">
//             <Share2 className="w-4 h-4" />
//           </Button>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }
