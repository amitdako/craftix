import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import CommentSection from "../CommentSection/CommentSection";
import { styles } from "./PostDetails.styles";

const PostDetails = ({ currentUser, onUserUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // States לניהול אינטראקציות ותוכן
  const [likes, setLikes] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [showComments, setShowComments] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [shareComment, setShareComment] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
        setLikes(res.data.likes || []);
        setAllComments(res.data.comments || []);
      } catch (err) {
        console.error("Error fetching post details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  // פונקציית עזר לעיצוב תאריך ושעה בעברית
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

  const currentUserId = currentUser?.id || currentUser?._id;
  const isLiked = likes.includes(currentUserId);
  const isOwner =
    currentUser &&
    post?.author &&
    (post.author._id || post.author) === currentUserId;

  const isSaved = Array.isArray(currentUser?.savedPosts)
    ? currentUser.savedPosts.some((savedItem) => {
        const savedId =
          typeof savedItem === "object" ? savedItem._id : savedItem;
        return String(savedId) === String(post?._id);
      })
    : false;

  // פונקציות פעולה
  const handleLike = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/posts/like/${post._id}`);
      setLikes(response.data.likes || []);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/posts/save/${post._id}`);
      if (onUserUpdate) {
        onUserUpdate({ savedPosts: response.data.savedPosts });
      }
    } catch (err) {
      console.error("Error saving post:", err);
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
    if (window.confirm("בטוח שברצונך למחוק את התגובה?")) {
      try {
        const response = await api.delete(
          `/posts/${post._id}/comment/${commentId}`,
        );
        setAllComments(response.data);
      } catch (err) {
        console.error("Error deleting comment:", err);
      }
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        טוען נתונים מהשרת... 🛠️
      </div>
    );
  if (!post)
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "#dc3545" }}>
        הפוסט לא נמצא. 😕
      </div>
    );

  const isImplementation = post.postType === "implementation";

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "20px",
        direction: "rtl",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          background: "none",
          border: "none",
          color: "#007bff",
          cursor: "pointer",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <span>→</span> חזרה לפיד
      </button>

      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "15px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          border: "1px solid #eee",
          overflow: "hidden",
        }}
      >
        {/* Header פוסט */}
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
            }}
          >
            {post.author?.profileImage ? (
              <img
                src={getImageUrl(post.author.profileImage)}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span>{post.author?.displayName?.[0] || "U"}</span>
            )}
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {post.author?.displayName}
            </div>
            {/* הצגת תאריך ושעה בראש הפוסט */}
            <div style={{ fontSize: "0.75rem", color: "#888" }}>
              {formatDateTime(post.createdAt)}
            </div>
          </div>
          {(post.category || post.parentPost?.category) && (
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
              {post.category || post.parentPost?.category}
            </span>
          )}
        </div>

        {/* מדיה */}
        {post.mediaUrl && (
          <div
            style={{
              width: "100%",
              maxHeight: "500px",
              overflow: "hidden",
              backgroundColor: "#f0f2f5",
            }}
          >
            {post.mediaType === "video" ? (
              <video
                src={getImageUrl(post.mediaUrl)}
                controls
                style={{ width: "100%", display: "block" }}
              />
            ) : (
              <img
                src={getImageUrl(post.mediaUrl)}
                alt=""
                style={{ width: "100%", display: "block" }}
              />
            )}
          </div>
        )}

        {/* תוכן */}
        <div style={{ padding: "20px", textAlign: "right" }}>
          {post.title && (
            <h2
              style={{
                fontSize: "1.4rem",
                margin: "0 0 10px 0",
                color: "#1c1e21",
                fontWeight: "800",
              }}
            >
              {post.title}
            </h2>
          )}
          <p
            style={{
              fontSize: "1rem",
              lineHeight: "1.5",
              color: "#1c1e21",
              whiteSpace: "pre-wrap",
            }}
          >
            {post.content}
          </p>
        </div>

        {/* תיבת שיתוף ביצוע (Facebook Style) */}
        {isImplementation && post.parentPost && (
          <div
            style={{
              margin: "0 20px 20px",
              padding: "15px",
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              backgroundColor: "#fcfcfc",
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
                marginBottom: "12px",
                justifyContent: "flex-start",
                flexDirection: "row-reverse",
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                {post.parentPost.author?.displayName}
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
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
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
                gap: "12px",
                flexDirection: "row-reverse",
              }}
            >
              {post.parentPost.mediaUrl && (
                <img
                  src={getImageUrl(post.parentPost.mediaUrl)}
                  style={{
                    width: "100px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                  alt=""
                />
              )}
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    margin: "0 0 5px 0",
                    fontSize: "0.95rem",
                    color: "#333",
                    fontWeight: "bold",
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

        {/* Footer פעולות */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 15px",
            borderTop: "1px solid #eee",
          }}
        >
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <button
              onClick={handleLike}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: "20px",
                  color: isLiked ? "#ff4d4d" : "#ccc",
                }}
              >
                {isLiked ? "❤️" : "🤍"}
              </span>
              <span style={{ fontSize: "0.9rem", color: "#65676b" }}>
                {likes.length}
              </span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#65676b",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ fontSize: "20px" }}>💬</span>
              <span>{allComments.length}</span>
            </button>

            {!isImplementation && (
              <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                style={{
                  backgroundColor: "#ff4757",
                  color: "white",
                  border: "none",
                  padding: "6px 15px",
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

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleSave}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
            >
              {isSaved ? "📂" : "💾"}
            </button>
            {isOwner && (
              <button
                onClick={() => alert("מחיקת פוסט")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  color: "#dc3545",
                }}
              >
                🗑️
              </button>
            )}
          </div>
        </div>

        {/* טופס I Made This מהיר */}
        {isFormOpen && (
          <div
            style={{
              padding: "15px",
              backgroundColor: "#fff5f5",
              borderTop: "1px solid #ffe3e3",
              textAlign: "right",
            }}
          >
            <h4
              style={{
                margin: "0 0 10px 0",
                fontSize: "0.9rem",
                color: "#ff4757",
              }}
            >
              שתפו את הביצוע שלכם לפרויקט זה!
            </h4>
            <textarea
              placeholder="איך יצא לכם לבנות את זה?"
              value={shareComment}
              onChange={(e) => setShareComment(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                marginBottom: "10px",
                minHeight: "60px",
                outline: "none",
              }}
            />
            <button
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              פרסם שיתוף
            </button>
          </div>
        )}
      </div>

      {/* רכיב התגובות המלא */}
      {showComments && (
        <div style={{ marginTop: "20px" }}>
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

export default PostDetails;
