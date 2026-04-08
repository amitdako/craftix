import React from "react";
import * as s from "./CommentSection.styles";
import { translations } from "../../translations";

const CommentSection = ({
  currentLang,
  allComments,
  currentUserId,
  handleDeleteComment,
  handleLikeComment,
  handleAddComment,
  commentText,
  setCommentText,
}) => {
  const isHe = currentLang === "he";
  const t = translations[currentLang] || translations.en;
  const hasText = commentText?.trim().length > 0;

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString(isHe ? "he-IL" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      style={{ ...s.commentSectionContainer, direction: isHe ? "rtl" : "ltr" }}
    >
      <h3 style={s.titleStyle}>{t.commentsTitle}</h3>

      <form onSubmit={handleAddComment} style={s.formStyle}>
        <input
          type="text"
          placeholder={t.commentPlaceholder || "Add a comment..."}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={s.inputStyle}
        />
        <button
          type="submit"
          disabled={!hasText}
          style={s.sendBtnStyle(hasText)}
        >
          {t.send || "Post"}
        </button>
      </form>

      <div style={s.commentListWrapper}>
        {allComments.map((comment) => (
          <div key={comment._id} style={s.commentItemRow}>
            <div style={s.avatarContainer}>
              {comment.author?.profileImage ? (
                <img
                  src={comment.author.profileImage}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={s.avatarPlaceholder}>
                  {comment.author?.displayName?.[0] || "U"}
                </div>
              )}
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div style={{ textAlign: "start" }} dir="auto">
                <span style={s.authorName}>{comment.author?.displayName}</span>
                <span style={s.commentTextBody}>{comment.text}</span>
              </div>

              <div style={s.actionButtonsWrapper}>
                <span style={s.dateLabel}>
                  {formatDateTime(comment.createdAt)}
                </span>

                <button
                  onClick={() => handleLikeComment(comment._id)}
                  style={{
                    ...s.actionBtnBase,
                    color: comment.likes?.includes(currentUserId)
                      ? "#ed4956"
                      : "#8e8e8e",
                  }}
                >
                  {comment.likes?.length || 0} {t.likes || "likes"}
                </button>

                {comment.author?._id === currentUserId && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    style={{ ...s.actionBtnBase, color: "#ed4956" }}
                  >
                    {t.delete || "Delete"}
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
