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

  const t = translations[currentLang] || translations.en;

  return (
    <div style={s.commentSectionContainer}>
      <h3 style={s.titleStyle}>{t.commentsTitle}</h3>

      {/* Adding comment form */}
      <form onSubmit={handleAddComment} style={s.formStyle}>
        <input
          type="text"
          placeholder={t.commentPlaceholder}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={s.inputStyle}
        />
        <button type="submit" style={s.sendBtnStyle}>
          {t.send} {/* כפתור שליחה */}
        </button>
      </form>

      {/* list of comments */}
      <div style={s.commentListWrapper}>
        {allComments.map((comment) => (
          <div key={comment._id} style={s.commentItemRow}>
            {/* Avatar Section */}
            <div style={s.avatarContainer}>
              {comment.author?.profileImage ? (
                <img
                  src={comment.author.profileImage}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={s.avatarPlaceholder}>
                  {comment.author?.displayName?.[0]}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div style={s.commentBubble}>
              <div style={s.bubbleHeader}>
                <span style={s.authorName}>{comment.author?.displayName}</span>
                <span style={s.dateLabel}>
                  {formatDateTime(comment.createdAt)}
                </span>
              </div>

              <div style={s.commentTextBody}>{comment.text}</div>

              {/* Actions Section */}
              <div style={s.actionButtonsWrapper}>
                <button
                  onClick={() => handleLikeComment(comment._id)}
                  style={{
                    ...s.actionBtnBase,
                    color: comment.likes?.includes(currentUserId)
                      ? "#ff4d4d"
                      : "#65676b",
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  {t.likes}{" "}
                  <span dir="ltr">({comment.likes?.length || 0})</span>
                </button>

                {comment.author?._id === currentUserId && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    style={{ ...s.actionBtnBase, color: "#dc3545" }}
                  >
                    {t.delete}
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
