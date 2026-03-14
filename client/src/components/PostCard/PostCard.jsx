import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import CommentSection from "../CommentSection/CommentSection";

const PostCard = ({ post, currentUser, onSave, onDelete, onUserUpdate }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [showComments, setShowComments] = useState(false);
  const [showMadeThisForm, setShowMadeThisForm] = useState(false);
  const [allComments, setAllComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [madeThisText, setMadeThisText] = useState("");
  const navigate = useNavigate();

  const currentUserId = currentUser?.id || currentUser?._id;
  const isLiked = likes.includes(currentUserId);
  const isOwner =
    currentUser &&
    post.author &&
    (post.author._id || post.author) === currentUserId;

  const isSaved = Array.isArray(currentUser?.savedPosts)
    ? currentUser.savedPosts.some((savedItem) => {
        const savedId =
          typeof savedItem === "object" ? savedItem._id : savedItem;
        return String(savedId) === String(post._id);
      })
    : false;

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
    e.stopPropagation();
    try {
      const response = await api.post(`/posts/like/${post._id}`);
      setLikes(response.data.likes);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleMadeThisClick = (e) => {
    e.stopPropagation();
    setShowMadeThisForm(!showMadeThisForm);
  };

  // פונקציה מתוקנת עם עצירת הבעבוע (Propagation) וטיפול בשגיאות
  const handleSubmitMadeThis = async (e) => {
    if (e) e.stopPropagation();

    if (!madeThisText.trim()) {
      alert("נא לכתוב תוכן לפני הפרסום");
      return;
    }

    try {
      // אנחנו מוסיפים כאן שדות שסביר להניח שה-Backend שלך דורש
      const response = await api.post("/posts", {
        title: `ביצוע ל-${post.title || "פרויקט"}`, // הוספת כותרת אוטומטית
        content: madeThisText,
        postType: "implementation",
        parentPost: post._id,
        category: post.category || "General", // העברת הקטגוריה מהפוסט המקורי
      });

      console.log("פורסם בהצלחה:", response.data);
      alert("הביצוע שלך פורסם בהצלחה!");
      setMadeThisText("");
      setShowMadeThisForm(false);

      if (onUserUpdate) onUserUpdate();
    } catch (err) {
      // כאן התיקון הקריטי כדי שתראה *למה* השרת כועס
      console.error("שגיאת שרת מפורטת:", err.response?.data);
      const errorMessage =
        err.response?.data?.message || "ודא שכל שדות החובה מלאים";
      alert("שגיאה: " + errorMessage);
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
      {/* Header */}
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
            onClick={(e) => e.stopPropagation()} // מונע ניווט כפול
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

      {/* Post Body */}
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

      {/* תיבת שיתוף מקורי */}
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
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/post/${post.parentPost._id || post.parentPost}`);
          }}
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
            </div>
          </div>
        </div>
      )}

      {/* Footer Actions */}
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
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(!showComments);
            }}
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

          {post.postType === "project" && (
            <button
              onClick={handleMadeThisClick}
              style={{
                backgroundColor: showMadeThisForm ? "#65676b" : "#ff4757",
                color: "white",
                border: "none",
                padding: "5px 15px",
                borderRadius: "20px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              🛠️ {showMadeThisForm ? "סגור" : "I Made This!"}
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

      {/* --- אזור טופס "I Made This" המתוקן --- */}
      {showMadeThisForm && (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#fff5f6",
            borderTop: "1px solid #ff4757",
            textAlign: "right",
          }}
          onClick={(e) => e.stopPropagation()} // מונע מהלחיצה על הטופס להפעיל ניווט
        >
          <h4 style={{ margin: "0 0 10px 0", color: "#ff4757" }}>
            שתפו את הביצוע שלכם לפרויקט הזה! ✨
          </h4>
          <textarea
            value={madeThisText}
            onChange={(e) => setMadeThisText(e.target.value)}
            placeholder="איך היה? יש לכם טיפים לאחרים?"
            style={{
              width: "100%",
              minHeight: "80px",
              borderRadius: "10px",
              padding: "10px",
              border: "1px solid #ddd",
              fontFamily: "inherit",
              resize: "none",
              marginBottom: "10px",
            }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={(e) => handleSubmitMadeThis(e)} // שים לב להעברת ה-e כאן
              style={{
                backgroundColor: "#ff4757",
                color: "white",
                border: "none",
                padding: "8px 20px",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              פרסם עכשיו
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMadeThisForm(false);
              }}
              style={{
                background: "none",
                border: "1px solid #ccc",
                padding: "8px 20px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#fcfcfc",
            borderTop: "1px solid #f0f2f5",
          }}
          onClick={(e) => e.stopPropagation()}
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
