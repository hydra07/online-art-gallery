'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { TooltipCustom } from "./tooltip-custom";
import {
  checkIsUserHeartedBlog,
  addHeartToBlog,
  removeHeartFromBlog,
} from "@/service/blog"; // Import service đã sửa

interface ToggleHeartButtonProps {
  blogId: string;
  userId: string;
  initialHearted: boolean;
  initialHeartCount: number;
  token: string;
}

// 🛠 API Fetch heart count
async function getHeartCount(blogId: string): Promise<number> {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/blog/${blogId}/heart-count`
    );
    return res.data?.count ?? 0;
  } catch (error) {
    console.error(`Error getting heart count for blogId ${blogId}:`, error);
    return 0;
  }
}

export function ToggleHeartButton({
  blogId,
  userId,
  initialHearted,
  initialHeartCount,
  token,
}: ToggleHeartButtonProps) {
  const [isHearted, setIsHearted] = useState(initialHearted);
  const [heartCount, setHeartCount] = useState(initialHeartCount);
  const queryClient = useQueryClient();

  useEffect(() => {
    async function fetchHeartStatus() {
      if (!token) return;
      try {
        const [count, hearted] = await Promise.all([
          getHeartCount(blogId),
          checkIsUserHeartedBlog(blogId, userId, token),
        ]);
        setHeartCount(count);
        setIsHearted(hearted);
      } catch (error) {
        console.error("Error in fetchHeartStatus:", error);
      }
    }

    fetchHeartStatus();
  }, [blogId, userId, token]);

  // 🛠 Xử lý toggle like
  const handleToggleHeart = async () => {
    try {
      if (isHearted) {
        await removeHeartFromBlog(token, blogId, userId); // Gửi userId trong body
        setHeartCount((prevCount) => Math.max(prevCount - 1, 0));
      } else {
        await addHeartToBlog(token, blogId, userId); // Gửi userId trong body
        setHeartCount((prevCount) => prevCount + 1);
      }

      setIsHearted((prevState) => !prevState);

      toast({
        title: "Success",
        description: isHearted ? "Post unliked" : "Post liked",
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["postInteractions", blogId],
      });
    } catch (error) {
      console.error("Error toggling heart:", error);
      toast({
        title: "Error",
        description: "Failed to toggle like. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <TooltipCustom tooltipText={isHearted ? "Unlike" : "Like the Article"}>
      <Button variant="ghost" size="sm" onClick={handleToggleHeart}>
        <Heart
          className={`${
            isHearted
              ? "fill-red-500 text-red-500"
              : "text-gray-600 dark:text-gray-300"
          }`}
        />
        <span className="ml-1">{heartCount}</span>
      </Button>
    </TooltipCustom>
  );
}
