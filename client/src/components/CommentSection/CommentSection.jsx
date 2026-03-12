// CommentSection.jsx
import React from "react";
import * as S from "./CommentSection.styles";

const CommentSection = ({
  allComments,
  currentUserId,
  handleDeleteComment,
  handleCommentLike,
  handleAddComment,
  commentText,
  setCommentText,
}) => {
  return (
    <div style={S.commentSectionStyle} onClick={(e) => e.stopPropagation()}>
      <hr style={{ border: "0.5px solid #eee", margin: "15px 0" }} />

      {Array.isArray(allComments) && allComments.length > 0 ? (
        allComments.map((comment) => {
          const isCommentOwner =
            (comment.author?._id || comment.author)?.toString() ===
            currentUserId?.toString();

          return (
            <div key={comment._id} style={S.commentItemStyle}>
              <img
                src={
                  comment.author?.profileImage
                    ? `http://localhost:5000${comment.author.profileImage}`
                    : "https://via.placeholder.com/30"
                }
                style={S.commentAvatarStyle}
                alt="avatar"
              />
              <div style={S.commentBubbleStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={S.commentAuthorNameStyle}>
                    {comment.author?.displayName || "User"}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {isCommentOwner && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteComment(comment._id);
                        }}
                        style={S.commentDeleteIconStyle}
                      >
                        🗑️
                      </button>
                    )}
                    <button
                      onClick={(e) => handleCommentLike(comment._id, e)}
                      style={S.commentLikeBtnStyle}
                    >
                      {comment.likes?.includes(currentUserId) ? "❤️" : "🤍"}{" "}
                      {comment.likes?.length || 0}
                    </button>
                  </div>
                </div>
                <p style={S.commentTextStyle}>{comment.text}</p>
              </div>
            </div>
          );
        })
      ) : (
        <p style={{ textAlign: "center", fontSize: "12px", color: "#999" }}>
          No comments yet. Start the conversation!
        </p>
      )}

      <form onSubmit={handleAddComment} style={S.commentFormStyle}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={S.commentInputStyle}
        />
        <button type="submit" style={S.commentSendBtnStyle}>
          Post
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
