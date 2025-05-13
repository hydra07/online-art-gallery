"use client";
import { useState, useEffect } from "react";
import { createAxiosInstance } from "@/lib/axios";
import { Loader2 } from "lucide-react";

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing: boolean; // Đổi tên để tránh xung đột
}

export default function FollowButton({
  targetUserId,
  initialIsFollowing,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  // Lấy trạng thái follow từ API khi component mount
  useEffect(() => {
    const fetchFollowingStatus = async () => {
      try {
        const axiosInstance = await createAxiosInstance({ useToken: true });

        if (!axiosInstance) return;

        const response = await axiosInstance.get(
          `/user/is-following/${targetUserId}`
        );
        setFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Lỗi khi kiểm tra follow:", error);
      }
    };

    fetchFollowingStatus();
  }, [targetUserId]);

  const handleFollowAction = async (action: "follow" | "unfollow") => {
    setLoading(true);

    try {
      const axiosInstance = await createAxiosInstance({ useToken: true });

      if (!axiosInstance) {
        alert("Bạn cần đăng nhập để thực hiện thao tác này!");
        setLoading(false);
        return;
      }

      const response = await axiosInstance.post(
        `/user/${action}/${targetUserId}`
      );

      console.log("Phản hồi từ API:", response.data);
      setFollowing(action === "follow");
    } catch (error) {
      console.error(`Lỗi khi ${action}:`, error);
    }

    setLoading(false);
  };

  return (
    <button
      className={`px-4 py-2 rounded-full text-white font-semibold text-sm transition-all duration-300 ease-in-out shadow-md
        ${
          following
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        }
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
      `}
      onClick={() => handleFollowAction(following ? "unfollow" : "follow")}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="animate-spin w-5 h-5 mx-auto" />
      ) : following ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
    </button>
  );
}
