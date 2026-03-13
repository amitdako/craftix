import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import CommentSection from "../CommentSection/CommentSection";

const PostCard = ({ post, currentUser, onSave, onDelete, onUserUpdate }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [showComments, setShowComments] = useState(false);
  const [allComments, setAllComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const navigate = useNavigate();

  const currentUserId = currentUser?.id || currentUser?._id;
  const isLiked = likes.includes(currentUserId);
  const isOwner =
    currentUser &&
    post.author &&
    (post.author._id || post.author) === currentUserId;

  // בדיקת שמירה - האם הפוסט נמצא ברשימת השמורים של המשתמש
  const isSaved = Array.isArray(currentUser?.savedPosts)
    ? currentUser.savedPosts.some((savedItem) => {
        const savedId =
          typeof savedItem === "object" ? savedItem._id : savedItem;
        return String(savedId) === String(post._id);
      })
    : false;

  // פונקציה לעיצוב תאריך ושעה בעברית
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `http://localhost:5000${path}`;
  };

  const handleLike = async (e) => {
    e.stopPropagation(); // מונע מעבר לדף הפוסט כשלוחצים לייק
    try {
      const response = await api.post(`/posts/like/${post._id}`);
      setLikes(response.data.likes);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const response = await api.post(`/posts/${post._id}/comment`, {
        text: commentText,
      });
      setAllComments(response.data);
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await api.post(
        `/posts/${post._id}/comment/${commentId}/like`,
      );
      setAllComments(response.data);
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("למחוק את התגובה?")) return;
    try {
      const response = await api.delete(
        `/posts/${post._id}/comment/${commentId}`,
      );
      setAllComments(response.data);
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const isImplementation = post.postType === "implementation";

  return (
    <div
      className="post-card"
      style={{
        backgroundColor: "#fff",
        borderRadius: "15px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        marginBottom: "25px",
        overflow: "hidden",
        border: "1px solid #eee",
        direction: "rtl",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header - פרטי כותב ותאריך */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "15px",
        }}
      >
        <div
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            backgroundColor: "#007bff",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            overflow: "hidden",
            border: "1px solid #ddd",
          }}
        >
          {post.author?.profileImage ? (
            <img
              src={getImageUrl(post.author.profileImage)}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            post.author?.displayName?.[0] || "U"
          )}
        </div>
        <div style={{ flex: 1, textAlign: "right" }}>
          <Link
            to={`/profile/${post.author?._id || post.author}`}
            style={{
              textDecoration: "none",
              color: "#1c1e21",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            {post.author?.displayName}
          </Link>
          <div
            style={{ fontSize: "0.75rem", color: "#65676b", marginTop: "2px" }}
          >
            {formatDateTime(post.createdAt)}
          </div>
        </div>
        {post.category && (
          <span
            style={{
              fontSize: "0.75rem",
              backgroundColor: "#e7f3ff",
              color: "#1877f2",
              padding: "4px 12px",
              borderRadius: "20px",
              fontWeight: "bold",
            }}
          >
            {post.category}
          </span>
        )}
      </div>

      {/* גוף הפוסט - לחיצה עוברת לדף הפוסט */}
      <div
        onClick={() => navigate(`/post/${post._id}`)}
        style={{ cursor: "pointer" }}
      >
        <div style={{ padding: "0 15px 15px 15px", textAlign: "right" }}>
          {post.title && (
            <h3
              style={{
                margin: "0 0 10px 0",
                fontSize: "1.2rem",
                color: "#1c1e21",
              }}
            >
              {post.title}
            </h3>
          )}
          <p
            style={{
              margin: 0,
              fontSize: "1rem",
              color: "#1c1e21",
              lineHeight: "1.5",
              whiteSpace: "pre-wrap",
            }}
          >
            {post.content}
          </p>
        </div>

        {post.mediaUrl && (
          <div
            style={{
              width: "100%",
              maxHeight: "500px",
              overflow: "hidden",
              backgroundColor: "#f0f2f5",
              borderTop: "1px solid #f0f2f5",
              borderBottom: "1px solid #f0f2f5",
            }}
          >
            {post.mediaType === "video" ? (
              <video
                src={getImageUrl(post.mediaUrl)}
                controls
                style={{ width: "100%", display: "block" }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={getImageUrl(post.mediaUrl)}
                alt=""
                style={{
                  width: "100%",
                  display: "block",
                  objectFit: "contain",
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* תיבת שיתוף (Facebook Style) - במידה וזה שיתוף ביצוע */}
      {isImplementation && post.parentPost && (
        <div
          style={{
            margin: "15px",
            padding: "12px",
            border: "1px solid #e0e0e0",
            borderRadius: "10px",
            backgroundColor: "#f9f9f9",
            textAlign: "right",
            cursor: "pointer",
          }}
          onClick={() =>
            navigate(`/post/${post.parentPost._id || post.parentPost}`)
          }
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              justifyContent: "flex-start",
              flexDirection: "row-reverse",
            }}
          >
            <span
              style={{ fontSize: "0.85rem", fontWeight: "bold", color: "#555" }}
            >
              {post.parentPost.author?.displayName || "יוצר מקורי"}
            </span>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: "#7b8a97",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "10px",
              }}
            >
              {post.parentPost.author?.profileImage ? (
                <img
                  src={getImageUrl(post.parentPost.author.profileImage)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  alt=""
                />
              ) : (
                post.parentPost.author?.displayName?.[0]
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexDirection: "row-reverse",
            }}
          >
            {post.parentPost.mediaUrl && (
              <img
                src={getImageUrl(post.parentPost.mediaUrl)}
                style={{
                  width: "80px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
                alt=""
              />
            )}
            <div style={{ flex: 1 }}>
              <h4
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "0.95rem",
                  color: "#333",
                }}
              >
                {post.parentPost.title}
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#666",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post.parentPost.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Actions - לייק, תגובות, שמירה */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 15px",
          borderTop: "1px solid #f0f2f5",
        }}
      >
        <div style={{ display: "flex", gap: "20px" }}>
          <button
            onClick={handleLike}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px",
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>{isLiked ? "❤️" : "🤍"}</span>
            <span
              style={{
                fontSize: "0.9rem",
                color: "#65676b",
                fontWeight: "600",
              }}
            >
              {likes.length}
            </span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px",
            }}
          >
            <span style={{ fontSize: "1.3rem" }}>💬</span>
            <span
              style={{
                fontSize: "0.9rem",
                color: "#65676b",
                fontWeight: "600",
              }}
            >
              {allComments.length}
            </span>
          </button>

          {/* כפתור I Made This - רק בפוסטים מסוג פרויקט */}
          {post.postType === "project" && (
            <button
              onClick={() => navigate(`/post/${post._id}`)}
              style={{
                backgroundColor: "#ff4757",
                color: "white",
                border: "none",
                padding: "5px 15px",
                borderRadius: "20px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              🛠️ I Made This!
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(post._id);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.3rem",
            }}
            title="שמור פוסט"
          >
            {isSaved ? "📂" : "💾"}
          </button>
          {isOwner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(post._id);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
              title="מחק פוסט"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#fcfcfc",
            borderTop: "1px solid #f0f2f5",
          }}
        >
          <CommentSection
            allComments={allComments}
            currentUserId={currentUserId}
            handleDeleteComment={handleDeleteComment}
            handleLikeComment={handleLikeComment}
            handleAddComment={handleAddComment}
            commentText={commentText}
            setCommentText={setCommentText}
          />
        </div>
      )}
    </div>
  );
};

export default PostCard;
