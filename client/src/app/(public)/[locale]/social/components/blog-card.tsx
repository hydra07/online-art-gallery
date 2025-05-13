"use client";

import {
  // BookmarkPlusIcon,
  Flag,
  Heart
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { createExcerpt, sanitizeBlogContent } from "@/app/utils";
// import { ToggleBookmarkButton } from "@/components/ui.custom/toggle-bookmark-button";
import { ToggleHeartButton } from "@/components/ui.custom/toggle-heart-button";
import { useParams } from "next/navigation";
import ReportButton from "@/components/ui.custom/report-button";
import { RefType } from "@/utils/enums";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/session";
import FollowButton from "@/components/follow-button";
import CommentDrawer from "./comment-drawer";

interface BlogCardProps {
  id: string;
  title: string;
  coverImage: string;
  content: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  publishedAt: Date;
  readTime: number;
  slug: string;
  isBookmarked: boolean;
  isSignedIn: boolean;
  heartCount: number;
  isHearted: boolean;
}
export function BlogCard({
  id,
  title,
  coverImage,
  content,
  author,
  publishedAt,
  readTime,
  slug,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isBookmarked,
  isSignedIn,
  isHearted,
  heartCount,
}: BlogCardProps) {
  const params = useParams();
  const locale = params.locale;

  const sanitizedContent = sanitizeBlogContent(content);
  const excerpt = createExcerpt(sanitizedContent);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();

      if (user) {
        setToken(user.accessToken);
        setUserId(user.id);
        setCurrentUser(user);
      }
    };
    fetchCurrentUser();
  }, []);

  return (
    <div className="w-full max-w-[700px] rounded-xl overflow-hidden border bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl flex flex-col">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src={author.image} alt={author.name} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {author.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(publishedAt, { addSuffix: true })} ·{" "}
                {readTime} min read
              </p>
            </div>
          </div>

          {/* Combined UI with both report button and follow button */}
          <div className="flex items-center">
            {currentUser && currentUser.id !== author.id && (
              <FollowButton
                targetUserId={author.id}
                initialIsFollowing={false}
              />
            )}

            {isSignedIn && (
              <ReportButton
                refId={id}
                refType={RefType.BLOG}
                url={window.location.href}
                triggerElement={
                  <Button variant="ghost">
                    <Flag className="w-4 h-4" />
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>
      <Link href={`/${locale}/blogs/${slug}`}>
        <div className="flex justify-between px-4">
          <div className="w-2/3  py-2">
            <h2 className="font-bold text-lg mb-1 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
              {title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
              {excerpt}
            </p>
          </div>
          <div className="w-1/4 relative h-28">
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Add sizes attribute
              className="transition-all duration-300 hover:opacity-80 rounded-r"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          <CommentDrawer
            contentId={id}
            contentType={"blog"}
            authorId={author.id}
            isSignedIn={isSignedIn}
          />

          {isSignedIn ? (
            <ToggleHeartButton
              blogId={id}
              userId={userId}
              initialHearted={isHearted}
              initialHeartCount={heartCount}
              token={token}
            />
          ) : (
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                <Heart className="text-gray-600 dark:text-gray-300" />
                <span className="ml-1">{heartCount}</span>
              </Button>
            </Link>
          )}
        </div>
        {/* {isSignedIn ? (
          <ToggleBookmarkButton
            blogId={slug}
            initialBookmarked={isBookmarked}
          />
        ) : (
          <Link href="/sign-in">
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-gray-600 dark:hover:text-gray-300"
            >
              <BookmarkPlusIcon className="text-gray-600 dark:text-gray-300" />
            </Button>
          </Link>
        )} */}
      </div>
    </div>
  );
}
