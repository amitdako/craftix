import React from "react";

const CommentSection = ({
  allComments,
  currentUserId,
  handleDeleteComment,
  handleLikeComment,
  handleAddComment,
  commentText,
  setCommentText,
}) => {
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

  return (
    <div style={{ direction: "rtl", textAlign: "right" }}>
      <h3
        style={{
          fontSize: "1.1rem",
          marginBottom: "15px",
          color: "#65676b",
          fontWeight: "bold",
        }}
      >
        תגובות הקהילה
      </h3>

      {/* טופס הוספת תגובה */}
      <form
        onSubmit={handleAddComment}
        style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
      >
        <input
          type="text"
          placeholder="כתוב תגובה..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 15px",
            borderRadius: "20px",
            border: "1px solid #ddd",
            outline: "none",
            fontSize: "0.9rem",
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "8px 18px",
            borderRadius: "20px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          שלח
        </button>
      </form>

      {/* רשימת תגובות */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {allComments.map((comment) => (
          <div
            key={comment._id}
            style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}
          >
            <div
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                backgroundColor: "#eee",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {comment.author?.profileImage ? (
                <img
                  src={`http://localhost:5000${comment.author.profileImage}`}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ccc",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {comment.author?.displayName?.[0]}
                </div>
              )}
            </div>

            <div
              style={{
                backgroundColor: "#f0f2f5",
                padding: "10px 15px",
                borderRadius: "18px",
                position: "relative",
                maxWidth: "85%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "2px",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    color: "#333",
                  }}
                >
                  {comment.author?.displayName}
                </span>
                {/* הצגת תאריך ושעה לכל תגובה */}
                <span style={{ fontSize: "0.7rem", color: "#888" }}>
                  {formatDateTime(comment.createdAt)}
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.95rem",
                  color: "#1c1e21",
                  lineHeight: "1.4",
                }}
              >
                {comment.text}
              </div>

              <div style={{ display: "flex", gap: "15px", marginTop: "5px" }}>
                <button
                  onClick={() => handleLikeComment(comment._id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    color: comment.likes?.includes(currentUserId)
                      ? "#ff4d4d"
                      : "#65676b",
                  }}
                >
                  לייק ({comment.likes?.length || 0})
                </button>
                {comment.author?._id === currentUserId && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      color: "#dc3545",
                    }}
                  >
                    מחק
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
