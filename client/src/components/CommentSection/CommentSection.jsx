import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * רכיב התגובות המתוקן - פותר את בעיית הניווט והלייקים
 */
const CommentSection = ({
  allComments,
  currentUserId,
  handleAddComment,
  handleLikeComment,
  handleDeleteComment,
  commentText,
  setCommentText,
}) => {
  const navigate = useNavigate();

  const getImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `http://localhost:5000${path}`;
  };

  // פונקציית עזר לניווט בטוח לפרופיל
  const goToProfile = (e, authorId) => {
    e.preventDefault();
    e.stopPropagation();
    if (authorId) {
      navigate(`/profile/${authorId}`);
    }
  };

  return (
    <div
      style={{
        marginTop: "20px",
        borderTop: "1px solid #eee",
        padding: "15px",
        backgroundColor: "#f9f9f9",
      }}
      onClick={(e) => e.stopPropagation()} // מונע מהלחיצה לפתוח את הפוסט
    >
      <h4 style={{ marginBottom: "15px" }}>Comments ({allComments.length})</h4>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {allComments.map((comment) => {
          const authorId = comment.author?._id || comment.author;
          const isOwner = String(authorId) === String(currentUserId);
          const isLiked = comment.likes?.includes(currentUserId);

          return (
            <div key={comment._id} style={{ display: "flex", gap: "10px" }}>
              {/* אווטאר לחיץ לפרופיל */}
              <div
                onClick={(e) => goToProfile(e, authorId)}
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  backgroundColor: "#eee",
                  overflow: "hidden",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                {comment.author?.profileImage ? (
                  <img
                    src={getImageUrl(comment.author.profileImage)}
                    alt="Avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      backgroundColor: "#6c757d",
                      color: "white",
                    }}
                  >
                    {comment.author?.displayName?.[0] || "U"}
                  </div>
                )}
              </div>

              {/* תוכן התגובה */}
              <div style={{ flex: 1 }}>
                <span
                  onClick={(e) => goToProfile(e, authorId)}
                  style={{
                    cursor: "pointer",
                    color: "#007bff",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                  }}
                >
                  {comment.author?.displayName || "User"}
                </span>

                <p
                  style={{
                    margin: "3px 0",
                    fontSize: "0.95rem",
                    color: "#333",
                  }}
                >
                  {comment.text}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "5px",
                    fontSize: "0.85rem",
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeComment(comment._id);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: isLiked ? "#ff4d4d" : "#666",
                      padding: 0,
                      fontWeight: isLiked ? "bold" : "normal",
                    }}
                  >
                    {isLiked ? "❤️ Liked" : "🤍 Like"} (
                    {comment.likes?.length || 0})
                  </button>

                  {isOwner && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteComment(comment._id);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#ff4757",
                        padding: 0,
                      }}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* טופס הוספת תגובה */}
      <form
        onSubmit={handleAddComment}
        style={{ marginTop: "20px", display: "flex", gap: "10px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "20px",
            border: "1px solid #ddd",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 15px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
