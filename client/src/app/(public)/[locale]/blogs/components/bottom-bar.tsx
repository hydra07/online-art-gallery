"use client"; // 🔹 Thêm dòng này vào đầu file

import { useEffect, useState } from "react";
import { Heart, MessageCircle, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ToggleHeartButton } from "@/components/ui.custom/toggle-heart-button";
import { HeartCountDisplay } from "@/components/ui.custom/heart-count-display";
// import { ToggleBookmarkButton } from "@/components/ui.custom/toggle-bookmark-button";
import { TooltipCustom } from "@/components/ui.custom/tooltip-custom";
import { getCurrentUser } from "@/lib/session";

export function BottomBar({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isBookmarked,
  userId,
  isHearted,
  heartCount,
  blogId,
}: {
  isBookmarked: boolean;
  userId?: string;
  isHearted: boolean;
  heartCount: number;
  blogId: string;
}) {
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setToken(user.accessToken);
      }
    };
    fetchCurrentUser();
  }, []);

  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto px-4 w-max border bg-white dark:bg-gray-800 shadow-lg rounded-full flex justify-around items-center space-x-4 z-50">
      <div className="flex items-center">
        {userId ? (
          <ToggleHeartButton
            blogId={blogId}
            userId={userId}
            initialHearted={isHearted}
            initialHeartCount={heartCount}
            token={token}
          />
        ) : (
          <Link href="/sign-in">
            {renderIconButton(
              "Like the Article",
              <Heart className="w-5 h-5" />
            )}
          </Link>
        )}
        {heartCount > 0 && (
          <HeartCountDisplay blogId={blogId} initialHeartCount={heartCount} />
        )}
        <Separator />
        {renderIconButton(
          "Write a Comment",
          <MessageCircle className="w-5 h-5" />
        )}
        <Separator />
        {/* {userId ? (
          <ToggleBookmarkButton
            blogId={blogId}
            initialBookmarked={isBookmarked}
          />
        ) : (
          <Link href="/sign-in">
            {renderIconButton(
              "Bookmark the Article",
              <Bookmark className="w-5 h-5" />
            )}
          </Link>
        )} */}
        <Separator />
        {renderIconButton("More Options", <MoreVertical className="w-5 h-5" />)}
      </div>
    </div>
  );
}

function renderIconButton(tooltipText: string, icon: React.ReactNode) {
  return (
    <TooltipCustom tooltipText={tooltipText}>
      <Button
        variant="ghost"
        className="text-gray-600 dark:text-gray-300 p-2 rounded-full"
      >
        {icon}
      </Button>
    </TooltipCustom>
  );
}

function Separator() {
  return <div className="w-px h-6 mx-2 bg-gray-300 dark:bg-gray-700" />;
}
