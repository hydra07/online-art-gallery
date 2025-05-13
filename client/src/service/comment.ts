"use server";
import axios, { createApi } from '@/lib/axios';
import axiosInstance from 'axios';

// Tạo comment mới (cho blog hoặc artwork)
export async function createComment({
  accessToken,
  targetId,
  targetType,
  content,
  parentId = null,
  onModel
}: {
  accessToken: string;
  targetId: string;
  targetType: 'blog' | 'artwork';
  content: string;
  parentId?: string | null;
  onModel: 'blog' | 'artwork';
}) {
  try {
    const res = await createApi(accessToken).post('/comments', {
      targetId,
      targetType,
      content,
      parentId,
      onModel
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (res.status === 201) {
      return res.data; // Trả về comment mới tạo (có thể là comment cha hoặc reply)
    } else {
      console.error(`Failed to create comment: ${res.statusText}`);
    }
  } catch (err) {
    if (axiosInstance.isAxiosError(err)) {
      console.error(`Error when creating comment: ${err.response?.data?.message || err.message}`);
    } else {
      console.error(`Unexpected error: ${err}`);
    }
  }
}

// Lấy danh sách comment theo targetId (blog/artwork)
export async function getCommentsByTarget({
  targetId,
  targetType,
  accessToken
}: {
  targetId: string;
  targetType: 'blog' | 'artwork';
  accessToken: string;
}) {
  try {
    const res = await axios.get(`/comments/target/${targetType}/${targetId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return res.data;
  } catch (err) {
    if (axiosInstance.isAxiosError(err)) {
      console.error(`Error when fetching comments: ${err.response?.data.message}`);
    } else {
      console.error(`Unexpected error: ${err}`);
    }
    return [];
  }
}

// Cập nhật comment (chỉ tác giả comment)
export async function updateComment({
  accessToken,
  commentId,
  content,
  replies,
}: {
  accessToken: string;
  commentId: string;
  content: string;
  replies: string[];
}) {
  try {

    const res = await createApi(accessToken).put(
      `/comments/${commentId}`,
      {
        content,
        replies, // gửi replies mới lên server
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (res.status === 200) {
      return res.data; // Trả về comment sau khi cập nhật
    } else {
      console.error(`❌ Failed to update comment: ${res.statusText}`);
    }
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật comment:", err);
  }
}

// Xóa comment (tác giả hoặc admin)
export async function deleteComment({
  accessToken,
  commentId
}: {
  accessToken: string;
  commentId: string;
}) {
  try {
    const res = await createApi(accessToken).delete(`/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (res.status === 200) {
      return true;
    } else {
      console.error(`Failed to delete comment: ${res.statusText}`);
      return false;
    }
  } catch (err) {
    if (axiosInstance.isAxiosError(err)) {
      console.error(`Error when deleting comment: ${err.response?.data.message}`);
    } else {
      console.error(`Unexpected error: ${err}`);
    }
    return false;
  }
}
